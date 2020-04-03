const router = require('koa-router')()
    , url = require('url')
    , login = require('./admin/login')
    , user = require('./admin/user')


// 配置中间件 获取url地址
router.use(async (ctx, next) => {
  ctx.state.__HOST__ =  'http://' + ctx.request.header.host
  var pathname = url.parse(ctx.request.url).pathname
  // console.log(ctx.session.userinfo)
  if(ctx.session.userinfo) {
    await next()
  } else {
    // console.log(ctx.url)
    if(pathname == '/admin/login' || pathname == '/admin/login/doLogin' || pathname == '/admin/login/code') {
      await next()
    } else {
      ctx.redirect('/admin/login')
    }
  }
})

router.get('/', async (ctx) => {
  // ctx.body = '后台首页'
  await ctx.render('admin/index')
})

router.use('/login', login)
router.use('/user', user)

module.exports = router.routes()