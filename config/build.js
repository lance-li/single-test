/**
 *  读取文件夹并打包项目
 */

const path = require('path');
const util = require('util');
const sub_apps = require('./filterApp').apps

console.log(`即将进入所有模块并打包项目：${JSON.stringify(sub_apps)} ing...`)

const exec = util.promisify(require('child_process').exec);
function build() {
  sub_apps.forEach(async i => {
    console.log(`${i} 开始打包,耗时较久请耐心等待...`)
    const { stdout, stderr } = await exec('npm run build', { cwd: path.resolve('../',i) });
    console.log(i, 'success', stdout)
    console.error(i, 'error', stderr)
  });
};
build();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
