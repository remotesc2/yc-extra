/**
 * @module
 * Created by remote on 2017/6/6.
 *
 * 用于进行 table 查询
 */
import * as http from './http.js';

const fieldCache = new Map();

/**
 * 获取单表字段配置信息
 *
 * @function fields
 * @param {string} tableName - 表名
 * @param {string} [svn='QUERY_SVR'] - QUERY_SVR
 *
 * @return {Promise}
 */
export function fields(tableName, svn = 'QUERY_SVR') {
  const flag = `${svn}_${tableName}`;
  if (fieldCache.has(flag)) {
    return new Promise(resolve => {
      resolve(fieldCache.get(flag));
    });
  } else {
    const path = `/table/${tableName}`;
    return http
      .get({
        svn,
        path,
        data: {
          f: 'json',
        },
      })
      .then(res => {
        fieldCache.set(flag, res);
        return res;
      });
  }
}

/**
 * 获取单表字段配置信息
 *
 * @param {string} tableName - 表名
 * @param {Object} queryOption - 查询条件
 * @param {string} queryOption.geometry - "xmin,ymin,xmax,ymax"
 * @param {string} queryOption.geometryType - "esriGeometryEnvelopen"
 * @param {string} queryOption.spatialRel - "esriSpatialRelIntersects"
 * @param {string} queryOption.where - "1=1"
 * @param {string|string[]} queryOption.objectIds - 查询某几个 gid 的值，"123,1234123"
 * @param {string|string[]} queryOption.outFields - 返回字段，"xxx,xxx"
 * @param {bool} queryOption.returnGeometry - 是否返回 geom 信息
 * @param {string} queryOption.returnIdsOnly - 只返回 gid 信息
 * @param {bool} queryOption.returnCountOnly - 只返回总条数
 * @param {string|string[]} queryOption.orderByFields - 以某个字段排序
 * @param {Object[]} queryOption.outStatistics - 统计信息
 * @param {string} queryOption.outStatistics[].statisticType - 统计类型
 * "<count | sum | min | max | avg | stddev | var>"
 * @param {string} queryOption.outStatistics[].onStatisticField - 统计某个字段 "Field1"
 * @param {string} queryOption.outStatistics[].outStatisticFieldName - 显示字段名称 "Out_Field_Name1"
 * @param {string} queryOption.returnDistinctValues - 返回值去重，"xxx,xxx"
 * @param {string|string[]} queryOption.groupByFieldsForStatistics - 以某个字段排序
 * @param {string} queryOption.pageno - 以某个字段排序
 * @param {string} queryOption.pagesize - 以某个字段排序
 * @param {string} [svn='QUERY_SVR'] - taskServices.json 中的 name
 *
 * @return {Promise} - 返回 promise 对象
 *
 * @function query
 */
export function query(tableName, queryOption, svn = 'QUERY_SVR') {
  const path = `/table/${tableName}/query`;

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

/*
 "\"attributes\" : {"
 + "\"ProNo\" : \"NWS-001-001\","
 + "\"ProName\" : \"工程001\","
 + "\"ProType\" : \"农网改造\""
 + "}"
 */
/**
 * 添加记录
 *
 * @param {string} tableName - 表名
 * @param {Array|Object} attributes - 待添加数据组
 * @param {string} [svn='QUERY_SVR'] - taskServices.json 中的 name
 *
 * @return {Promise} - 返回 promise 对象
 * @function append
 */
export function append(tableName, attributes, svn = 'QUERY_SVR') {
  const path = `/table/${tableName}/applyEdits`;
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
 * @param {string} tableName - 表名
 * @param {string} ids - 待删除 gid "112,123,4333,"
 * @param {string} [svn='QUERY_SVR'] - taskServices.json 中的 name
 *
 * @return {Promise} - 返回 promise 对象
 * @function del
 */
export function del(tableName, ids, svn = 'QUERY_SVR') {
  const path = `/table/${tableName}/applyEdits`;
  const data = {
    deletes: ids,
    f: 'json',
  };
  return http.post({
    svn,
    path,
    data,
  });
}

/**
 * 更新数据
 *
 * @param {string} tableName - 表名
 * @param {Array|Object} attributes - 待更新数据
 * @param {string} [svn='QUERY_SVR'] - taskServices.json 中的 name
 *
 * @return {Promise} - 返回 promise 对象
 * @function update
 */
export function update(tableName, attributes, svn = 'QUERY_SVR') {
  const path = `/table/${tableName}/applyEdits`;
  let updates = [];
  if (isObject(attributes)) {
    updates = [{ attributes }];
  } else if (Array.isArray(attributes)) {
    updates = attributes.map(attr => ({ attributes: attr }));
  } else {
    throw new Error('attributes的类型异常');
  }
  const data = { updates: JSON.stringify(updates) };
  return http.post({
    svn,
    path,
    data,
  });
}

/**
 * 获取附件信息
 *
 * @param {string} tableName - 表名
 * @param {number} objectId - 数据 gid
 * @param {string} [svn='QUERY_SVR'] - taskServices.json 中的 name
 *
 * @return {Promise} - 返回 promise 对象
 * @function attachments
 */
export function attachments(tableName, objectId, svn = 'QUERY_SVR') {
  const path = `/table/${tableName}/${objectId}/attachments`;
  return http.get({
    svn,
    path,
  });
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) == '[object Object]';
}
