const router = require('koa-router')()
    , DB = require('../../model/db')

router.get('/', async (ctx) => {
  await ctx.render('admin/index')
})
.get('/changeStatus', async (ctx) => {
  // console.log(ctx.query)
  // ctx.body = {
  //   'massage': '更新成功',
  //   'success': true
  // }
  var collectionName = ctx.query.collectionName
  var attr = ctx.query.attr
  var id = ctx.query.id

  var data = await DB.find(collectionName, {'_id': DB.getObjectID(id)})
  if(data.length) {
    if(data[0][attr] == 1) {
      var json = {    // ES6属性名表达式
        [attr]: 0
      }
    } else {
      var json = {
        [attr]: 1
      }
    }
    let updateResult = await DB.update(collectionName, {'_id': DB.getObjectID(id)}, json)

    if(updateResult) {
      ctx.body = {
        'message': '更新成功',
        'success': true
      }
    } else {
      ctx.body = {
        'message': '更新失败',
        'success': false
      }
    }
  } else {

  }
})
// 改变排序的ajax接口
.get('/changeSort', async (ctx) => {
  // console.log(ctx.query)
  // ctx.body = {
  //   'massage': '更新成功',
  //   'success': true
  // }
  var collectionName = ctx.query.collectionName
  var sortValue = ctx.query.sortValue
  var id = ctx.query.id

  let updateResult = await DB.update(collectionName, {'_id': DB.getObjectID(id)}, {'sort': sortValue})

  if(updateResult) {
    ctx.body = {
      'message': '更新成功',
      'success': true
    }
  } else {
    ctx.body = {
      'message': '更新失败',
      'success': false
    }
  }
})
.get('/remove', async (ctx) => {
  try {
    var collectionName = ctx.query.collection
    var id = ctx.query.id

    var result = DB.remove(collectionName, {"_id": DB.getObjectID(id)})
    ctx.redirect(ctx.state.G.prevPage)
  } catch(err) {
    ctx.redirect(ctx.state.G.prevPage)
  }
})

module.exports = router.routes()