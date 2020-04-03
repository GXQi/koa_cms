const router = require('koa-router')()

router.get('/', async (ctx) => {
  ctx.body = 'api接口首页'
})

module.exports = router.routes()