/**
 * 图片上传模块的使用
 * 1. 安装：cnpm install --save koa-multer
 * 2. 引入 const multer = require('koa-multer')
 * 3. 配置上传目录以后文件名称
 * var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/upload')   // 配置上传图片的目录  注意图片上传的目录必须存在
    },
    filename: function(req, file, cb) {
      // cb(null, file.filename + '-' + Date.now())    // 图片上传后的命名
      var fileFormat = (file.originalname).split('.') // 获取后缀名  分隔数组
      cb(null, Date.now() + '.' + fileFormat[fileFormat.length-1])
    }
  })
  var upload = multer({storage: storage})

  4. 接收数据
  注意： post
  注意： form表单必须加上 enctype="multipart/form-data"
  注意：上传图片目录要存在
  .post('/doAdd', upload.single('pic'), async (ctx) => {
    ctx.body = {
      filename: ctx.req.file.filename,
      body: ctx.req.body
    }
    ctx.redirect(ctx.state.__HOST__ + '/admin/article')
  })
 */
const router = require('koa-router')()
    , multer = require('koa-multer')
    , DB = require('../../model/db')
    , tools = require('../../model/tools')

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/upload')   // 配置上传图片的目录  注意图片上传的目录必须存在
  },
  filename: function(req, file, cb) {
    // cb(null, file.filename + '-' + Date.now())    // 图片上传后的命名
    var fileFormat = (file.originalname).split('.') // 获取后缀名  分隔数组
    cb(null, Date.now() + '.' + fileFormat[fileFormat.length-1])
  }
})
var upload = multer({storage: storage})

router.get('/', async (ctx) => {
  var page = ctx.query.page || 1
  var pageSize = ctx.query.pageSize || 3
  var result = await DB.find('article', {}, {}, {
    page,
    pageSize
  })
  var count = await DB.count('article', {})
  await ctx.render('admin/article/index', {
    list: result,
    totalPages: Math.ceil(count/pageSize),
    page: page
  })
})
.get('/add', async (ctx) => {
  // 获取一级分类
  var result = await DB.find('articlecate', {})
  await ctx.render('admin/article/add', {
    catelist: tools.cateToList(result)
  })
})
.post('/doAdd', upload.single('img_url'), async (ctx) => {
  var pid = ctx.req.body.pid
  var catename = ctx.req.body.catename
  var title = ctx.req.body.title.trim()
  var author = ctx.req.body.author.trim()
  var pic = ctx.req.body.pic
  var status = ctx.req.body.status
  var is_best = ctx.req.body.is_best
  var is_hot = ctx.req.body.is_hot
  var is_new = ctx.req.body.is_new
  var keywords = ctx.req.body.keywords
  var description = ctx.req.body.description || ''
  var content = ctx.req.body.content || ''
  var img_url = ctx.req.file ? ctx.req.file.path : ''

  var json = {
    pid, catename, title, author, pic, status, is_best, is_hot, is_new, keywords, description, content, img_url
  }

  var result = await DB.insert('article', json)
  ctx.redirect(ctx.state.__HOST__ + '/admin/article')
})
.get('/edit', async (ctx) => {
  var id = ctx.query.id
  var catelist = await DB.find('articlecate', {})
  var result = await DB.find('article', {'_id': DB.getObjectID(id)})
  await ctx.render('admin/article/edit', {
    catelist: tools.cateToList(catelist),
    list: result[0],
    prevPage: ctx.state.G.prevPage
  })
})
.post('/doEdit', upload.single('img_url'), async (ctx) => {
  var id = ctx.req.body.id
  var pid = ctx.req.body.pid
  var catename = ctx.req.body.catename
  var title = ctx.req.body.title.trim()
  var author = ctx.req.body.author.trim()
  var status = ctx.req.body.status
  var is_best = ctx.req.body.is_best
  var is_hot = ctx.req.body.is_hot
  var is_new = ctx.req.body.is_new
  var keywords = ctx.req.body.keywords
  var description = ctx.req.body.description || ''
  var content = ctx.req.body.content || ''
  var img_url = ctx.req.file ? ctx.req.file.path : ''
  var prevPage = ctx.req.body.prevPage
 
  console.log(prevPage)
  if(img_url) {
    var json = {
      pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content, img_url
    }
  } else {
    var json = {
      pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content
    }
  }
  var result = await DB.update('article', {'_id': DB.getObjectID(id)}, json)
  if(prevPage) {
    ctx.redirect(prevPage)
  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/article')
  }
})

module.exports = router.routes()