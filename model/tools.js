const md5 = require('md5')

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
  }
}

module.exports = tools