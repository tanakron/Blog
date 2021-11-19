var express = require('express');
var router = express.Router();
var moment= require('moment');
var db=require('monk')('localhost:27017/BlogDB');
var {check,validationResult}=require('express-validator');

// ดึงข้อมูลมาแสดง หน้าHome  ของPosts
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
var blogs=db.get('posts');
var categories = db.get ('categories');

blogs.find({},{},function(err,blog){
  categories.find({},{},function (err,category){
    res.render('index',{
      posts:blog , 
      categories:category,
      moment:moment
  });
  });
});
});

router.get('/category/add', function(req, res, next) {
  res.render('addcategory');
});

// ทำvalidat post
router.post('/post/add',[
  check('title','กรุณาป้อนชื่อบทความ').not().isEmpty(),
  check('content','กรุณาป้อนชื่อเนื้อหา').not().isEmpty(),
  check('img','กรุณาป้อนชื่อเนื้อหา').not().isEmpty(),
  check('author','กรุณาป้อนชื่อผู้เขียน').not().isEmpty()
], function(req, res, next) {
  var result=validationResult(req);
  var errors=result.errors;
  var categories=db.get('categories');
  var posts=db.get('posts');

  if(!result.isEmpty()){
    categories.find({},{},function (err,category){
    res.render('addpost',{
      categories:category,
      errors:errors
    });
  });
  }else{ 
    // Insert DB POST
posts.insert({
  title:req.body.title,
  catgory:req.body.category,
  content:req.body.content,
  img:req.body.img,
  authir:req.body.author,
  date:new Date()
}, function (err,success){
  if (err){
    res.send(err);
  }else{
    res.location('/');
    res.redirect('/');
  }
})
  }
});




// ทำ option หมวดหมู่ category
router.get('/post/add', function(req, res, next) {
  var categories = db.get ('categories');
  categories.find({},{},function (err,category){
    res.render('addpost',{
     categories:category
  });
  });
 
});



// validat ข้อมูล
router.post('/category/add',[
  check('name','กรุณาป้อนชื่อประเภท').not().isEmpty() 
], function(req, res, next) {
  var result=validationResult(req);
  var errors=result.errors;
  if(!result.isEmpty()){
    res.render('addcategory',{
      errors:errors
    });
  }else{
  // การบันทึก เพิ่มข้อมูลเข้า database
  var category =db.get('categories');
category.insert({
  name:req.body.name
},function(err,success){
  if (err){
    res.send(err);
  }else{
    res.location('/');
    res.redirect('/');
  }
})
  }

});

module.exports = router;
