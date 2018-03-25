var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var axios = require('axios')
let bodyParser = require('body-parser')
var cors = require('cors')
// default port where dev server listens for incoming traffic
var port = '8081'
// automatically open browser, if not set will be false

var app = express()

var apiRoutes = express.Router()


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

apiRoutes.post('/music', function (req, res) {
  var url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
  let data = req.body
  axios({
    method: 'post',
    url: url,
    headers: {
        Host:"ustbhuangyi.com",
        Origin:"http://ustbhuangyi.com",
        Referer:"http://ustbhuangyi.com/music/",
        'Content-Type': 'application/json'
    },
    responseType: 'json',
    data: data
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

var server = app.listen(port)