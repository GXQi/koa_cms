const router = require('koa-router')()
    , DB = require('../../model/db')
    , tools = require('../../model/tools')

router.get('/', async (ctx) => {
  // ctx.body = '用户管理'
  var result = await DB.find('admin', {})
  await ctx.render('admin/manage/list', {
    list: result
  })
})
.get('/add', async (ctx) => {
  // ctx.body = '增加用户'
  await ctx.render('admin/manage/add')
})
.post('/doAdd', async (ctx) => {
  // 1. 获取表单提交的数据
  // 2. 验证表单数据是否合法
  // 3. 在数据库查询当前要增加的管理员是否存在
  // 4. 增加管理员
  var username = ctx.request.body.username
  var password = ctx.request.body.password
  var rpassword = ctx.request.body.rpassword

  // if(!/^\w{4, 20}/.test(username)) {
  if(!username) {
    await ctx.render('admin/error', {
      message: '用户名不合法',
      redirect: ctx.state.__HOST__ + '/admin/manage/add'
    })
  } else if (password != rpassword || password.length < 6) {
    await ctx.render('admin/error', {
      message: '密码不一致或者小于6位',
      redirect: ctx.state.__HOST__ + '/admin/manage/add'
    })
  } else {
    // 数据库查询当前管理员是否存在
    var findResult = await DB.find('admin', {'username': username})
    if(findResult.length > 0) {
      await ctx.render('admin/error', {
        message: '管理员用户名已存在',
        redirect: ctx.state.__HOST__ + '/admin/manage/add'
      })
    } else {
      var addResult = await DB.insert('admin', {'username': username, 'password': tools.md5(password), 'status': 1, 'last_time': ''})
      ctx.redirect(ctx.state.__HOST__ + '/admin/manage')
    }
  }
})
.get('/edit', async (ctx) => {
  // ctx.body = '编辑用户'
  var id = ctx.query.id
  var findResult = await DB.find('admin', {'_id': DB.getObjectID(id)})
  await ctx.render('admin/manage/edit', {
    list: findResult[0]
  })
})
.post('/doEdit', async (ctx) => {
  // ctx.body = '编辑用户'
  try {
    var username = ctx.request.body.username
    var id = ctx.request.body.id
    var password = ctx.request.body.password
    var rpassword = ctx.request.body.rpassword

    if(password != '') {
      if (password != rpassword || password.length < 6) {
        await ctx.render('admin/error', {
          message: '密码不一致或者小于6位',
          redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
        })
      } else {
        // 数据库查询当前管理员是否存在
        var addResult = await DB.update('admin', {'username': username}, {'password': tools.md5(password)})
        ctx.redirect(ctx.state.__HOST__ + '/admin/manage/edit?id=' + id)
      }
    } else {
      ctx.redirect(ctx.state.__HOST__ + '/admin/manage/edit?id=' + id)
    }
  } catch (err) {
    await ctx.render('admin/error', {
      message: err,
      redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
    })
  }
})

module.exports = router.routes()