var express = require('express');
var router = express.Router();
//引入mongo模块
var MongoClient = require('mongodb').MongoClient;
var DB_STR = "mongodb://localhost:27017/tn_blog";
var session = require('express-session');

router.use('/login',checkNotLogin);
/* GET users listing. */
router.get('/login', function(req, res, next) {
  //载入登录页面
  res.render('admin/login');
});
//用户登录处理
router.post('/signin',function(req,res){
  //获取用户名和密码
  var username = req.body.username;
  var pwd = req.body.pwd;
  console.log(username,pwd);
  //得到数据与数据库做一个对比查询
  MongoClient.connect(DB_STR,function(err,db){
    if(err){
      res.send(err);
      return;
    }
    var c = db.collection('users');
    c.find({username:username,pwd:pwd}).toArray(function(err,docs){
      if(err){
        res.send(err);
        return;
      }
      //用得到的查询结果来判断查询数组是否为空
      if(docs.length){
        //登录成功
        //console.log('here');
        //console.log(docs);
        req.session.isLogin = true;
        res.redirect('/admin/index');
      }else {
        //登录失败
        res.redirect('/admin/users/login');
      }
    })
  })
});
//登录注销
router.get('/logout',function(req,res){
  //清除session然后跳转
  req.session.isLogin = null;
  res.redirect('/admin/index');
});

//判断用户是否已经登录了
function checkNotLogin(req,res,next){
  if(req.session.isLogin){
    //表示已经更路过,跳转到主页
    res.redirect('/admin/index');
  }
  next();
}

module.exports = router;
