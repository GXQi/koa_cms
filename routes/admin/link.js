const router = require('koa-router')()
    , DB = require('../../model/db')
    , tools = require('../../model/tools')

router.get('/', async (ctx) => {
  var page = ctx.query.page || 1
  var pageSize = 3
  var result = await DB.find('link', {}, {}, {
    page,
    pageSize,
    sortJson: {
      "add_time": -1
    }
  })
  var count = await DB.count('link', {})
  await ctx.render('admin/link/list', {
    list: result,
    totalPages: Math.ceil(count/pageSize),
    page: page
  })
})
.get('/add', async (ctx) => {
  await ctx.render('admin/link/add')
})
.post('/doAdd', tools.multer().single('pic'), async (ctx) => {
  var title = ctx.req.body.title.trim()
  var url = ctx.req.body.url
  var sort = ctx.req.body.sort
  var status = ctx.req.body.status
  var pic = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  var add_time = tools.getTime()

  var json = {
    title, url, sort, status, pic, add_time
  }

  var result = await DB.insert('link', json)
  ctx.redirect(ctx.state.__HOST__ + '/admin/link')
})
.get('/edit', async (ctx) => {
  var id = ctx.query.id
  var result = await DB.find('link', {'_id': DB.getObjectID(id)})
  console.log(result)
  await ctx.render('admin/link/edit', {
    list: result[0],
    prevPage: ctx.state.G.prevPage
  })
})
.post('/doEdit', tools.multer().single('pic'), async (ctx) => {
  console.log(ctx.req.body)
  var id = ctx.req.body.id
  var title = ctx.req.body.title.trim()
  var url = ctx.req.body.url
  var sort = ctx.req.body.sort
  var status = ctx.req.body.status
  var pic = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  var prevPage = ctx.req.body.prevPage
  
  if(pic) {
    var json = {
      title, url, sort, status, pic
    }
  } else {
    var json = {
      title, url, sort, status
    }
  }

  var result = await DB.update('link', {'_id': DB.getObjectID(id)}, json)
  if(prevPage) {
    ctx.redirect(prevPage)
  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/link')
  }
})

module.exports = router.routes()