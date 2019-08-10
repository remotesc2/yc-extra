/**
 * @module
 * @ignore
 */
import { jsonp } from '../../request';

const MCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
const LLBAND = [75, 60, 45, 30, 15, 0];
const MC2LL = [
  [
    1.410526172116255e-8,
    0.00000898305509648872,
    -1.9939833816331,
    200.9824383106796,
    -187.2403703815547,
    91.6087516669843,
    -23.38765649603339,
    2.57121317296198,
    -0.03801003308653,
    17337981.2,
  ],
  [
    -7.435856389565537e-9,
    0.000008983055097726239,
    -0.78625201886289,
    96.32687599759846,
    -1.85204757529826,
    -59.36935905485877,
    47.40033549296737,
    -16.50741931063887,
    2.28786674699375,
    10260144.86,
  ],
  [
    -3.030883460898826e-8,
    0.00000898305509983578,
    0.30071316287616,
    59.74293618442277,
    7.357984074871,
    -25.38371002664745,
    13.45380521110908,
    -3.29883767235584,
    0.32710905363475,
    6856817.37,
  ],
  [
    -1.981981304930552e-8,
    0.000008983055099779535,
    0.03278182852591,
    40.31678527705744,
    0.65659298677277,
    -4.44255534477492,
    0.85341911805263,
    0.12923347998204,
    -0.04625736007561,
    4482777.06,
  ],
  [
    3.09191371068437e-9,
    0.000008983055096812155,
    0.00006995724062,
    23.10934304144901,
    -0.00023663490511,
    -0.6321817810242,
    -0.00663494467273,
    0.03430082397953,
    -0.00466043876332,
    2555164.4,
  ],
  [
    2.890871144776878e-9,
    0.000008983055095805407,
    -3.068298e-8,
    7.47137025468032,
    -0.00000353937994,
    -0.02145144861037,
    -0.00001234426596,
    0.00010322952773,
    -0.00000323890364,
    826088.5,
  ],
];

const LL2MC = [
  [
    -0.0015702102444,
    111320.7020616939,
    1704480524535203.0,
    -10338987376042340.0,
    26112667856603880.0,
    -35149669176653700.0,
    26595700718403920.0,
    -10725012454188240.0,
    1800819912950474.0,
    82.5,
  ],
  [
    0.0008277824516172526,
    111320.7020463578,
    647795574.6671607,
    -4082003173.641316,
    10774905663.51142,
    -15171875531.51559,
    12053065338.62167,
    -5124939663.577472,
    913311935.9512032,
    67.5,
  ],
  [
    0.00337398766765,
    111320.7020202162,
    4481351.045890365,
    -23393751.19931662,
    79682215.47186455,
    -115964993.2797253,
    97236711.15602145,
    -43661946.33752821,
    8477230.501135234,
    52.5,
  ],
  [
    0.00220636496208,
    111320.7020209128,
    51751.86112841131,
    3796837.749470245,
    992013.7397791013,
    -1221952.21711287,
    1340652.697009075,
    -620943.6990984312,
    144416.9293806241,
    37.5,
  ],
  [
    -0.0003441963504368392,
    111320.7020576856,
    278.2353980772752,
    2485758.690035394,
    6070.750963243378,
    54821.18345352118,
    9540.606633304236,
    -2710.55326746645,
    1405.483844121726,
    22.5,
  ],
  [
    -0.0003218135878613132,
    111320.7020701615,
    0.00369383431289,
    823725.6402795718,
    0.46104986909093,
    2351.343141331292,
    1.58060784298199,
    8.77738589078284,
    0.37238884252424,
    7.45,
  ],
];

/**
 * 在线转换坐标
 * @param x
 * @param y
 * @param callback
 * @private
 */
function onlineTrans2Baidu(x, y, callback) {
  let baseUrl = 'http://api.map.baidu.com/ag/coord/convert?from=0&to=4';
  baseUrl += '&x=' + x;
  baseUrl += '&y=' + y;
  let theObj = this;
  jsonp(baseUrl)
    .then((res = res.json()))
    .then(res => {
      if (res.error && res.error > 0) {
        throw new Error('在线请求坐标转换出错');
      }
      let x = Number(theObj._base64.base64decode(res.x));
      let y = Number(theObj._base64.base64decode(res.y));
      let result = { x: x, y: y };
      callback(result);
    });
}

/**
 * This callback is displayed as a global member.
 * @callback onlineTrans2BaiduV2Callback
 * @param {Object[]} result - 百度转换结果集
 */

/**
 * 在线转换百度坐标v2
 * @param {Array} points - 待转坐标组
 * @param {number} points[].x - x 轴坐标
 * @param {number} points[].y - y 轴坐标
 * @param {number} from - 源坐标类型
 *                      1：GPS设备获取的角度坐标，wgs84坐标;
 *                      2：GPS获取的米制坐标、sogou地图所用坐标;
 *                      3：google地图、soso地图、aliyun地图、mapabc地图和amap地图所用坐标，国测局坐标;
 *                      4：3中列表地图坐标对应的米制坐标;
 *                      5：百度地图采用的经纬度坐标;
 *                      6：百度地图采用的米制坐标;
 *                      7：mapbar地图坐标;
 *                      8：51地图坐标
 * @param {number} to - 目的坐标类型
 *                      5：bd09ll(百度经纬度坐标);
 *                      6：bd09mc(百度米制经纬度坐标);
 * @param {onlineTrans2BaiduV2Callback} callback - 转换成功回调
 * @throws 请求异常
 */
