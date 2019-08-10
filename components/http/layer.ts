/**
 * Created by remote on 2017/6/6.
 *
 * 用于进行空间查询
 */
import * as http from './http.js';

/**
 * 用于多图层查询
 *
 * @function identify
 * @param {Object} identifyOption - 查询参数
 * @param {string} identifyOption.geometry - "xmin,ymin,xmax,ymax"
 * @param {string} identifyOption.geometryType - "esriGeometryEnvelopen"
 * @param {string} identifyOption.sr - "2437"
 * @param {string} identifyOption.layerDefs - "visible:2,5 | all"
 * @param {number} identifyOption.tolerance - "2"
 * @param {number} identifyOption.mapExtent - 地图范围
 * @param {number} identifyOption.imageDisplay - xxx
 * @param {bool} identifyOption.returnGeometry - 是否返回 geom 信息
 * @param {string} [svn='QUERY_SVR'] - QUERY_SVR
 *
 * @return {Promise}
 */
export function identify(identifyOption = {}, svn = 'QUERY_SVR') {
  const path = '/identify';
  if (!identifyOption.f) {
    identifyOption.f = 'json';
  }
  if (identifyOption.geometry) {
    identifyOption.geometry = JSON.stringify(identifyOption.geometry);
  }
  if (identifyOption.layerDefs) {
    identifyOption.layerDefs = JSON.stringify(identifyOption.layerDefs);
  }
  if (identifyOption.mapExtent) {
    identifyOption.mapExtent = JSON.stringify(identifyOption.mapExtent);
  }

  if (identifyOption.geometryType === 'esriGeometryPoint') {
    if (!identifyOption.scale) alert('请传入地图显示比例');
    const resolution = ((25.39999918 / 96) * identifyOption.scale) / 1000;
    const dis = resolution * 8;
    let x;
    let y;
    if (identifyOption.geometry.indexOf('{') > -1) {
      identifyOption.geometry = JSON.parse(identifyOption.geometry);
      x = identifyOption.geometry.x;
      y = identifyOption.geometry.y;
    } else {
      x = parseFloat(identifyOption.geometry.split(',')[0]);
      y = parseFloat(identifyOption.geometry.split(',')[1]);
    }
    identifyOption.geometryType = 'esriGeometryEnvelope';
    identifyOption.geometry = x - dis + ',' + (y - dis) + ',' + (x + dis) + ',' + (y + dis);
  }

  // 判断是 post 还是 get，所有的字符参数长度相加
  // IE最小：2083
  if (identifyOption.geometry && identifyOption.geometry.length > 1024) {
    return http.post({
      svn,
      path,
      data: { f: 'json', ...identifyOption },
    });
  } else {
    return http.get({
      svn,
      path,
      data: { f: 'json', ...identifyOption },
    });
  }
}

/**
 * 用于单图层查询
 *
 * @function query
 * @param {string} layerId - 元数据的layerId
 * @param {Object} queryOption - 查询参数
 * @param {string} queryOption.geometry - "xmin,ymin,xmax,ymax"
 * @param {string} queryOption.geometryType - "esriGeometryEnvelopen"
 * @param {string} queryOption.spatialRel - "esriSpatialRelIntersects"
 * @param {string} queryOption.where - "1=1"
 * @param {string} queryOption.objectIds - 查询某几个 gid 的值，"123,1234123"
 * @param {string} queryOption.outFields - 返回字段"xxx,xxx"
 * @param {bool} queryOption.returnGeometry - 是否返回 geom 信息
 * @param {string} queryOption.returnIdsOnly - 只返回 gid 信息
 * @param {bool} queryOption.returnCountOnly - 只返回总条数
 * @param {string} queryOption.orderByFields - 以某个字段排序
 * @param {Array} queryOption.outStatistics - 统计信息
 * @param {string} queryOption.outStatistics[].statisticType -
 *                  统计类型 "<count | sum | min | max | avg | stddev | var>"
 * @param {string} queryOption.outStatistics[].onStatisticField - 统计某个字段 "Field1"
 * @param {string} queryOption.outStatistics[].outStatisticFieldName - 显示字段名称 "Out_Field_Name1"
 * @param {string} queryOption.groupByFieldsForStatistics - 以某个字段排序
 * @param {string} queryOption.pageno - 以某个字段排序
 * @param {string} queryOption.pagesize - 以某个字段排序
 * @param {bool} queryOption.returnGeometry - 是否返回 geom 信息
 * @param {string} [svn='QUERY_SVR'] - QUERY_SVR
 *
 * @return {Promise}
 */
