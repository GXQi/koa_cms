const router = require('koa-router')()
    , url = require('url')
    , DB = require('../model/db.js')

// 配置中间件
router.use(async (ctx, next) => {
  var pathname = url.parse(ctx.request.url).pathname

  // 导航条数据
  var navResult = await DB.find('nav', {$or: [{"status": '1'}, {'status': 1}]}, {}, {
    sortJson: {'sort': 1}
  })
  ctx.state.nav = navResult
  ctx.state.pathname = pathname
  await next()
})

router.get('/', async (ctx) => {
  var focusResult = await DB.find('focus', {$or: [{"status": '1'}, {'status': 1}]}, {}, {
    sortJson: {'sort': 1}
  })
  await ctx.render('default/index', {
    focus: focusResult
  })
})
.get('/news', async (ctx) => {
  await ctx.render('default/news')
})
.get('/service', async (ctx) => {
  var serviceList = await DB.find('article', {'pid': '5ab34b61c1348e1148e9b8c2', $or: [{"status": '1'}, {'status': 1}]})
  // console.log(serviceList)
  await ctx.render('default/service', {
    serviceList: serviceList
  })
})
.get('/content/:id', async (ctx) => {
  // console.log(ctx.params)
  var id = ctx.params.id
  var contentResult = await DB.find('article', {'_id': DB.getObjectID(id)})
  await ctx.render('default/content', {
    list: contentResult[0]
  })
})
.get('/about', async (ctx) => {
  await ctx.render('default/about')
})
.get('/case', async (ctx) => {
  var cateList = await DB.find('articlecate', {'pid': '5ab3209bdf373acae5da097e', $or: [{"status": '1'}, {'status': 1}]})
  var pid = ctx.query.pid
    , page = ctx.query.page || 1
    , pageSize = 3
    , articleList
    , articleNum

  // console.log(cateList)
  if(pid) {
    articleList = await DB.find('article', {'pid': pid}, {}, {
      page,
      pageSize
    })
    articleNum = await DB.count('article', {'pid': pid})
    console.log(articleNum)
  } else {
    // 循环子分类获取子分类下面的所有内容
    var subCateArr = []
    for(var i = 0; i < cateList.length; i++) {
      subCateArr.push(cateList[i]._id.toString())
    }
    articleList = await DB.find('article', {'pid': {$in: subCateArr}}, {}, {
      page,
      pageSize
    })
    articleNum = await DB.count('article', {'pid': {$in: subCateArr}})
  }
  await ctx.render('default/case', {
    cateList: cateList,
    articleList: articleList,
    pid: pid,
    page: page,
    totalPages: Math.ceil(articleNum/pageSize)
  })
})
.get('/connect', async (ctx) => {
  await ctx.render('default/connect')
})

module.exports = router.routes()