const router = require('koa-router')()
    , DB = require('../../model/db')
    , tools = require('../../model/tools')

router.get('/', async (ctx) => {
  var result = await DB.find('nav', {})
  await ctx.render('admin/nav/list', {
    list: result
  })
})
.get('/add', async (ctx) => {
  await ctx.render('admin/nav/add')
})
.post('/doAdd', async (ctx) => {
  var title = ctx.request.body.title.trim()
  var url = ctx.request.body.url
  var sort = ctx.request.body.sort
  var status = ctx.request.body.status
  var add_time = tools.getTime()

  var json = {
    title, url, sort, status, add_time
  }

  var result = await DB.insert('nav', json)
  ctx.redirect(ctx.state.__HOST__ + '/admin/nav')
})
.get('/edit', async (ctx) => {
  var id = ctx.query.id
  var result = await DB.find('nav', {'_id': DB.getObjectID(id)})
  await ctx.render('admin/nav/edit', {
    list: result[0]
  })
})
.post('/doEdit', async (ctx) => {
  var id = ctx.request.body.id
  var title = ctx.request.body.title.trim()
  var url = ctx.request.body.url
  var sort = ctx.request.body.sort
  var status = ctx.request.body.status
  
  var json = {
    title, url, sort, status
  }

  var result = await DB.update('nav', {'_id': DB.getObjectID(id)}, json)
  ctx.redirect(ctx.state.__HOST__ + '/admin/nav')
})

module.exports = router.routes()