const router = require('koa-router')()
    , url = require('url')
    , index = require('./admin/index')
    , login = require('./admin/login')
    , user = require('./admin/user')
    , manage = require('./admin/manage')


// 配置中间件 获取url地址
router.use(async (ctx, next) => {
  ctx.state.__HOST__ =  'http://' + ctx.request.header.host
  var pathname = url.parse(ctx.request.url).pathname

  // 左侧菜单选中
  // console.log(pathname.substring(1).split('/'))
  var splitUrl = pathname.substring(1).split('/')
  // 配置全局信息，全局的userinfo
  ctx.state.G =  {
    userinfo: ctx.session.userinfo,
    splitUrl: splitUrl
  }
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
  await ctx.render('admin/index')
})

router.use(index)
router.use('/login', login)
router.use('/user', user)
router.use('/manage', manage)

module.exports = router.routes()