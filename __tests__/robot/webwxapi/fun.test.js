
const {
  getUUID,
  getHostAndLoginCode,
  getWebwxDataTicketFromCookies,
  getBaseRequest,
  getDeviceID,
  getFormateSyncCheckKey,
  getFileMd5,
  getWuFile
} = require('@/robot/webwxapi/fun.js')

describe('robot/webwxapi/fun.js', () => {
  describe('getUUID', () => {
    test('success', () => {
      expect.assertions(1)

      const str = 'window.QRLogin.code = 200; window.QRLogin.uuid = "Qd8I3H7i_w==";'
      const res = getUUID(str)

      expect(res).toBe('Qd8I3H7i_w==')
    })

    test('900', () => {
      expect.assertions(2)

      try {
        getUUID()
      } catch (error) {
        expect(error.status).toBe(900)
        expect(error.message).toBe('获取 uuid 失败')
      }
    })
  })

  describe('getHostAndLoginCode', () => {
    test('408', () => {
      expect.assertions(1)

      const str = 'window.code=408;'
      const res = getHostAndLoginCode(str)

      expect(res).toEqual({
        loginCode: { code: '408' }
      })
    })

    test('201 without userAvatar', () => {
      expect.assertions(1)

      const str = 'window.code=201;userAvatar = \'data:img/jpg;base64,/9j...\';'
      const res = getHostAndLoginCode(str)

      expect(res).toEqual({
        loginCode: {
          code: '201',
          userAvatar: 'data:img/jpg;base64,/9j...'
        }
      })
    })

    test('201 without userAvatar', () => {
      expect.assertions(1)

      const str = 'window.code=201;'
      const res = getHostAndLoginCode(str)

      expect(res).toEqual({
        loginCode: {
          code: '201',
          userAvatar: 'https://res.wx.qq.com/a/wx_fed/webwx/res/static/img/2KriyDK.png'
        }
      })
    })

    test('200', () => {
      expect.assertions(1)

      const str = `window.code=200;
      window.redirect_uri="https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage?ticket=A5jx4eP42GmsYUsWFr5A2tqN@qrticket_0&uuid=Aa0lWznQxA==&lang=zh_CN&scan=1526546884";`

      // "https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage?ticket=A4maKF0Rehyyx3gtOuPDlkQX@qrticket_0&uuid=oZVcEG0qYg==&lang=zh_CN&scan=1531894475"
      const res = getHostAndLoginCode(str)

      expect(res).toEqual({
        host: 'wx2.qq.com',
        loginCode: {
          code: '200',
          query: {
            fun: 'new',
            version: 'v2',
            ticket: 'A5jx4eP42GmsYUsWFr5A2tqN@qrticket_0',
            uuid: 'Aa0lWznQxA==',
            lang: 'zh_CN',
            scan: '1526546884'
          }
        }
      })
    })

    test('901', () => {
      expect.assertions(2)

      try {
        getHostAndLoginCode()
      } catch (error) {
        expect(error.status).toBe(901)
        expect(error.message).toBe('获取 codes 失败')
      }
    })
  })

  describe('getWebwxDataTicketFromCookies', () => {
    test('success', () => {
      expect.assertions(1)

      const cookies = [
        'wxuin=3642174990; Domain=wx2.qq.com; Path=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'wxsid=YO8zmoUn7iutckLH; Domain=wx2.qq.com; Path=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'wxloadtime=1531422868; Domain=wx2.qq.com; Path=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'mm_lang=zh_CN; Domain=wx2.qq.com; Path=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'webwx_data_ticket=gSeYURhH/6K32ealuJwWWICe; Domain…=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'webwxuvid=f6f845b6bbbeee863d5619a980af8eca4855286a…=/; Expires=Sun, 09-Jul-2028 19:14:28 GMT; Secure',
        'webwx_auth_ticket=CIsBEKzV3dAKGoAB9NT+XAP696ELWM7R…=/; Expires=Sun, 09-Jul-2028 19:14:28 GMT; Secure'
      ]
      const res = getWebwxDataTicketFromCookies(cookies)

      expect(res).toBe('gSeYURhH/6K32ealuJwWWICe')
    })

    test('902', () => {
      expect.assertions(2)

      try {
        getWebwxDataTicketFromCookies()
      } catch (error) {
        expect(error.status).toBe(902)
        expect(error.message).toBe('获取 webwxDataTicket 失败')
      }
    })
  })

  describe('getBaseRequest', () => {
    test('success', () => {
      expect.assertions(1)

      const str =
        `<error>
          <ret>0</ret>
          <message></message>
          <skey>@crypt_a397bd88_d4687b76ae759c62dc3be4665356615c</skey>
          <wxsid>hwzOeMNYnm6np4A6</wxsid><wxuin>3642174990</wxuin>
          <pass_ticket>U2WI%2Bj54wHu9eZ54MobYcOEjaJIiFglEHoLGDzjqH%2FQXb7UIDL%2Bh0crF2ucr8bPe</pass_ticket>
          <isgrayscale>1</isgrayscale>
        </error>`
      
      getBaseRequest(str).then(res => {
        expect(res.BaseRequest.Uin).toBe('3642174990')
      })
    })

    test('903', () => {
      expect.assertions(2)

      getBaseRequest().catch(error => {
        expect(error.status).toBe(903)
        expect(error.message).toBe(`Cannot read property 'toString' of undefined`)
      })
    })

    test('904', () => {
      expect.assertions(2)

      getBaseRequest('').catch(error => {
        expect(error.status).toBe(904)
        expect(error.message).toBe('获取 BaseRequest 失败')
      })
    })
  })

  test('getDeviceID', () => {
    expect.assertions(1)

    const id = getDeviceID()
    expect(id.length).toBe(16)
  })

  test('getFormateSyncCheckKey', () => {
    expect.assertions(1)
    
    const key = getFormateSyncCheckKey([{Key: 1, Val: 1}, {Key: 2, Val: 2}])
    expect(key).toBe('1_1|2_2')
  })

  test('getFileMd5', () => {
    expect.assertions(1)

    const buf = new ArrayBuffer(8)
    const md5 = getFileMd5(buf)
    expect(md5).toBe('7dea362b3fac8e00956a4952a3d4f474')
  })

  test('getWuFile', () => {
    expect.assertions(2)
    
    expect(getWuFile()).toBe('WU_FILE_0')
    expect(getWuFile()).toBe('WU_FILE_1')
  })
})
