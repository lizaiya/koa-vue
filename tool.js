const path = require('path');
const fs=require('fs');
let randomString=len=>{
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var token = '';
    for (i = 0; i < len; i++) {
        token += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return token;
}
// 生成文件夹名称
let getUploadDirname=_=>{
    const date=new Date();
    let month = Number.parseInt(date.getMonth()) + 1;
    month=month.toString.length>1?month:`0${month}`;
    const dir = `${date.getFullYear()}${month}${date.getDate()}`;
    return dir;
}
//创建文件夹
let checkDirExist=p=>{
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p);
    }
}
//获取文件名后缀
let getUploadFileExt = name => {
    let ext=name.split('.');
    return ext[ext.length-1];
}
//文件名称
let getUploadFileName = ext => {
    return `${Date.now()}${Number.parseInt(Math.random() * 10000)}.${ext}`;
}
module.exports = {
    randomString,
    getUploadDirname,
    checkDirExist,
    getUploadFileExt,
    getUploadFileName
};