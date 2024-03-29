import fetch from 'isomorphic-fetch';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {string} [options.method] POST|GET|PUT|DELETE
 * @return {string|undefined} [options.contentType] www
 */
function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    const body = newOptions.body;
    if (!(body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      if (newOptions.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') > -1) {
        let queryParams = '';
        if (Object.prototype.toString.call(body) === '[object Object]') {
          queryParams = Object.keys(body)
            .map(key => {
              let val = body[key];
              if (val instanceof Object) {
                val = JSON.stringify(val);
              }
              return `${key}=${val}`;
            })
            .join('&');
        }
        newOptions.body = queryParams;
      } else {
        newOptions.body = JSON.stringify(newOptions.body);
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data; charset=utf-8',
        ...newOptions.headers,
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      /**
       * https://davidwalsh.name/fetch
       *
       * clone() - Creates a clone of a Response object.
       * error() - Returns a new Response object associated with a network error.
       * redirect() - Creates a new response with a different URL.
       * arrayBuffer() - Returns a promise that resolves with an ArrayBuffer.
       * blob() - Returns a promise that resolves with a Blob.
       * formData() - Returns a promise that resolves with a FormData object.
       * json() - Returns a promise that resolves with a JSON object.
       * text() - Returns a promise that resolves with a USVString (text).
       */
      if (newOptions.blob) {
        return response.blob();
      }
      return response.json();
    });
}

export default request;
