import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'
import { Promise } from 'core-js/library/web/timers'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  return new Promise((resolve, reject) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const urlPurl = 'http://localhost:8081/api/music'
    const data = Object.assign({}, commonParams, {
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq',
      order: 'listen',
      begin: 0,
      num: 80,
      songstatus: 1,
      singermid: singerId
    })
    try {
      jsonp(url, data, options).then((result) => {
        let songmid = result.data.list.map((item) => item.musicData.strMediaMid)
        const data = Object.assign({}, {
          'comm': {
            'g_tk': 5381,
            'inCharset': 'utf-8',
            'outCharset': 'utf-8',
            'notice': 0,
            'format': 'json',
            'platform': 'h5',
            'needNewCode': 1,
            'uin': 0
          },
          url_mid: {
            'module': 'vkey.GetVkeyServer',
            'method': 'CgiGetVkey',
            param: {
              'guid': '4305379724',
              songmid: songmid,
              songtype: Array.from({length: songmid.length}).fill(0),
              'uin': '0',
              'loginflag': 0,
              'platform': '23'
            }
          }
        })
        axios.post(urlPurl, data).then((res) => {
          result.data.list.forEach((item, index) => {
            result.data.list[index].musicData.purl = res.data.url_mid.data.midurlinfo[index].purl
          })
          return resolve(result)
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}
