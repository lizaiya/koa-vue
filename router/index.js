const Router= require('koa-router');
const UserController = require('../controllers/user');
const testController = require('../controllers/test');
const router=new Router({
    prefix:'/api'
});
router
      .post('/login', UserController.postLogin) //登陆
      .post('/createUser', UserController.createUser) //注册
      .get('/userInfo', UserController.getUserInfo) //获取用户信息
      .post('/testAuth', testController.testAuth) //测试auto
      .post('/upload', testController.upload) //测试auto
module.exports=router;