const router = require('koa-router')()
    , DB = require('../../model/db')
    , tools = require('../../model/tools')

router.get('/', async (ctx) => {
  var result = await DB.find('articlecate', {})
  await ctx.render('admin/articlecate/index', {
    list: tools.cateToList(result)
  })
})
.get('/add', async (ctx) => {
  // 获取一级分类
  var result = await DB.find('articlecate', {'pid': '0'})
  await ctx.render('admin/articlecate/add', {
    catelist: result
  })
})
.post('/doAdd', async (ctx) => {
  console.log(ctx.request.body)
  var addData = ctx.request.body
  var result = await DB.insert('articlecate', addData)
  ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
})
.get('/edit', async (ctx) => {
  var id = ctx.query.id
  var result = await DB.find('articlecate', {'_id': DB.getObjectID(id)})
  var allResult = await DB.find('articlecate', {})
  console.log(result)
  await ctx.render('admin/articlecate/edit', {
    list: result[0],
    catelist: tools.cateToList(allResult),
    prevPage: ctx.state.G.prevPage
  })
})
.post('/doEdit', async (ctx) => {
  console.log(ctx.request.body)
  var editData = ctx.request.body
  var id = editData.id
  var title = editData.title
  var description = editData.description
  var keywords = editData.keywords
  var pid = editData.pid
  var status = editData.status
  var result = await DB.update('articlecate', {'_id': DB.getObjectID(id)}, {
    title, description, keywords, pid, status
  })
  ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
})

module.exports = router.routes()