export function query(layerId, queryOption = {}, svn = 'QUERY_SVR') {
  const path = `/${layerId}/query`;

  if (!queryOption.f) {
    queryOption.f = 'json';
  }
  if (Array.isArray(queryOption.outFields)) {
    queryOption.outFields = queryOption.outFields.toString();
  }
  if (Array.isArray(queryOption.orderByFields)) {
    queryOption.orderByFields = queryOption.orderByFields.toString();
  }
  if (Array.isArray(queryOption.groupByFieldsForStatistics)) {
    queryOption.groupByFieldsForStatistics = queryOption.groupByFieldsForStatistics.toString();
  }
  if (Array.isArray(queryOption.geometry)) {
    queryOption.geometry = JSON.stringify(queryOption.geometry);
  }
  if (Array.isArray(queryOption.outStatistics)) {
    queryOption.outStatistics = JSON.stringify(queryOption.outStatistics);
  }
  if (Array.isArray(queryOption.returnDistinctValues)) {
    queryOption.returnDistinctValues = JSON.stringify(queryOption.returnDistinctValues);
  }
  if (Array.isArray(queryOption.objectIds)) {
    queryOption.objectIds = queryOption.objectIds.join(',');
  }

  const strQuery =
    (queryOption.geometry || '') +
    (queryOption.where || '') +
    (queryOption.objectIds || '') +
    (queryOption.outFields || '') +
    (queryOption.orderByFields || '');
  // IE最小：2083
  if (queryOption.outStatistics || strQuery.length > 1500) {
    return http.post({
      svn,
      path,
      data: queryOption,
    });
  } else {
    return http.get({
      svn,
      path,
      data: queryOption,
    });
  }
}

/**
 * 用于废管查询
 *
 * @function queryOld
 * @param {string} layerId - 元数据 layerId
 * @param {Object} queryOption - 查询参数
 * @param {string} queryOption.geometry - "xmin,ymin,xmax,ymax"
 * @param {string} queryOption.geometryType - "esriGeometryEnvelopen"
 * @param {string} queryOption.spatialRel - "esriSpatialRelIntersects"
 * @param {string} queryOption.where - "1=1"
 * @param {string} queryOption.objectIds - 查询某几个 gid 的值，"123,1234123"
 * @param {string} queryOption.outFields - 返回字段"xxx,xxx"
 * @param {bool} queryOption.returnGeometry - 是否返回 geom 信息
 * @param {string} queryOption.returnIdsOnly - 只返回 gid 信息
 * @param {bool} queryOption.returnCountOnly - 只返回总条数
 * @param {string} queryOption.orderByFields - 以某个字段排序
 * @param {Array} queryOption.outStatistics - 统计信息
 * @param {string} queryOption.outStatistics[].statisticType -
 *                  统计类型 "<count | sum | min | max | avg | stddev | var>"
 * @param {string} queryOption.outStatistics[].onStatisticField - 统计某个字段 "Field1"
 * @param {string} queryOption.outStatistics[].outStatisticFieldName - 显示字段名称 "Out_Field_Name1"
 * @param {string} queryOption.groupByFieldsForStatistics - 以某个字段排序
 * @param {string} queryOption.pageno - 以某个字段排序
 * @param {string} queryOption.pagesize - 以某个字段排序
 * @param {bool} queryOption.returnGeometry - 是否返回 geom 信息
 * @param {string} [svn='QUERY_SVR'] - QUERY_SVR
 *
 * @return {Promise}
 */
