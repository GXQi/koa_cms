const router = require('koa-router')()
    , svgCaptcha = require('svg-captcha')
    , tools = require('../../model/tools')
    , DB = require('../../model/db')

router.get('/', async (ctx) => {
  await ctx.render('admin/login')
})
.post('/doLogin', async (ctx) => {
  // console.log(ctx.request.body)
  // 匹配数据库
  let username = ctx.request.body.username
  let password = ctx.request.body.password
  let code = ctx.request.body.code

  // 1.验证用户名密码是否合法 2.去数据库匹配  3.成功后把用户信息写入session
  if(code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()) {
    // 后台也要验证用户名密码是否合法

    var result = await DB.find('admin', {'username': username, 'password': tools.md5(password)})
    if(result.length) {
      // console.log(result)
      ctx.session.userinfo = result[0]

      // 更新用户表 改变用户登录时间
      await DB.update('admin', {'_id': DB.getObjectID(result[0]._id)}, {
        'last_time': new Date()
      })

      ctx.redirect(ctx.state.__HOST__ + '/admin')
    } else {
      ctx.render('admin/error', {
        message: '用户名或密码错误',
        redirect: ctx.state.__HOST__ + '/admin/login'
      })
    }
  } else {
    // console.log('验证码失败')
    ctx.render('admin/error', {
      message: '验证码错误',
      redirect: ctx.state.__HOST__ + '/admin/login'
    })
  }
})
// 验证码
.get('/code', async (ctx) => {
  let captcha = svgCaptcha.create({
  // let captcha = svgCaptcha.createMathExpr({
    size: 4,
    fontSize: 50,
    width: 120,
    height: 34,
    // background: "#cc9966"
  })
  // console.log(captcha)
  // 将验证码保存到session
  ctx.session.code = captcha.text
  // 设置响应头
  ctx.response.type = 'image/svg+xml'
  ctx.body = captcha.data
})
// 退出登录
.get('/loginOut', async (ctx) => {
  ctx.session.userinfo = null
  ctx.redirect(ctx.state.__HOST__ + '/admin/login')
})

module.exports = router.routes()