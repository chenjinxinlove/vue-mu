import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  const urlPurl = 'http://localhost:8081/api/music'
  return new Promise((resolve, reject) => {
    try {
      const data = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0
      })
      const url = 'api/getCdInfo'

      return axios.get(url, {
        params: data
      }).then((res) => {
        let dataJson = res.data
        let reg = /^\w+\((.*?)\)$/
        let mathes = dataJson.match(reg)
        if (mathes) {
          dataJson = JSON.parse(mathes[1])
          let songmid = dataJson.cdlist[0].songlist.map((item) => item.strMediaMid)
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
            dataJson.cdlist[0].songlist.forEach((item, index) => {
              dataJson.cdlist[0].songlist[index].purl = res.data.url_mid.data.midurlinfo[index].purl
            })
            return resolve(dataJson)
          })
        } else {
          reject(new Error('推荐列表请求错误'))
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}