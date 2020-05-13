/**
 *  读取文件夹并运行下载依赖
 */

const path = require('path');
const util = require('util');
const sub_apps = require('./filterApp').apps

console.log(`即将进入所有模块并下载依赖：${JSON.stringify(sub_apps)} ing...`)

const exec = util.promisify(require('child_process').exec);
function install() {
  sub_apps.forEach(async i => {
    console.log(`${i} 开始下载，耗时较久请耐心等待...`)
    const { stdout, stderr } = await exec('cnpm install', { cwd: path.resolve('../',i) });
    console.log(i, 'success', stdout)
    console.error(i, 'error', stderr)
  });
};
install()

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
