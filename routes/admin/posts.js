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
//显示文章
router.get('/', function(req, res) {
    //获取文章
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('posts');
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            //成功接收到数据,渲染后台文章页面
            res.render('admin/article_list',{data:docs});
        });
    })

});

//显示添加文章页面
router.get('/add',function(req,res){
    //获取分类数据
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            //渲染视图并传递数据
            res.render("admin/article_add",{data:docs});
        })
    })
});

//添加文章动作
router.post('/add',function(req,res){
    //res.send('aa');//可以
    //获取表单数据
    var cat = req.body.cat;
    var title = req.body.title;
    var summary = req.body.summary;
    var content = req.body.content;
    //做一些额外处理,构建一个时间对象
    var time = new Date();
    var post ={
        "cat":cat,
        "title":title,
        "summary":summary,
        "content":content,
        "time":time
    };
    console.log(post);
    //插入数据库
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        };
       var c = db.collection('posts');
        c.insert(post,function(err,result){
            if(err){
                res.send(err);
                return;
            }
            //成功
            res.send('添加文章成功<a href="/admin/posts">查看文章列表</a>')
        })
    })
})

module.exports = router;