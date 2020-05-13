import axios from 'axios'
import apiConf from '@/apiConfig/api'
//import { getSessionStorage } from './commonFun.js';

axios.interceptors.response.use(
  (response) => {
    // Do something with response data
    const apiRes = response.data;
    return apiRes;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  });

const apiDataFilter = {
  async request({api = '', method = 'get',contentType='application/json;charset=UTF-8', pathParams = [],params={}, data = {}}) {
    const apiUrl = this.pathParamsToUrl(api, pathParams)
    method = method.toLowerCase();
    const options = {
      url: apiUrl,
      method,
      timeout: apiConf.timeout,
      headers: {
        'Content-Type':contentType,
        //'token':getSessionStorage('ylm_token') ? getSessionStorage('ylm_token'):''
      }
    };
    if (method === 'post' && Object.keys(params).length === 0) {
      options.data = data;
    }else if (method === 'post' && Object.keys(params).length > 0){
      options.data = data ;
      options.params = params;
    }else {
      options.params = data;
    }
    let result = await axios(options);
    return result
  },
  /*通过域名来获取当前阶段环境*/
  getEnv() {
    let env = 'dev'
    const domain = document.domain
    switch (domain) {
      case '47.110.125.94':
        env = 'test'
        break
      case 'www.sim.mobi':
        env = 'sim'
        break
      case 'www.example.com':
        env = 'prod'
        break
      default:
        env = 'dev'
        break
    }
    return env
  },
  /*根据apiPath返回apiUrl
      @apiPath：从api配置中suffix往下层写如："example.rent.detail"*/
  pathToUrl(apiPath) {
    let pathArray = apiPath.split('.')
    let prefix = apiConf.prefix[this.getEnv()]
    let suffix = apiConf.suffix
    for (let n = 0; n < pathArray.length; n++) {
      suffix = suffix[pathArray[n]]
    }
    if (suffix === undefined) suffix = ''
    return prefix + suffix
  },

  /*拼接路径参数 返回路径*/
  pathParamsToUrl(apiPath, pathParams) {
    let path = this.pathToUrl(apiPath)
    if (pathParams && pathParams.length > 0) {
      pathParams.forEach((item, index) => {
        path += `/${item}`
      })
    }
    return path
  }
}



export default apiDataFilter
