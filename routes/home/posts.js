/**
 * Created by ZMoffice on 2016/8/31.
 */
var express = require('express');
var router = express.Router();
//引入mongo模块
var MongoClient = require('mongodb').MongoClient;
var DB_STR = "mongodb://localhost:27017/tn_blog";
var ObjectId = require('mongodb').ObjectId;

/* GET home page. */
router.get('/', function(req, res) {
    //获取id参数
    var id=req.query.id;
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('posts');
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            //获取渲染的页面
            console.log(docs,'............',docs[0])
            res.render('home/article',{data:docs[0]});
        })
    })


});

module.exports = router;