/**
 * DB库
 * author: GXQi
 */

const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID   
const Config = require('./config.js')

//封装
class Db {
  static getInstance() {      // 单例 解决多次实例化实例不共享的问题
    if(!Db.instance) {
      Db.instance = new Db()
    } 
    return Db.instance
  }

  constructor() {
    this.dbClient = ''    // 属性 放db对象
    this.connect()  //初始化时连接数据库
  }

  // 连接数据库
  connect() {
    return new Promise((reslove, reject) => {
      if(!this.dbClient) {  // 解决数据库多次连接的问题
        MongoClient.connect(Config.dbUrl, (err, client) => {
          if(err) {
            reject(err)
          } else {
            var db = client.db(Config.dbName)
            this.dbClient = db
            reslove(this.dbClient)
          }
        })
      } else {
        reslove(this.dbClient)
      }
    })
  }

  // 数据库查询
  /**
   * DB.find('user', {})    // 返回所有数据
   * DB.find('user', {}, {'title', 1})    // 返回所有数据的title列
   * DB.find('user', {}, {'title', 1}， {    // 返回第二页的数据，每页20条
   *    page: 2,
   *    pageSize: 20,
   *    sortJson: {'add_time': -1}
   * })   
   * 
   * js中形参和实参可以不一样 arguments对象接受实参传过来的参数
   */
  find(collectionName, json1, json2, json3) {
    if(arguments.length == 2) {
      var attr = ''
      var slipNum = 0
      var pageSize = 0
    } else if(arguments.length == 3) {
      var attr = json2
      var slipNum = 0
      var pageSize = 0
    } else if(arguments.length == 4) {
      var attr = json2
      var page = json3.page || 1
      var pageSize = json3.pageSize || 20
      var slipNum = (page-1)*pageSize
      if(json3.sortJson) {
        var sortJson = json3.sortJson
      } else {2
        var sortJson = {}
      }
    } else {
      console.log('错误传参')
    }

    return new Promise((reslove, reject) => {
      this.connect().then((db) => {
        // var result =  db.collection(collectionName).find(json)
        var result =  db.collection(collectionName).find(json1, {fields: attr}).skip(slipNum).limit(pageSize).sort(sortJson)
        result.toArray((err, docs) => {
          if(err) {
            reject(err)
            return 
          }
          reslove(docs)
        })
      })
    })
  }

  // 修改数据
  update(collectionName, json1, json2) {
    return new Promise((reslove, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).updateOne(json1, {
          $set: json2
        }, (err, result) => {
          if(err) {
            reject(err)
          } else {
            reslove(result)
          }
        })
      })
    })
  }

  // 插入数据
  insert(collectionName, json) {
    return new Promise((reslove, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).insertOne(json, (err, result) => {
          if(err) {
            reject(err)
          } else {
            reslove(result)
          }
        })
      })
    })
  }

  // 删除数据
  remove(collectionName, json) {
    return new Promise((reslove, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).removeOne(json, (err, result) => {
          if(err) {
            reject(err)
          } else {
            reslove(result)
          }
        })
      })
    })
  }

  getObjectID(id) {   // mongodb里面查询_id 把字符串转换成对象
    return new ObjectID(id)
  }

  // 统计数量的方法
  count(collectionName, json) {
    return new Promise((reslove, reject) => {
      this.connect().then((db) => {
        var result = db.collection(collectionName).count(json)
        result.then((count) => {
          reslove(count)
        })
      })
    })
  }
}

module.exports = Db.getInstance()