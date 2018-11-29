const model = require('../tableModel.js');
const tool = require('../tool');

let UserModel = model.User;
class UserController {
    /**
     * 登陆
     * @param ctx
     * @returns {Promise. < void >}
     * 
     */
    static async postLogin(ctx) {
        console.log(ctx.request.body);
        const name = ctx.request.body.name || '',
            pwd = ctx.request.body.pwd || '';
        if (name && pwd) {
            let createToken = tool.randomString(32);
            let loginInfo = await UserModel.findOne({where: {name: name,pwd: pwd}});
            //判断密码账号是否一致
            if (loginInfo){
                //新建session
                let session = Math.random().toString(36).substr(2);
                //创建session会话
                 ctx.session.user = JSON.stringify({
                     name: session
                 });
                console.log('登录11111111111')
                console.log(ctx.session.user)
                console.log('登录2222222222222')
                 //登录更新token
            let upData = await UserModel.update({token: createToken +'.'+ session}, {
                     where: {name: name, pwd: pwd},
                     validate: true,
                     individualHooks: true,
                 });
                if (upData[1].length) {//判读token更新是否成功
                     //创建session会话；
                    let result = await UserModel.findOne({where: {name: name,pwd: pwd,token: upData[1][0].token}});
                    let {token,birth,name:rname,gender,id,email} = result;
                    ctx.body = {
                         message: '登陆成功',
                         code: 1,
                         data: {token:token.split('.')[0], birth,name:rname,gender,id,email}
                     }
                 } else {
                     ctx.body = {
                         message: 'token生成失败',
                         code: 0
                     }
                 }
                 
            }else{
                ctx.body = {
                    message: '账号或密码错误',
                    code: 0
                }
            }
           
        } else {
            ctx.body = {
                message: '请输入名称或密码',
                code: 0
            }
        }

    }
    /**
     * 创建用户
     * @param ctx
     * @returns {Promise. < void >}
     */

    static async createUser(ctx) {
        const name = ctx.request.body.name,
            pwd = ctx.request.body.pwd;
        if (name && pwd) {
            let isUser = await UserModel.findOne({
                where: {
                    name: name
                }
            })
            if (isUser) {
                ctx.body = {
                    code: 0,
                    message: '该用户已注册'
                }
            } else {
                await UserModel.create({
                    name: name,
                    pwd: pwd
                }).then(succ => {
                    return ctx.body = {
                        code: 1,
                        message: '注册成功'
                    }
                }).catch(err => {
                    return ctx.body = {
                        code: 0,
                        message: err.name
                    }
                })
            }
        } else {
            ctx.body = {
                code: 0,
                message: '请输入密码、账号'
            }
        }
    }

    /**
     * 获取用户信息
     * @param ctx
     * @returns {Promise. < void >}
     */

    static async getUserInfo(ctx) {
        const user = ctx.user;

        ctx.body = {
            code: 1,
            message: '成功',
            user
        }
    }

}
module.exports = UserController;