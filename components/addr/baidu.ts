/**
 * @module Addr/baidu
 */

/**
 * Created by remote on 2017/6/7.
 * 地址查询
 */
import Transform from '../transform';
import { convertMC2LL, getGpsPointByBaiduGpsV2 } from './base/baidu';

import { get, jsonp } from '../request';

export default class Baidu {
  constructor(options) {
    this.cityId = options.cityId || -1;
    // 默认使用客户端查询
    this.searchType = options.searchType || 'client';

    // 服务端百度查询地址
    this.serverUrl = options.serverUrl;
    // 是否为经纬度
    this.isJwd = options.isJwd;

    this.transform = new Transform();
  }

  /**
   * 百度地址搜索, text支持文本和坐标两种方式
   *
   * @param {any} text
   * @param {any} size
   * @param {any} callback
   * @memberof module:Addr/baidu
   */
  search(text, size, callback) {
    let that = this;
    if (!this.cityId) {
      throw new Error('cityId: ' + this.cityId + ', 异常, 请检查');
    }

    switch (that.searchType) {
      case 'client':
        that._searchClient(text, size, callback);
        break;
      case 'server':
        that._searchServer(text, size, callback);
        break;
      default:
        callback(null);
    }
  }
  _searchServer(text, size, callback) {
    const data = {
      f: 'json',
      size: size,
      cityid: this.cityId,
      text: encodeURIComponent(text),
    };
    get(this.serverUrl, data).then(res => {
      if (!res.features) {
        callback(null);
        return;
      }

      let result = res.features.map(feature => {
        let att = feature.attributes;

        return {
          name: att.name,
          addr: att.addr,
          geometry: feature.geometry,
          geometryType: 'esriGeometryPoint',
        };
      });

      callback(result);
    });
  }
  _searchClient(text, size, callback) {
    let tests = text.split(',');
    // 坐标搜索
    if (tests.length === 2 && Number(tests[0]) && Number(tests[1])) {
    }
    // 文本搜索
    else {
      let baseUrl =
        'http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&qt=s&da_src=pcmappg.searchBox.button';
      baseUrl += '&wd=' + encodeURIComponent(text) + '&c=' + this.cityId;
      baseUrl += '&src=0&wd2=&sug=0&l=11';
      baseUrl += '&from=webmap&tn=B_NORMAL_MAP&nn=0&ie=utf-8';
      baseUrl += '&t=' + new Date().getTime();

      jsonp(baseUrl)
        .then(res => res.json())
        .then(res => {
          let addrs = res.content;
          if (!addrs || addrs.length === 0 || !Array.isArray(addrs)) {
            callback(null);
            return;
          }
          this._parseSearchTextResult(addrs, size, callback);
        })
        .catch(() => callback(null));
    }
  }

  _parseSearchTextResult(addrs, size, callback) {
    const transform = this.transform;
    const baiduGpsArr = [];
    const baiduAttrs = [];
    const len = addrs.length > size ? size : addrs.length;

    for (let i = 0; i < len; i++) {
      let item = addrs[i];
      let geo = item.geo;
      geo = geo.split(';')[0];
      geo = geo.substring(geo.indexOf('|') + 1);
      let sx = geo.substring(0, geo.indexOf(','));
      let sy = geo.substring(geo.indexOf(',') + 1);
      let x = Number(sx);
      let y = Number(sy);

      let name = item.name || '';
      let alias = '';
      let addr = item.addr || '';

      if (typeof addr === 'object') {
        alias = addr.alias;
      }

      // 坐标转换为本地坐标
      let baiduGps = convertMC2LL({
        x: x,
        y: y,
      });
      baiduGpsArr.push(baiduGps);
      baiduAttrs.push({
        name: name,
        alias: alias,
        addr: addr,
      });
    }

    getGpsPointByBaiduGpsV2(baiduGpsArr, 1, 5, points => {
      if (this.isJwd) {
        callback(points);
        return;
      }

      const result = points.map((point, index) => {
        const retPoint = transform.convert2XY(point.x, point.y);
        return {
          geometry: retPoint,
          name: baiduAttrs[index].name,
          addr: baiduAttrs[index].addr,
          alias: baiduAttrs[index].alias,
          geometryType: 'esriGeometryPoint',
        };
      });

      callback && callback(result);
    });
  }
}
