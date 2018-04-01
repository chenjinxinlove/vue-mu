import jsonp from 'common/js/jsonp'
import axios from 'axios'
import {commonParams, options} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function getMusicList(topid) {
  return new Promise((resolve, reject) => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    const urlPurl = 'http://localhost:8081/api/music'
    const dataJsonP = Object.assign({}, commonParams, {
      topid,
      needNewCode: 1,
      uin: 0,
      tpl: 3,
      page: 'detail',
      type: 'top',
      platform: 'h5'
    })

    try {
      jsonp(url, dataJsonP, options).then((result) => {
        let songmid = result.songlist.map((item) => item.data.strMediaMid)
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
          result.songlist.forEach((item, index) => {
            result.songlist[index].data.purl = res.data.url_mid.data.midurlinfo[index].purl
          })
          return resolve(result)
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}