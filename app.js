const Koa = require('koa')
    , router = require('koa-router')()
    , path = require('path')
    , render = require('koa-art-template')
    , static = require('koa-static')
    , session = require('koa-session')
    , bodyParser = require('koa-bodyparser')
    // 引入路由模块
    , admin = require('./routes/admin')
    , api = require('./routes/api')
    , index = require('./routes/index')

const app = new Koa()

// 配置post提交数据的中间件
app.use(bodyParser());

// 配置session中间件
app.keys = ['some secret hurr']
 
const CONFIG = {
  key: 'koa:sess',
  maxAge: 864000,
  // autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true, 
  rolling: true, 
  renew: false,
}
app.use(session(CONFIG, app))

// 配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});

// 配置静态资源中间件
app.use(static(__dirname + '/public'));

// 配置层级路由
router.use('/admin', admin)
router.use('/api', api)
router.use(index)

app.use(router.routes())
.use(router.allowedMethods())

app.listen(3000)