import request from './request';

function isObject(value: any) {
  return value != null && typeof value == 'object';
}

const defaultParmas = {
  timeout: 0,
};

/**
 * ajax 请求
 *
 * @param {Object} params - 请求参数
 * @param {string} params.url - 请求地址
 * @param {Object} params.data - 请求条件
 * @param {string} [params.type='get'] - 请求方法: get or post
 * @param {Object} [params.headers] - 表头配置
 * @param {number} [params.time=0] - 超时时间，默认为 0，不开启
 * @param {function} [params.onChage] - 异常时触发的方法
 *
 * @returns {Promise} es6 的 promise 对象
 */
export function ajax(params) {
  const newParams = { ...defaultParmas, ...params };
  const { url = '', data = {}, type = 'get', ...passParams } = newParams;

  // 新增时间戳
  data.t = new Date().getMilliseconds();

  if (type === 'post') {
    const newData = {};
    Object.keys(data).forEach(key => {
      let tmp = data[key];
      if (Array.isArray(tmp) || isObject(tmp)) {
        tmp = JSON.stringify(tmp);
      }
      newData[key] = tmp;
    });
    return request(url, {
      method: 'POST',
      body: newData,
      ...passParams,
    });
  } else if (type === 'get') {
    let finalUrl = url;
    if (finalUrl.lastIndexOf('?') !== finalUrl.length - 1) {
      finalUrl = `${finalUrl}?`;
    }
    Object.keys(data).forEach(key => {
      let tmp = data[key];
      if (Array.isArray(tmp) || typeof tmp === 'object') {
        tmp = JSON.stringify(tmp);
      }
      // 新增 encodeURIComponent 转码，可能会出现别的问题
      tmp = encodeURIComponent(tmp);
      finalUrl = `${finalUrl}${key}=${tmp}&`;
    });
    finalUrl = finalUrl.substring(0, finalUrl.length - 1);
    return request(finalUrl, passParams);
  }
}

export function get(url = '', data = {}, params = {}) {
  return ajax({ url, data, type: 'get', ...params });
}

export function post(url = '', data = {}, params = {}) {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' };
  return ajax({ url, data, type: 'post', headers, ...params });
}

export function get1(baseUrl: string, params = {}) {
  let url = baseUrl;
  if (url.lastIndexOf('?') !== url.length - 1) {
    url += '?';
  }
  Object.keys(params).forEach(key => {
    url += `${key}=${params[key]}&`;
  });
  url = url.substring(0, url.length - 1);
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', url, false);
  xmlhttp.send();
  if (xmlhttp.status === 200) {
    return xmlhttp.responseText;
  }
  return null;
}
