const router = require('koa-router')()

router.get('/', async (ctx) => {
  // ctx.body = '用户管理'
  await ctx.render('admin/user/list')
})
.get('/add', async (ctx) => {
  // ctx.body = '增加用户'
  await ctx.render('admin/user/add')
})
.get('/edit', async (ctx) => {
  ctx.body = '编辑用户'
})
.get('/delete', async (ctx) => {
  ctx.body = '删除用户'
})

module.exports = router.routes()