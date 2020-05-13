const md5 = require('md5')
    , multer = require('koa-multer')

let tools = {
  md5(str) {
    return md5(str)
  },
  cateToList(data) {
    // 1. 获取一级分类
    var firstArr = []
    for(var i = 0; i < data.length; i++) {
      if(data[i].pid == '0') {
        firstArr.push(data[i])
      }
    }

    // 2. 获取二级分类
    for(var i = 0; i < firstArr.length; i++) {
      firstArr[i].list = []
      for(var j = 0; j < data.length; j++) {
        if(data[j].pid == firstArr[i]._id) {
          firstArr[i].list.push(data[j])
        }
      }
    }
    // console.log(firstArr)
    return firstArr
  },
  getTime() {
    return new Date()
  },
  multer() {
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
    return upload
  }
}

module.exports = tools