function onlineTrans2BaiduV2(points, from, to, callback) {
  let corrds = points
    .map(function(point) {
      return point.x + ',' + point.y;
    })
    .join(';');

  let ak = 'zU2UihPwB30egi7DCz84NGjOIxqci5MD';

  let url = 'http://api.map.baidu.com/geoconv/v1/?';
  url += 'from=' + from;
  url += '&to=' + to;
  url += '&ak=' + ak;
  url += '&coords=' + corrds;

  jsonp(url)
    .then(res => res.json())
    .then(res => {
      if (res.status !== 0) {
        throw new Error('在线请求坐标转换出错, state 为' + res.status);
      }
      callback(res.result);
    });
}

function convertor(cD, cE) {
  if (cD === null || cE === null) {
    return null;
  }
  let ret = {};
  let T = cE[0] + cE[1] * Math.abs(cD.x);
  let cC = Math.abs(cD.y) / cE[9];
  let cF =
    cE[2] +
    cE[3] * cC +
    cE[4] * cC * cC +
    cE[5] * cC * cC * cC +
    cE[6] * cC * cC * cC * cC +
    cE[7] * cC * cC * cC * cC * cC +
    cE[8] * cC * cC * cC * cC * cC * cC;
  T *= cD.x < 0 ? -1 : 1;
  cF *= cD.y < 0 ? -1 : 1;

  ret.x = T;
  ret.y = cF;
  return ret;
}

function getRange(cD, cC, T) {
  cD = Math.max(cD, cC);
  cD = Math.min(cD, T);
  return cD;
}

function getLoop(cD, cC, T) {
  while (cD > T) {
    cD -= T - cC;
  }
  while (cD < cC) {
    cD += T - cC;
  }
  return cD;
}

// 百度web墨卡托转经纬度
export function convertMC2LL(cD) {
  let cF = null;
  for (let cE = 0; cE < MCBAND.length; cE++) {
    if (cD.y >= MCBAND[cE]) {
      cF = MC2LL[cE];
      break;
    }
  }
  let T = convertor(cD, cF);
  return T;
}

// 百度经纬度转web墨卡托
export function convertLL2MC(T) {
  let cE = null;
  T.x = getLoop(T.x, -180, 180);
  T.y = getRange(T.y, -74, 74);

  for (let cD = 0; cD < LLBAND.length; cD++) {
    if (T.y >= LLBAND[cD]) {
      cE = LL2MC[cD];
      break;
    }
  }
  if (cE === null) {
    for (let cD = LLBAND.length - 1; cD >= 0; cD--) {
      if (T.y <= -LLBAND[cD]) {
        cE = LL2MC[cD];
        break;
      }
    }
  }
  return convertor(T, cE);
}

export function getBaiduGpsPointByGps(p, callback) {
  onlineTrans2Baidu(p.x, p.y, function(res) {
    callback(res);
  });
}

export function getGpsPointByBaiduGps(point, callback) {
  onlineTrans2Baidu(point.x, point.y, function(res) {
    let dx = res.x;
    let dy = res.y;
    let gpsX = 2 * point.x - dx;
    let gpsY = 2 * point.y - dy;

    let result = { x: gpsX, y: gpsY };
    callback(result);
  });
}

/**
 * This callback is displayed as a global member.
 * @callback getGpsPointByBaiduGpsV2Callback
 * @param {Object[]} result - 百度转换结果集
 */

/**
 * 百度的经纬度纠偏获取真实位置v2
 * @export
 * @param {Object[]} points - 点串
 * @param {number} points[].x - x 轴坐标
 * @param {number} points[].y - y 轴坐标
 * @param {number} from - 源坐标类型
 * @param {number} to - 目的坐标类型
 * @param {getGpsPointByBaiduGpsV2Callback} callback - 处理完成回调
 */
export function getGpsPointByBaiduGpsV2(points, from, to, callback) {
  onlineTrans2BaiduV2(points, from, to, function(tmpPoints) {
    let result = tmpPoints.map(function(tmpPoint, index) {
      let point = points[index];
      let dx = tmpPoint.x;
      let dy = tmpPoint.y;
      let gpsX = 2 * point.x - dx;
      let gpsY = 2 * point.y - dy;
      return {
        x: gpsX,
        y: gpsY,
      };
    });

    callback && callback(result);
  });
}

/**
 * This callback is displayed as a global member.
 * @callback getPointByBaiduOnlineCallback
 * @param {Object[]} result - 百度转换结果集
 */

/**
 * 通过百度地图 api 进行坐标转换
 * @param {Object[]} points - 点串
 * @param {number} points[].x - x 轴坐标
 * @param {number} points[].y - y 轴坐标
 * @param {number} from - 源坐标类型
 * @param {number} to - 目的坐标类型
 * @param {getPointByBaiduOnlineCallback} callback - 处理完成回调
 * @returns {void}
 */
export function getPointByBaiduOnline(points, from, to, callback) {
  onlineTrans2BaiduV2(points, from, to, function(tmpPoints) {
    callback && callback(tmpPoints);
  });
}
