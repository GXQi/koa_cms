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
  find(collectionName, json) {
    return new Promise((reslove, reject) => {
      this.connect().then((db) => {
        var result =  db.collection(collectionName).find(json)
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
}

module.exports = Db.getInstance()