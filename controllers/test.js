class testControllers {
    /**
     * 测试 jwt认证
     * @param ctx
     * @param {Promise. < void >}
     */
    static async testAuth(ctx) {
        const name = ctx.request.body.name || '',
            pwd = ctx.request.body.pwd || '';
        if (name && pwd) {
            ctx.body = {
                message: '登陆成功',
                code: 1,
                data: {a:'csscs'}
            }
        }
    }
    static async upload(ctx) {
         console.log(ctx.uploadpath);
         ctx.body = JSON.stringify(ctx.request.files);
        // ctx.body = {
        //     message: '图片上传成功',
        //     code: 1,
        //     data: {
        //         a: 'csscs'
        //     }
        // }
        // console.log(ctx.req.body)
    }
}
module.exports = testControllers;