/**
 * Created by ZMoffice on 2016/8/31.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    //渲染后台页面
    res.render('admin/admin');
});

module.exports = router;