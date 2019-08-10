import { stringify } from 'qs';
import sysConfig from '../sysConfig';
import request from '../request/request';

let taskCfg = null;

/**
 * 获取服务方法路径
 * @param {string} path rest 服务方法路径
 * @returns {string} url 服务方法地址
 * @ignore
 */
function getFuncPath(path = '', params) {
  if (path.length === 0) {
    throw new Error('path 参数不允许为空');
  }

  let nextPath = path.indexOf('/') === 0 ? path : `/${path}`;
  if (params) {
    if (nextPath.indexOf('?') === -1) {
      nextPath += '?';
    }
    // 参数序列化
    const nextPrams = {};
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'object') {
        nextPrams[key] = JSON.stringify(value);
      } else {
        nextPrams[key] = value;
      }
    }
    nextPath += stringify(nextPrams);
  }
  return nextPath;
}

function getTaskServiceCfg(svn) {
  if (taskCfg === null) {
    taskCfg = getCfg();
  }
  return taskCfg[svn];
}

export function getCfg() {
  if (taskCfg === null) {
    taskCfg = {};
    const taskServices = sysConfig.getCfgByKey('servicecfg');

    const { proxy, service } = taskServices;
    if (!Array.isArray(proxy)) {
      throw new Error('参数 proxy 异常，只允许为数组');
    }
    if (!Array.isArray(service)) {
      throw new Error('参数 service 异常，只允许为数组');
    }
    service.forEach(src => {
      const nextSrc = { ...src };
      if (nextSrc.proxy) {
        for (let i = 0; i < proxy.length; i++) {
          const pry = proxy[i];
          if (pry.status !== '0' && pry.name === nextSrc.proxy) {
            const { url } = nextSrc;
            nextSrc.url = `${pry.url}?${url}`;
            nextSrc.originalUrl = url;
            break;
          }
        }
      }

      taskCfg[src.name] = nextSrc;
    });
  }
  return taskCfg;
}

export function getUrl(opt) {
  const { svn, path, params = null, isProxy = true } = opt;
  const currentCfg = getTaskServiceCfg(svn);
  let url = isProxy ? currentCfg.url : currentCfg.originalUrl;
  url += getFuncPath(path, params);
  return url;
}

export function get({ svn = 'QUERY_SVR', path = '', data = {}, validate = true }) {
  const url = getUrl({ svn, path, params: data });

  // return new Promise(resolve => {
  //   $.get(
  //     url,
  //     data,
  //     res => {
  //       resolve(res);
  //     },
  //     'json'
  //   );
  // });

  return request(url, { validate });
}

export function post({
  svn = 'QUERY_SVR',
  path = '',
  data = {},
  headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
  validate = true,
}) {
  const url = getUrl({ svn, path });

  // return new Promise(resolve => {
  //   $.post(
  //     url,
  //     data,
  //     res => {
  //       resolve(res);
  //     },
  //     'json'
  //   );
  // });

  return request(url, { method: 'POST', body: data, headers, validate });
}

export default { get, post, getUrl };