export function queryOld(layerId, queryOption, svn = 'QUERY_SVR') {
  const path = `/${layerId}/old/query`;
  if (!queryOption.f) {
    queryOption.f = 'json';
  }
  if (Array.isArray(queryOption.outFields)) {
    queryOption.outFields = queryOption.outFields.toString();
  }
  if (Array.isArray(queryOption.orderByFields)) {
    queryOption.orderByFields = queryOption.orderByFields.toString();
  }
  if (Array.isArray(queryOption.groupByFieldsForStatistics)) {
    queryOption.groupByFieldsForStatistics = queryOption.groupByFieldsForStatistics.toString();
  }
  if (Array.isArray(queryOption.geometry)) {
    queryOption.geometry = JSON.stringify(queryOption.geometry);
  }
  if (Array.isArray(queryOption.outStatistics)) {
    queryOption.outStatistics = JSON.stringify(queryOption.outStatistics);
  }
  if (Array.isArray(queryOption.returnDistinctValues)) {
    queryOption.returnDistinctValues = JSON.stringify(queryOption.returnDistinctValues);
  }
  if (Array.isArray(queryOption.objectIds)) {
    queryOption.objectIds = queryOption.objectIds.join(',');
  }

  const strQuery =
    (queryOption.geometry || '') +
    (queryOption.where || '') +
    (queryOption.objectIds || '') +
    (queryOption.outFields || '') +
    (queryOption.orderByFields || '');
  // IE最小：2083
  if (queryOption.outStatistics || strQuery.length > 1500) {
    return http.post({
      svn,
      path,
      data: queryOption,
    });
  } else {
    return http.get({
      svn,
      path,
      data: queryOption,
    });
  }
}

/**
 * 添加记录
 *
 * @function append
 * @param {number} layerId - 元数据 layerId
 * @param {Array} attributes - 待添加数据
 * @param {string} attributes[].geometry - 空间信息
 * @param {number} attributes[].geometry.x - x 坐标
 * @param {number} attributes[].geometry.y - y 坐标
 * @param {Object} attributes[].attributes - 属性信息
 * @param {string} [svn=QUERY_SVR] - QUERY_SVR
 *
 * @return {Promise}
 */
export function append(layerId, attributes, svn = 'QUERY_SVR') {
  const path = `/${layerId}/applyEdits`;
  let adds = [];
  if (isObject(attributes)) {
    adds = [{ attributes }];
  } else if (Array.isArray(attributes)) {
    adds = attributes.map(attr => ({ attributes: attr }));
  } else {
    throw new Error('attributes的类型异常');
  }

  const data = {
    adds: JSON.stringify(adds),
    f: 'json',
  };
  return http.post({
    svn,
    path,
    data,
  });
}

/**
 * 删除数据
 *
 * @function del
 * @param {number} layerId - 元数据 layerId
 * @param {string} ids - 待删除 gid "112,123,4333,"
 * @param {string} [svn=QUERY_SVR] - QUERY_SVR
 *
 * @return {Promise}
 */
export function del(layerId, ids, svn = 'QUERY_SVR') {
  const path = `/${layerId}/applyEdits`;
  const data = {
    deletes: ids,
    f: 'json',
  };
  return http.get({
    svn,
    path,
    data,
  });
}

/**
 * 更新数据
 *
 * @function update
 * @param {number} layerId - 元数据 layerId
 * @param {Array} attributes - 待更新数据
 * @param {Object} attributes[].geometry - 空间信息
 * @param {number} attributes[].geometry.x - x 坐标
 * @param {number} attributes[].geometry.y - y 坐标
 * @param {Object} attributes[].attributes - 属性信息
 * @param {string} [svn=QUERY_SVR] - QUERY_SVR
 *
 * @return {Promise}
 */
export function update(layerId, attributes, svn = 'QUERY_SVR') {
  const path = `/${layerId}/applyEdits`;
  let updates = [];
  if (isObject(attributes)) {
    updates = [{ attributes }];
  } else if (Array.isArray(attributes)) {
    updates = attributes.map(attr => ({ attributes: attr }));
  } else {
    throw new Error('attributes的类型异常');
  }
  const data = {
    updates: JSON.stringify(updates),
    f: 'json',
  };
  return http.post({
    svn,
    path,
    data,
  });
}

/**
 * 获取附件信息（未启用）
 *
 * @function attachments
 * @param {number} layerId - 元数据 layerId
 * @param {number} objectId - 数据 gid
 * @param {string} [svn=QUERY_SVR] - QUERY_SVR
 *
 * @return {Promise}
 */
export function attachments(layerId, objectId, svn = 'QUERY_SVR') {
  const path = `/${layerId}/${objectId}/attachments`;
  return http.get({
    svn,
    path,
  });
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) == '[object Object]';
}
