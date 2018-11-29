
const model = require('../tableModel.js');
let UserModel = model.User;

module.exports = function () {
    return async (ctx, next) => {
       if (ctx.path === '/favicon.ico') return;
       
        let paths = ['/api/login', '/api/createUser'];
        let session = ctx.session.user;
        console.log(ctx.session.user)
       //没有redisSession 而且路径不是login和createUser
        //paths 路径不需要验证
        if (!paths.includes(ctx.path)) {
            let reqToken = ctx.request.body.token || '';
            if (reqToken) {
                 //获取数据库-数据token和session
                if (session) {
                    let localSession = JSON.parse(session).name;
                     //查询请求的token+本地session是否等于数据存储的token;
                    let result = await UserModel.findOne({
                        where: {
                            token: reqToken + '.'+localSession
                        }
                    });
                   
                   if (result) {
                       //刷新 过期时间
                       ctx.session.refresh()
                       await next();
                     } else { //没有查询到 说明token已经更新
                         ctx.body = {
                             code: 2,
                             message: '您已在别的地方登录过，请重新登录'
                         }
                     }
                }else{
                     ctx.body = {
                         code: 3,
                         message: 'token已过期,请重新登录！'
                    }
                }
             }else{
                 ctx.body = {
                     code: 0,
                     message: '缺少必填参数token'
                 }
             }
        }else{
             await next();
        }
       
    }
}