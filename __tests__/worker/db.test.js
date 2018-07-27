
jest.mock('localforage')

import db from '@/worker/db.js'

describe('worker/db.js', () => {
  test('group', async () => {
    expect.assertions(3)

    const group = {
      groupName: 'test1',
      tos: {
        'm544w4': {
          NickName: 'joe',
          RemarkName: 'joehe'
        }
      }
    }

    // await db('setGroup', {
    //   Uin: '123456',
    //   md5: '123',
    //   group
    // })
    await db('setItem', {
      name: '123456',
      storeName: 'group',
      key: '123',
      value: group
    })

    let list = await db('getGroupList', '123456')
    expect(list).toEqual([ { md5: '123', groupName: 'test1' } ])

    // const res = await db('getGroup', { Uin: '123456', md5: '123' })
    const res = await db('getItem', {
      name: '123456',
      storeName: 'group',
      key: '123'
    })

    expect(res).toEqual(group)

    await db('delGroup', { Uin: '123456', md5: '123' })
    list = await db('getGroupList', '123456')
    expect(list.length).toBe(0)
  })

  test('msg', async () => {
    expect.assertions(3)

    // await db('setMsg', {
    //   Uin: '123456',
    //   key: '123',
    //   msg: 'message'
    // })
    await db('setItem', {
      name: '123456',
      storeName: 'msg',
      key: '123',
      value: 'message'
    })

    // const msg = await db('getMsg', {
    //   Uin: '123456',
    //   key: '123'
    // })
    const msg = await db('getItem', {
      name: '123456',
      storeName: 'msg',
      key: '123'
    })

    expect(msg).toBe('message')

    db('setItem', {
      name: '123456',
      storeName: 'msg',
      key: '123',
      value: 'errorMsg'
    }).catch(err => {
      expect(err.status).toBe(1000)
      expect(err.message).toBe('数据库错误')
    })
  })
})
