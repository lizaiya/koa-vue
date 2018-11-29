const Koa = require('koa');
const path = require('path');
const koaBody = require('koa-body');
const cors = require('koa-cors'); //跨域
const router = require('./router/index'); //路由
const tool = require('./tool'); //路由
const staticCache = require('koa-static-cache'); //静态文件服务器
const session = require('koa-session2');
const convert =require('koa-convert')
const historyApiFallback = require('koa2-connect-history-api-fallback');
const verificationToken = require('./middleware/verificationToken.js');
const app = new Koa();
// console.log(process.env);
console.log(process.env.NODE_ENV);
app.use(async (ctx, next) => {
   console.log(`Process ${ctx.request.method}-${ctx.request.url}...`);
   await next();
});
app.use(historyApiFallback());

app.use(convert(cors({
    //  origin: 'http://localhost:8080',
     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
     maxAge: 5,
     credentials: true,
     allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
     allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
})));
app.use(koaBody({
    multipart: true, // 支持文件上传
    formidable: {
        hash: true,
        multipart:true,
        uploadDir: path.join(__dirname, 'public/uploads/img/'), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
        maxFieldsSize: 200 * 1024 * 1024, // 文件上传大小
        onFileBegin: (name, file) => { // 文件上传前的设置
            //获取文件名后缀
            const ext = tool.getUploadFileExt(file.name);
            // 最终要保存到的文件夹目录
            const dirName = tool.getUploadDirname();
            
            const dir = path.join(__dirname, `public/uploads/img/${dirName}`);
            // 检查文件夹是否存在如果不存在则新建文件夹
            tool.checkDirExist(dir);
            // 获取文件名称
            const fileName = tool.getUploadFileName(ext);
             // 重新覆盖 file.path 属性
            file.path = `${dir}/${fileName}`;
            app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {};
            app.context.uploadpath[name] = `${dirName}/${fileName}`;
            },
        onError: (err) => {
            console.log(err);
        }
    }
}));
app.use(session({
    maxAge: 60000 * 60, //1小时
}));

//设置静态资源的路径
const staticPath = './public';
app.use(staticCache(path.join(__dirname, staticPath)));

app.use(verificationToken());
app
    .use(router.routes())
    .use(router.allowedMethods())
    //跨域

app.listen(8081);