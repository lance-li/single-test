/* eslint-disable no-shadow */
const path = require('path');
const fs = require('fs');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


function resolve(dir) {
  return path.join(__dirname, dir);
}

/**
 * 获取代理库地址
 * @param {String} dir 目录地址
 */
function getPortalLibs(dir = './public/libs') {
  const cssFiles = [];
  const jsFiles = [];
  const jsReg = /\.js$/;
  const cssReg = /\.css$/;
  const basePath = '/libs/';

  try {
    const files = fs.readdirSync(dir); 
    const vueLibs = [];
    const thdLibs = [];

    files.map((file) => {
      if (jsReg.test(file)) {
        jsFiles.push(basePath + file);
      } else if (cssReg.test(file)) {
        cssFiles.push(basePath + file);
      }
      return file;
    });

    // 分离出vue核心库和第三方库
    jsFiles.map((lib) => {
      if (lib.startsWith(`${basePath}vue`)) {
        // vue核心最先加载
        if (lib.split('@')[0] === `${basePath}vue`) {
          vueLibs.unshift(lib);
        } else {
          vueLibs.push(lib);
        }
      } else {
        thdLibs.push(lib);
      }
      return true;
    });

    console.log(vueLibs.join(','))

    return {
      cssFiles,
      jsFiles: [...vueLibs, ...thdLibs] // 优先加载vue核心库
    }
  } catch (error) {
    throw new Error(error);
  }
}

const libs = getPortalLibs();

const scriptPreloadAttr = {
  rel: 'preload',
  as: 'script'
}
const scriptAttr = {
  type: 'text/javascript'
}

const links = [
  '/libs/font-awesome-4.7.0/css/font-awesome.min.css',
  ...libs.cssFiles,
  ...(libs.jsFiles.map(path => ({
    path,
    publicPath: false,
    attributes: scriptPreloadAttr
  })))
];

const scripts = [
  ...(libs.jsFiles.map(path => ({
    path,
    publicPath: false,
    append: false, // 添加到已有脚本前面————代理库需要先加载
    attributes: scriptAttr
  })))
];

const port = 8081;

module.exports = {
  lintOnSave: false,
  devServer: {
    host:'0.0.0.0',
    hot: false,
    port,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/backend': {
        target: 'http://10.128.0.180:8002/backend', // 你接口的域名  //测试环境：47.99.190.39:8002 //开发环境：121.196.221.253:8002//vpc测试环境: 120.24.230.253//120.76.143.89深圳的测试环境
        changeOrigin: true,
        ws: true
      }
    }
  },
  transpileDependencies:['single-spa'],
  configureWebpack:{
     entry:["@babel/polyfill","promise-polyfill","url-polyfill","whatwg-fetch","./src/main.js"], //appendChild
  }
}
