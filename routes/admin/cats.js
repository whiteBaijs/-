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
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        };
        var c = db.collection('cats');
        c.find().toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            //在渲染页面时传递到视图页面中
            //渲染后台页面
            res.render('admin/category_list',{data:docs});
        })
    })

});

//显示添加分类页面
router.get('/add',function(req,res){
    res.render('admin/category_add');
});

//添加分类动作
router.post('/add',function(req,res){
    //1.获取表单提交的数据
    var title = req.body.title;
    var sort = req.body.sort;
    //console.log(title,sort)
    //2.做一些必要的验证,这个环节可以先省略
    //3.将数据保存在数据库中,完成提示并跳转
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
        }
        //此处的db就是tn_blog数据库
        //获得cats集合
        var c=db.collection('cats');
        c.insert({title:title,sort:sort},function(err,result){
            if(err){
                res.send(err);
                return;
            }else{
                //插入成功
                res.send('添加分类成功<a href="/admin/cats">查看列表</a>');
            }
        })
    })
});

//显示编辑分类页面
router.get('/edit',function(req,res){
    //获取查询字符串id
    var id = req.query.id;
    //连接数据库,获取该id对应的文档
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        };
        var c = db.collection('cats');
        c.find({_id:ObjectId(id)}).toArray(function(err,docs){
            if(err){
                res.send(err);
                return;
            }
            res.render('admin/category_edit',{data:docs[0]});//此处,只需数组中的一个对象
        })
    })
});

//更新分类动作
router.post('/edit',function(req,res){
    //获取表单数据
    var title = req.body.title;
    var sort = req.body.sort;
    var id = req.body.id;
    //完成更新操作
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.update({_id:ObjectId(id)},{$set:{"title":title,"sort":sort}},function (err,result){
            if(err){
                res.send(err);
            }else {
                res.send('更新成功<a href="/admin/cats">返回列表</a>');
            }
        });
    });
});


//删除分类动作
router.get('/delete',function(req,res){
    //获取传递过来的参数
    var id = req.query.id;
    //在数据库中使用remove删除这个id
    MongoClient.connect(DB_STR,function(err,db){
        if(err){
            res.send(err);
            return;
        }
        var c = db.collection('cats');
        c.remove({_id:ObjectId(id)},function(err,result){
            if(err){
                res.send(err);
                return;
            }
            res.redirect('/admin/cats');//此处直接跳转
        })
    })
})
module.exports = router;