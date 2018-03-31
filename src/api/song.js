import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    let data = res.data
    let reg = /^\w+\((.*?)\)$/
    let mathes = data.match(reg)
    if (mathes) {
      data = JSON.parse(mathes[1])
      return Promise.resolve(data)
    } else {
      return Promise.reject(new Error('歌词请求错误'))
    }
  })
}