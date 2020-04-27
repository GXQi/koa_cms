const router = require('koa-router')()
    , url = require('url')
    , index = require('./admin/index')
    , login = require('./admin/login')
    , user = require('./admin/user')
    , manage = require('./admin/manage')
    , articlecate = require('./admin/articlecate')
    , article = require('./admin/article')
    , ueditor = require('koa2-ueditor')


//注意上传图片的路由   ueditor.config.js配置图片post的地址
router.all('/editorUpload', ueditor(['public', {
  "imageAllowFiles": [".png", ".jpg", ".jpeg"],
  "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

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
    splitUrl: splitUrl,
    prevPage: ctx.request.headers['referer']    // 上一页地址
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
router.use('/articlecate', articlecate)
router.use('/article', article)

module.exports = router.routes()