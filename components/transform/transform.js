/**
 * @module
 * @ignore
 */
import sysConfig from '../sysConfig';

const { getCfgByKey } = sysConfig;

export default function Transform() {
  this.transParams = null;
  // 转换类型 1：为七参数法，2为七参数+四参数法，3为四参数法，4为六参数法,6为七参数+四参数反转 9 四参数不做矩阵变换
  this.m_transType = 0;
  // 椭球类型  客户地图所采用的椭球类型，1为北京54椭球，2为西安80椭球,3为WGS-84椭球
  this.m_ellipseType = 0;
  // 中央经线 单位：度
  this.m_middleLine = 0.0;
  // XY坐标方向与是否取反 1/0 反向/正向
  this.m_rev = 0;
  // 西安80椭球
  this.m_xaEllipse = {};
  // 北京54椭球
  this.m_bjEllipse = {};
  // WGS-84椭球
  this.m_gpsEllipse = {};
  // 六参数
  this.m_sixParam = {};
  // 四参数
  this.m_fourParam = {};
  // 七参数
  this.m_sevenParam = {};
  // 二参数
  this.m_twoParam = {};

  // 四参数 反转
  this.m_fourParam_reverse = {};
  // 七参数 反转
  this.m_sevenParam_reverse = {};

  // 北京-54椭球参数
  this.m_bjEllipse.a = 6378245;
  this.m_bjEllipse.f = 1 / 298.3;
  this.m_bjEllipse.e2 = 0.006693421623;
  this.m_bjEllipse.A1 = 111134.8611;
  this.m_bjEllipse.A2 = -16036.4803;
  this.m_bjEllipse.A3 = 16.8281;
  this.m_bjEllipse.A4 = -0.022;

  // 西安-80椭球参数
  this.m_xaEllipse.a = 6378140;
  this.m_xaEllipse.f = 1 / 298.257;
  this.m_xaEllipse.e2 = 0.0066943849995879;
  this.m_xaEllipse.A1 = 111133.0047;
  this.m_xaEllipse.A2 = -16038.5282;
  this.m_xaEllipse.A3 = 16.8326;
  this.m_xaEllipse.A4 = -0.022;

  // WGS-84椭球参数
  this.m_gpsEllipse.a = 6378137;
  this.m_gpsEllipse.f = 1 / 298.257233563;
  this.m_gpsEllipse.e2 = 0.006694379989;
  this.m_gpsEllipse.A1 = 0.0;
  this.m_gpsEllipse.A2 = 0.0;
  this.m_gpsEllipse.A3 = 0.0;
  this.m_gpsEllipse.A4 = 0.0;

  this.loadParams = function() {
    this.transParams = getCfgByKey('transParams');

    this.m_ellipseType = Number(this.transParams.ellipseType);
    this.m_middleLine = Number(this.transParams.middleLine);
    this.m_transType = Number(this.transParams.transType);
    this.m_rev = Number(this.transParams.rev);

    // 根据转换类型取相应的转换参数
    switch (this.m_transType) {
      // 四参数转换
      case 1:
        {
          this.m_fourParam.x_off = Number(this.transParams.four_param.x_off);
          this.m_fourParam.y_off = Number(this.transParams.four_param.y_off);
          this.m_fourParam.angle = Number(this.transParams.four_param.angle);
          this.m_fourParam.m = Number(this.transParams.four_param.m);
        }
        break;
      // 四参数转换不矩阵变化
      case 9:
        {
          this.m_fourParam.x_off = Number(this.transParams.four_param.x_off);
          this.m_fourParam.y_off = Number(this.transParams.four_param.y_off);
          this.m_fourParam.angle = Number(this.transParams.four_param.angle);
          this.m_fourParam.m = Number(this.transParams.four_param.m);
        }
        break;
      // 六参数转换
      case 2:
        {
          this.m_sixParam.x0_local = Number(this.transParams.six_param.x0_local);
          this.m_sixParam.y0_local = Number(this.transParams.six_param.y0_local);
          this.m_sixParam.x0_gps = Number(this.transParams.six_param.x0_gps);
          this.m_sixParam.y0_gps = Number(this.transParams.six_param.y0_gps);
          this.m_sixParam.angle = Number(this.transParams.six_param.angle);
          this.m_sixParam.m = Number(this.transParams.six_param.m);
        }
        break;
      // 七参数转换
      case 3:
        {
          this.m_twoParam.x_off = Number(this.transParams.seven_param.x_off);
          this.m_twoParam.y_off = Number(this.transParams.seven_param.y_off);

          //this.initSevenParamXYOff(m_sevenParam, 'seven_param');
          this.m_sevenParam.x_off =
            Number(this.transParams.seven_param.seven_x_off) ||
            Number(this.transParams.seven_param.x_off);
          this.m_sevenParam.y_off =
            Number(this.transParams.seven_param.seven_y_off) ||
            Number(this.transParams.seven_param.y_off);

          this.m_sevenParam.z_off = Number(this.transParams.seven_param.seven_z_off);
          this.m_sevenParam.x_angle =
            Number(this.transParams.seven_param.seven_x_angle) * Math.PI / 648000;
          this.m_sevenParam.y_angle =
            Number(this.transParams.seven_param.seven_y_angle) * Math.PI / 648000;
          this.m_sevenParam.z_angle =
            Number(this.transParams.seven_param.seven_z_angle) * Math.PI / 648000;
          this.m_sevenParam.m = Number(this.transParams.seven_param.seven_m);
        }
        break;
      // 七参数+四参数转换
      case 4:
        {
          this.m_fourParam.x_off = Number(this.transParams.seven_four.four_x_off);
          this.m_fourParam.y_off = Number(this.transParams.seven_four.four_y_off);
          this.m_fourParam.angle = Number(this.transParams.seven_four.four_angle);
          this.m_fourParam.m = Number(this.transParams.seven_four.four_m);

          //this.initSevenParamXYOff(m_sevenParam, 'seven_four');
          this.m_sevenParam.x_off = Number(this.transParams.seven_four.seven_x_off);
          this.m_sevenParam.y_off = Number(this.transParams.seven_four.seven_y_off);

          this.m_sevenParam.z_off = Number(this.transParams.seven_four.seven_z_off);
          this.m_sevenParam.x_angle =
            Number(this.transParams.seven_four.seven_x_angle) * Math.PI / 648000;
          this.m_sevenParam.y_angle =
            Number(this.transParams.seven_four.seven_y_angle) * Math.PI / 648000;
          this.m_sevenParam.z_angle =
            Number(this.transParams.seven_four.seven_z_angle) * Math.PI / 648000;
          this.m_sevenParam.m = Number(this.transParams.seven_four.seven_m);
        }
        break;
      // 二参数，中央经线投影
      case 5:
        {
          this.m_twoParam.x_off = Number(this.transParams.trans_off.x_off);
          this.m_twoParam.y_off = Number(this.transParams.trans_off.y_off);
        }
        break;
      // 七参数+二参数反转
      case 6:
        {
          this.m_twoParam.x_off = Number(this.transParams.seven_param_rev.x_off);
          this.m_twoParam.y_off = Number(this.transParams.seven_param_rev.y_off);

          this.m_sevenParam.x_off = Number(this.transParams.seven_param_rev.seven_x_off);
          this.m_sevenParam.y_off = Number(this.transParams.seven_param_rev.seven_y_off);
          this.m_sevenParam.z_off = Number(this.transParams.seven_param_rev.seven_z_off);
          this.m_sevenParam.x_angle =
            Number(this.transParams.seven_param_rev.seven_x_angle) * Math.PI / 648000;
          this.m_sevenParam.y_angle =
            Number(this.transParams.seven_param_rev.seven_y_angle) * Math.PI / 648000;
          this.m_sevenParam.z_angle =
            Number(this.transParams.seven_param_rev.seven_z_angle) * Math.PI / 648000;
          this.m_sevenParam.m = Number(this.transParams.seven_param_rev.seven_m);
        }
        break;
      // 七参数+四参数 正反转两种参数
      case 21:
        {
          // 正转 七，四参数
          this.m_fourParam.x_off = Number(this.transParams.seven_four.four_x_off);
          this.m_fourParam.y_off = Number(this.transParams.seven_four.four_y_off);
          this.m_fourParam.angle = Number(this.transParams.seven_four.four_angle);
          this.m_fourParam.m = Number(this.transParams.seven_four.four_m);

          //this.initSevenParamXYOff(m_sevenParam, "seven_four");
          this.m_sevenParam.x_off = Number(this.transParams.seven_four.seven_x_off);
          this.m_sevenParam.y_off = Number(this.transParams.seven_four.seven_y_off);
          this.m_sevenParam.z_off = Number(this.transParams.seven_four.seven_z_off);
          this.m_sevenParam.x_angle =
            Number(this.transParams.seven_four.seven_x_angle) * Math.PI / 648000;
          this.m_sevenParam.y_angle =
            Number(this.transParams.seven_four.seven_y_angle) * Math.PI / 648000;
          this.m_sevenParam.z_angle =
            Number(this.transParams.seven_four.seven_z_angle) * Math.PI / 648000;
          this.m_sevenParam.m = Number(this.transParams.seven_four.seven_m);

          // 反转四 七参数
          this.m_fourParam_reverse.x_off = Number(this.transParams.seven_four_reverse.four_x_off);
          this.m_fourParam_reverse.y_off = Number(this.transParams.seven_four_reverse.four_y_off);
          this.m_fourParam_reverse.angle = Number(this.transParams.seven_four_reverse.four_angle);
          this.m_fourParam_reverse.m = Number(this.transParams.seven_four_reverse.four_m);

          this.m_sevenParam_reverse.x_off = Number(this.transParams.seven_four_reverse.seven_x_off);
          this.m_sevenParam_reverse.y_off = Number(this.transParams.seven_four_reverse.seven_y_off);
          this.m_sevenParam_reverse.z_off = Number(this.transParams.seven_four_reverse.seven_z_off);
          this.m_sevenParam_reverse.x_angle =
            Number(this.transParams.seven_four_reverse.seven_x_angle) * Math.PI / 648000;
          this.m_sevenParam_reverse.y_angle =
            Number(this.transParams.seven_four_reverse.seven_y_angle) * Math.PI / 648000;
          this.m_sevenParam_reverse.z_angle =
            Number(this.transParams.seven_four_reverse.seven_z_angle) * Math.PI / 648000;
          this.m_sevenParam_reverse.m = Number(this.transParams.seven_four_reverse.seven_m);
        }
        break;
    }
  };

  /**
   * WGS的经纬度转给定坐标系的XY
   * @param lon
   * @param lat
   * @returns {any}
   */
  this.convert2XY = function(lon, lat) {
    try {
      let p = null;
      // 高斯坐标转换
      if (lon > 0) {
        let dLon = this.DuToDFM(lon);
        let dLat = this.DuToDFM(lat);

        p = this.CoorTrans(dLat, dLon, 0);
      }
      // xy值反转
      return { x: p.y, y: p.x };
    } catch (e) {
      return null;
    }
  };

  /**
   * 给定坐标系的XY转WGS的经纬度
   * @param x
   * @param y
   */
  this.convert2BL = function(x, y) {
    // xy值反转
    return this.CoorTransConverse(y, x);
  };

  // 高斯投影
  // ellipseType 椭球类型
  // middleLine 中央经线，单位：度
  // B,L 纬度和经度，单位弧度
  // x y 高斯投影后的平面坐标，单位：米
  // 返回值：操作是否成功，0-失败，1-成功
  this.GaosPrj = function(ellipseType, middleLine, B, L) {
    let retXY = null;
    let x, y;

    let e2 = 0.0;
    let a = 0.0;

    // 根据椭球类型取相应的参数
    switch (ellipseType) {
      // 北京54椭球
      case 1:
        a = this.m_bjEllipse.a;
        e2 = this.m_bjEllipse.e2;
        break;
      // 西安80椭球
      case 2:
        a = this.m_xaEllipse.a;
        e2 = this.m_xaEllipse.e2;
        break;
      // WGS-84椭球
      case 3:
        a = this.m_gpsEllipse.a;
        e2 = this.m_gpsEllipse.e2;
        break;
      default:
        break;
    }

    // 将度转换为弧度
    let b = B;
    // DFMToRad(B,b);

    // 计算经度差
    let l1 = 0.0;
    let mid = 0.0;
    mid = middleLine * Math.PI / 180.0;
    l1 = L - mid;

    // 高斯投影所需的系数
    let g = 0.0;
    g = Math.sqrt(e2 / (1 - e2)) * Math.cos(b);
    let g2 = 0.0,
      g4 = 0.0;
    g2 = g * g;
    g4 = g2 * g2;
    let t = 0.0;
    t = Math.tan(b);
    let t2 = 0.0,
      t4 = 0.0;
    t2 = t * t;
    t4 = t2 * t2;
    let m = 0.0;
    m = l1 * Math.cos(b);
    let m2 = 0.0,
      m3 = 0.0,
      m4 = 0.0,
      m5 = 0.0,
      m6 = 0.0;
    m2 = m * m;
    m3 = m2 * m;
    m4 = m3 * m;
    m5 = m4 * m;
    m6 = m5 * m;

    let N = 0.0;
    N = a / Math.sqrt(1 - e2 * Math.sin(b) * Math.sin(b));
    // 子午线弧长
    let x0 = 0.0;
    // 求子午线弧长
    x0 = this.MeriddianArcLength(ellipseType, B, 5);
    // 计算高斯平面坐标
    x =
      x0 +
      N * t * m2 / 2 +
      N * t * (5 - t2 + 9 * g2 + 4 * g4) * m4 / 24 +
      N * t * (61 - 58 * t2 + t4 + 270 * g2 - 330 * g2 * t2) * m6 / 720;
    y =
      N * m +
      N * (1 - t2 + g2) * m3 / 6 +
      N * (5 - 18 * t2 + 14 * g2 - 58 * g2 * t2) * m5 / 120 +
      500000;

    retXY = { x: x, y: y };
    return retXY;
  };

  // 高斯逆向投影
  // ellipseType 椭球类型
  // middleLine 中央经线，单位：度
  // x y 高斯投影后的平面坐标，单位：米
  // B,L 纬度和经度，单位弧度
  // 返回值：操作是否成功，0-失败，1-成功
  this.GaussProjInvCal = function(ellipseType, middleLine, x, y) {
    let bl = null;
    let B = 0;
    let L = 0;

    // 调整X,Y坐标
    y -= 500000;

    // 得到常数
    let a = 0.0,
      e2 = 0.0;
    let A1 = 0.0,
      A2 = 0.0,
      A3 = 0.0,
      A4 = 0.0;
    switch (ellipseType) {
      // 北京54椭球
      case 1:
        a = this.m_bjEllipse.a;
        e2 = this.m_bjEllipse.e2;
        A1 = this.m_bjEllipse.A1;
        A2 = this.m_bjEllipse.A2;
        A3 = this.m_bjEllipse.A3;
        A4 = this.m_bjEllipse.A4;
        break;
      // 西安80椭球
      case 2:
        a = this.m_xaEllipse.a;
        e2 = this.m_xaEllipse.e2;
        A1 = this.m_xaEllipse.A1;
        A2 = this.m_xaEllipse.A2;
        A3 = this.m_xaEllipse.A3;
        A4 = this.m_xaEllipse.A4;
        break;
      // WGS-84椭球
      case 3:
        a = this.m_gpsEllipse.a;
        e2 = this.m_gpsEllipse.e2;
        A1 = this.m_gpsEllipse.A1;
        A2 = this.m_gpsEllipse.A2;
        A3 = this.m_gpsEllipse.A3;
        A4 = this.m_gpsEllipse.A4;
        break;

      default:
        break;
    }

    // 计算底点纬度
    let B0 = x / A1;
    let preB0 = 0.0;
    let eta = 0.0;
    do {
      preB0 = B0;
      B0 = B0 * Math.PI / 180.0;
      B0 = (x - (A2 * Math.sin(2 * B0) + A3 * Math.sin(4 * B0) + A4 * Math.sin(6 * B0))) / A1;
      eta = Math.abs(B0 - preB0);
    } while (eta > 0.000000001);
    B0 = B0 * Math.PI / 180.0;

    // 计算其它常数
    let sinB = Math.sin(B0);
    let cosB = Math.cos(B0);
    let t = Math.tan(B0);
    let t2 = t * t;
    let N = a / Math.sqrt(1 - e2 * sinB * sinB);
    let ng2 = cosB * cosB * e2 / (1 - e2);
    let V = Math.sqrt(1 + ng2);
    let yN = y / N;

    // 得到经纬度
    let L0 = middleLine * Math.PI / 180.0;
    B =
      B0 -
      (yN * yN -
        (5 + 3 * t2 + ng2 - 9 * ng2 * t2) * yN * yN * yN * yN / 12.0 +
        (61 + 90 * t2 + 45 * t2 * t2) * yN * yN * yN * yN * yN * yN / 360.0) *
        V *
        V *
        t /
        2;

    L =
      L0 +
      (yN -
        (1 + 2 * t2 + ng2) * yN * yN * yN / 6.0 +
        (5 + 28 * t2 + 24 * t2 * t2 + 6 * ng2 + 8 * ng2 * t2) * yN * yN * yN * yN * yN / 120.0) /
        cosB;

    bl = { x: B, y: L };
    return bl;
  };

  // 计算子午线弧长
  // B纬度，单位：弧度，N为迭代次数
  // 返回值：子午线弧长
  this.MeriddianArcLength = function(ellipseType, B, N) {
    // 椭球长半轴和扁率
    let a = 0.0;
    let f = 0.0;
    // 椭球类型，1：54椭球，2：80椭球，3：84椭球
    switch (ellipseType) {
      case 1:
        a = this.m_bjEllipse.a;
        f = this.m_bjEllipse.f;
        break;
      case 2:
        a = this.m_xaEllipse.a;
        f = this.m_xaEllipse.f;
        break;
      case 3:
        a = this.m_gpsEllipse.a;
        f = this.m_gpsEllipse.f;
        break;
      default:
        break;
    }
    // 将度转换为弧度
    let lat = B;
    // DFMToRad(B,lat);
    let i, n, m;
    let e2, ra, c, ff1, k, ff2, sin2;
    let k2 = [];
    for (i = 0; i < N; i++) {
      k2[i] = 0.0;
    }
    // 计算椭球第一篇心率
    e2 = f * (2 - f);
    //
    ra = a * (1 - e2);
    for (c = 1.0, n = 1; n <= N; n++) {
      c *= (2 * n - 1.0) * (2 * n + 1.0) / (4 * n * n) * e2;
      for (m = 0; m < n; m++) {
        k2[m] += c;
      }
    }
    ff1 = 1.0 + k2[0];
    ff2 = -k2[0];
    sin2 = Math.sin(lat) * Math.sin(lat);
    for (k = 1.0, n = 1; n < N; n++) {
      k *= 2 * n / (2 * n + 1.0) * sin2;
      ff2 += -k2[n] * k;
    }
    return ra * (lat * ff1 + 0.5 * ff2 * Math.sin(2.0 * lat));
  };

  // 度分秒转换为弧度
  // ddffmm，要转换的参数，单位ddffmm（1202532.6）
  // rad，转换后的结果参数，单位：弧度
  // 返回值：操作是否成功，0-失败，1-成功
  this.DFMToRad = function(ddffmm, rad) {
    let degree = 0.0,
      minutes = 0.0,
      second = 0.0;
    // double tmp=0.0;
    let flag = 0;
    // 判断参数的正负
    if (ddffmm < 0) {
      flag = -1;
    } else {
      flag = 1;
    }
    // 取参数的绝对值
    ddffmm = Math.abs(ddffmm);
    // 取度
    degree = Math.floor(ddffmm / 10000);
    // 取分
    minutes = Math.floor((ddffmm - degree * 10000) / 100);
    // 取秒
    second = ddffmm - degree * 10000 - minutes * 100;
    let dd = 0.0;
    // 转换为弧度
    dd = flag * (degree + minutes / 60 + second / 3600);
    rad = dd * Math.PI / 180.0;

    return rad;
  };

  // 弧度转为ddffmm
  this.RadToDFM = function(rad, ddffmm) {
    // 转化为度
    let du = rad * 180.0 / Math.PI;
    let degree = Math.floor(du);
    let bigminutes = (du - degree) * 60;
    let minutes = Math.floor(bigminutes);
    let second = (bigminutes - minutes) * 60;
    ddffmm = degree * 10000 + minutes * 100 + second;

    return ddffmm;
  };

  /*
     * // 七参数转换 // param_7 七参数结构体 // X，Y，Z待转换的空间直角坐标，单位 米 //
     * X1，Y1,Z1转换后的空间直角坐标，单位：米 // 返回值：操作是否成功，0-失败，1-成功 private short
     * SevenParamTrans(SEVENPARAM param_7, double X, double Y, double Z, GpsXYZ
     * xyz) { double X1 = xyz.x, Y1 = xyz.y, Z1 = xyz.z;
     *
     * X1 = param_7.x_off + Y * param_7.z_angle - Z * param_7.y_angle + (1 +
     * param_7.m) * X; Y1 = param_7.y_off - X * param_7.z_angle + Z *
     * param_7.x_angle + (1 + param_7.m) * Y; Z1 = param_7.z_off + X *
     * param_7.y_angle - Y * param_7.x_angle + (1 + param_7.m) * Z;
     *
     * return 1; }
     */

  // 七参数转换(矩阵版)
  // param_7 七参数结构体
  // X，Y，Z待转换的空间直角坐标，单位 米
  // X1，Y1,Z1转换后的空间直角坐标，单位：米
  // 返回值：操作是否成功，0-失败，1-成功
  this.SevenParamTrans_Multi = function(param_7, X, Y, Z) {
    let xyzRet = null;
    let X1 = 0,
      Y1 = 0,
      Z1 = 0;

    // 秒转换
    let Cvt_Param_7 = param_7;

    // 条件
    let transX = X;
    let transY = Y;
    let transZ = Z;

    // Xi矩阵
    let Xi = new NNMatrix(3, 1);
    Xi.Matrix[0][0] = transX;
    Xi.Matrix[1][0] = transY;
    Xi.Matrix[2][0] = transZ;

    // DX矩阵
    let DX = new NNMatrix(3, 1);
    DX.Matrix[0][0] = Cvt_Param_7.x_off;
    DX.Matrix[1][0] = Cvt_Param_7.y_off;
    DX.Matrix[2][0] = Cvt_Param_7.z_off;

    // tY矩阵
    let tY = new NNMatrix(3, 1);

    // k矩阵
    let K = new NNMatrix(1, 1);
    K.Matrix[0][0] = 1 + Cvt_Param_7.m;

    // Mx矩阵
    let Mx = new NNMatrix(3, 3);
    Mx.Matrix[0][0] = 1.0;
    Mx.Matrix[0][1] = 0.0;
    Mx.Matrix[0][2] = 0.0;

    Mx.Matrix[1][0] = 0.0;
    Mx.Matrix[1][1] = Math.cos(Cvt_Param_7.x_angle);
    Mx.Matrix[1][2] = Math.sin(Cvt_Param_7.x_angle);

    Mx.Matrix[2][0] = 0.0;
    Mx.Matrix[2][1] = -Math.sin(Cvt_Param_7.x_angle);
    Mx.Matrix[2][2] = Math.cos(Cvt_Param_7.x_angle);

    // My矩阵
    let My = new NNMatrix(3, 3);

    My.Matrix[0][0] = Math.cos(Cvt_Param_7.y_angle);
    My.Matrix[0][1] = 0.0;
    My.Matrix[0][2] = -Math.sin(Cvt_Param_7.y_angle);

    My.Matrix[1][0] = 0.0;
    My.Matrix[1][1] = 1.0;
    My.Matrix[1][2] = 0.0;

    My.Matrix[2][0] = Math.sin(Cvt_Param_7.y_angle);
    My.Matrix[2][1] = 0.0;
    My.Matrix[2][2] = Math.cos(Cvt_Param_7.y_angle);

    // Mz矩阵
    let Mz = new NNMatrix(3, 3);

    Mz.Matrix[0][0] = Math.cos(Cvt_Param_7.z_angle);
    Mz.Matrix[0][1] = Math.sin(Cvt_Param_7.z_angle);
    Mz.Matrix[0][2] = 0.0;

    Mz.Matrix[1][0] = -Math.sin(Cvt_Param_7.z_angle);
    Mz.Matrix[1][1] = Math.cos(Cvt_Param_7.z_angle);
    Mz.Matrix[1][2] = 0.0;

    Mz.Matrix[2][0] = 0.0;
    Mz.Matrix[2][1] = 0.0;
    Mz.Matrix[2][2] = 1.0;

    // 计算M矩阵
    let M = new NNMatrix(3, 3);
    M = NNMatrix.Multiplication(Mz, My);
    M = NNMatrix.Multiplication(M, Mx);

    // 7参数矩阵变换
    tY = NNMatrix.Multiplication(Xi, K); // 缩放
    tY = NNMatrix.Multiplication(M, tY); // 旋转
    tY = NNMatrix.Add(tY, DX); // 平移

    // 返回
    X1 = tY.Matrix[0][0];
    Y1 = tY.Matrix[1][0];
    Z1 = tY.Matrix[2][0];

    xyzRet = { x: X1, y: Y1, z: Z1 };
    return xyzRet;
  };

  this.SevenParamTransReverse = function(param_7, x, y, z) {
    let xyzObj = {};
    // Xi矩阵
    let Xi = new NNMatrix(3, 1);
    Xi.Matrix[0][0] = x;
    Xi.Matrix[1][0] = y;
    Xi.Matrix[2][0] = z;
    // DX矩阵
    let DX = new NNMatrix(3, 1);
    DX.Matrix[0][0] = -param_7.x_off;
    DX.Matrix[1][0] = -param_7.y_off;
    DX.Matrix[2][0] = -param_7.z_off;
    // tY矩阵
    let tY = new NNMatrix(3, 1);
    // k值
    K = 1.0 / (1.0 + param_7.m);
    // k矩阵
    //let K = new NNMatrix(1, 1);
    //K.Matrix[0, 0] = 1.0 / (1.0 + param_7.m);
    // Mx矩阵
    let Mx = new NNMatrix(3, 3);
    Mx.Matrix[0][0] = 1.0;
    Mx.Matrix[0][1] = 0.0;
    Mx.Matrix[0][2] = 0.0;

    Mx.Matrix[1][0] = 0.0;
    Mx.Matrix[1][1] = Math.cos(-param_7.x_angle);
    Mx.Matrix[1][2] = Math.sin(-param_7.x_angle);

    Mx.Matrix[2][0] = 0.0;
    Mx.Matrix[2][1] = -Math.sin(-param_7.x_angle);
    Mx.Matrix[2][2] = Math.cos(-param_7.x_angle);

    // My矩阵
    let My = new NNMatrix(3, 3);
    My.Matrix[0][0] = Math.cos(-param_7.y_angle);
    My.Matrix[0][1] = 0.0;
    My.Matrix[0][2] = -Math.sin(-param_7.y_angle);

    My.Matrix[1][0] = 0.0;
    My.Matrix[1][1] = 1.0;
    My.Matrix[1][2] = 0.0;

    My.Matrix[2][0] = Math.sin(-param_7.y_angle);
    My.Matrix[2][1] = 0.0;
    My.Matrix[2][2] = Math.cos(-param_7.y_angle);

    // Mz矩阵
    let Mz = new NNMatrix(3, 3);
    Mz.Matrix[0][0] = Math.cos(-param_7.z_angle);
    Mz.Matrix[0][1] = Math.sin(-param_7.z_angle);
    Mz.Matrix[0][2] = 0.0;

    Mz.Matrix[1][0] = -Math.sin(-param_7.z_angle);
    Mz.Matrix[1][1] = Math.cos(-param_7.z_angle);
    Mz.Matrix[1][2] = 0.0;

    Mz.Matrix[2][0] = 0.0;
    Mz.Matrix[2][1] = 0.0;
    Mz.Matrix[2][2] = 1.0;

    // 计算M矩阵
    let M = new NNMatrix(3, 3);
    M = NNMatrix.Multiplication(Mz, My);
    M = NNMatrix.Multiplication(M, Mx);
    // 7参数矩阵变换
    tY = NNMatrix.Add(Xi, DX); //平移
    tY = NNMatrix.Multiplication(M, tY); //旋转
    tY = NNMatrix.MultiplicationValue(tY, K); //缩放
    // 返回
    x1 = tY.Matrix[0][0];
    y1 = tY.Matrix[1][0];
    z1 = tY.Matrix[2][0];

    xyzObj = { x: x1, y: y1, z: z1 };
    return xyzObj;
  };

  // 四参数转换
  // param_4 四参数结构体
  // x0,y0 待转换的平面直角坐标，单位：米
  // x，y转换后的平面直角坐标，单位：米
  // 返回值：操作是否成功，0-失败，1-成功
  this.FourParamTrans = function(param_4, x, y) {
    let xy = null;
    let x0 = 0,
      y0 = 0;
    let deltax = 0.0,
      deltay = 0.0,
      a = 0.0,
      b = 0.0;

    deltax = param_4.x_off;
    deltay = param_4.y_off;

    a = param_4.m * Math.cos(param_4.angle);
    b = param_4.m * Math.sin(param_4.angle);
    if (this.isZero(a) || this.isZero(b)) {
      xy = this.fixFourParamTrans(param_4, x, y);
    } else {
      //2016-02-01 字政专
      y0 = (y - deltay - (x - deltax) / a * b) / ((a * a + b * b) / a);
      x0 = (x - deltax + y0 * b) / a;
      //x0 = deltax + x * a - y * b;
      //y0 = deltay + y * a + x * b;

      if (this.m_rev == 0) {
        xy = { x: y0, y: x0 };
      } else {
        xy = { x: x0, y: y0 };
      }
    }
    return xy;
  };

  this.fixFourParamTrans = function(param_4, x0, y0) {
    let xy = null;
    let x = 0,
      y = 0;

    // 原点矩阵
    let X0 = new NNMatrix(2, 1);
    X0.Matrix[0][0] = param_4.x_off;
    X0.Matrix[1][0] = param_4.y_off;

    // 尺度差矩阵
    let ppm = new NNMatrix(1, 1);
    ppm.Matrix[0][0] = 1 + param_4.m;

    // 角度矩阵
    let ang_Cvt = param_4.angle * Math.PI / 180.0 / 3600.0;
    let ang_Matrix = new NNMatrix(2, 2);
    if (this.m_rev == 1) {
      ang_Matrix.Matrix[0][0] = Math.cos(ang_Cvt);
      ang_Matrix.Matrix[0][1] = Math.sin(ang_Cvt);

      ang_Matrix.Matrix[1][0] = -Math.sin(ang_Cvt);
      ang_Matrix.Matrix[1][1] = Math.cos(ang_Cvt);
    } else {
      ang_Matrix.Matrix[0][0] = Math.cos(ang_Cvt);
      ang_Matrix.Matrix[0][1] = -Math.sin(ang_Cvt);

      ang_Matrix.Matrix[1][0] = Math.sin(ang_Cvt);
      ang_Matrix.Matrix[1][1] = Math.cos(ang_Cvt);
    }

    // 入口矩阵
    let input_Matrix = new NNMatrix(2, 1);
    input_Matrix.Matrix[0][0] = x0;
    input_Matrix.Matrix[1][0] = y0;

    // 矩阵变换
    let out_Matrix = new NNMatrix(2, 1);
    input_Matrix = NNMatrix.Multiplication(ang_Matrix, input_Matrix);
    input_Matrix = NNMatrix.Multiplication(input_Matrix, ppm);
    out_Matrix = NNMatrix.Add(input_Matrix, X0);

    // 结果
    x = out_Matrix.Matrix[0][0];
    y = out_Matrix.Matrix[1][0];

    xy = { x: x, y: y };

    return xy;
  };

  // 四参数转换-针对类没有进行椭球转换时的粗略转换
  // param_4 四参数结构体
  // x0,y0 待转换的平面直角坐标，单位：米
  // x，y转换后的平面直角坐标，单位：米
  // 返回值：操作是否成功，0-失败，1-成功
  this.FourParamTransLYG = function(param_4, x0, y0) {
    let x = 0,
      y = 0;
    let deltax = 0.0,
      deltay = 0.0,
      a = 0.0,
      b = 0.0;

    deltax = param_4.x_off;
    deltay = param_4.y_off;

    a = param_4.m * Math.cos(param_4.angle);
    b = param_4.m * Math.sin(param_4.angle);

    x = deltax + x0 * a - y0 * b;
    y = deltay + y0 * a + x0 * b;

    let xy = null;
    if (this.m_rev == 0) {
      xy = { x: y, y: x };
    } else {
      xy = { x: x, y: y };
    }
    return xy;
  };

  this.FourParamTransReverse = function(param_4, x, y) {
    let pnt = null;
    let x0 = 0,
      y0 = 0;

    let deltax = 0.0,
      deltay = 0.0,
      a = 0.0,
      b = 0.0;

    deltax = param_4.x_off;
    deltay = param_4.y_off;

    a = param_4.m * Math.cos(param_4.angle);
    b = param_4.m * Math.sin(param_4.angle);

    if (this.isZero(a) || this.isZero(b)) {
      pnt = this.fixFourParamTransReverse(param_4, x, y);
    } else {
      x0 = ((x - deltax) * a + (y - deltay) * b) / (a * a + b * b);
      y0 = (y - deltay - x0 * b) / a;
      pnt = { x: x0, y: y0 };
    }

    return pnt;
  };

  this.fixFourParamTransReverse = function(param_4, x, y) {
    let pnt = {};
    // 原点矩阵
    let X0 = new NNMatrix(2, 1);
    X0.Matrix[0][0] = -param_4.x_off;
    X0.Matrix[1][0] = -param_4.y_off;

    // 尺度差矩阵
    let ppm = new NNMatrix(1, 1);
    ppm.Matrix[0][0] = 1 / (1 + param_4.m);

    // 角度矩阵
    let ang_Cvt = param_4.angle * Math.PI / 180.0 / 3600.0;
    let ang_Matrix = new NNMatrix(2, 2);

    ang_Matrix.Matrix[0][0] = Math.cos(ang_Cvt);
    ang_Matrix.Matrix[0][1] = Math.sin(ang_Cvt);
    ang_Matrix.Matrix[1][0] = -Math.sin(ang_Cvt);
    ang_Matrix.Matrix[1][1] = Math.cos(ang_Cvt);

    // 入口矩阵
    let input_Matrix = new NNMatrix(2, 1);
    input_Matrix.Matrix[0][0] = x;
    input_Matrix.Matrix[1][0] = y;

    // 矩阵变换
    let out_Matrix = new NNMatrix(2, 1);
    input_Matrix = NNMatrix.Add(input_Matrix, X0);
    input_Matrix = NNMatrix.Multiplication(input_Matrix, ppm);
    out_Matrix = NNMatrix.Multiplication(ang_Matrix, input_Matrix);

    // 结果
    x1 = out_Matrix.Matrix[0][0];
    y1 = out_Matrix.Matrix[1][0];

    pnt = { x: out_Matrix.Matrix[0][0], y: out_Matrix.Matrix[1][0] };

    return pnt;
  };

  this.FourParamTransReverseLYG = function(param_4, x0, y0) {
    let x = 0,
      y = 0;

    //x = param_4.x_off + x0 * param_4.m * Math.cos(param_4.angle) - y0 * param_4.m * Math.sin(param_4.angle);
    //y = param_4.y_off + y0 * param_4.m * Math.cos(param_4.angle) + x0 * param_4.m * Math.sin(param_4.angle);

    let deltax = 0.0,
      deltay = 0.0,
      a = 0.0,
      b = 0.0;

    deltax = param_4.x_off;
    deltay = param_4.y_off;

    a = param_4.m * Math.cos(param_4.angle);
    b = param_4.m * Math.sin(param_4.angle);

    //x0 = deltax + x*a - y*b;
    //y0 = deltay + y*a + x*b;

    //x = ((x0-deltax)*a + (y0-deltay)*b)/(a*a + b*b);
    //y = (y0 - deltay - x*b)/a;
    //2016-02-01 字政专
    y = (y0 - deltay - (x0 - deltax) / a * b) / ((a * a + b * b) / a);
    x = (x0 - deltax + y * b) / a;

    let xy = { x: x, y: y };
    return xy;
  };

  // 六参数转换
  // param_6 六参数结构体
  // x0 y0 待转换的平面坐标，单位：米
  // x y转换后的平面坐标，单位：米
  // 返回值：操作是否成功，0-失败，1-成功
  this.SixParamTrans = function(param_6, x0, y0) {
    let xy;

    let x =
      param_6.x0_local +
      (1 + param_6.m) *
        ((x0 - param_6.x0_gps) * Math.cos(param_6.angle) +
          (y0 - param_6.y0_gps) * Math.sin(param_6.angle));
    let y =
      param_6.y0_local +
      (1 + param_6.m) *
        ((y0 - param_6.y0_gps) * Math.cos(param_6.angle) -
          (x0 - param_6.x0_gps) * Math.sin(param_6.angle));

    xy = { x: x, y: y };
    return xy;
  };

  // 将经纬度坐标转换为空间直角坐标
  // B 纬度，单位，弧度
  // L经度，单位：弧度
  // H高程，单位：米
  // X,Y,Z,单位：米
  // 返回值：操作是否成功，0-失败，1-成功
  this.BLH2XYZ = function(ellipseType, B, L, H) {
    let xyzRet = null;
    let X1 = 0,
      Y1 = 0,
      Z1 = 0;
    // 根据椭球类型取相应的参数
    let a = 0.0,
      e2 = 0.0;
    switch (ellipseType) {
      // 北京54椭球
      case 1:
        a = this.m_bjEllipse.a;
        e2 = this.m_bjEllipse.e2;
        break;
      // 西安80椭球
      case 2:
        a = this.m_xaEllipse.a;
        e2 = this.m_xaEllipse.e2;
        break;
      // WGS-84椭球
      case 3:
        a = this.m_gpsEllipse.a;
        e2 = this.m_gpsEllipse.e2;
        break;
      default:
        break;
    }

    // 转换
    let N = a / Math.sqrt(1 - e2 * Math.sin(B) * Math.sin(B));
    let X = (N + H) * Math.cos(B) * Math.cos(L);
    let Y = (N + H) * Math.cos(B) * Math.sin(L);
    let Z = (N * (1 - e2) + H) * Math.sin(B);

    xyzRet = { x: X, y: Y, z: Z };
    return xyzRet;
  };

  // 空间直角坐标转换为经纬度
  // X,Y,Z,单位：米
  // B, 纬度，单位：弧度
  // L 经度，单位：弧度
  // 客户地图所采用的椭球类型，1为北京54椭球，2为西安80椭球
  // 返回值：操作是否成功，0-失败，1-成功
  this.XYZ2BL = function(ellipseType, X, Y, Z) {
    let xy;
    let B, L;

    // 根据椭球类型取相应的参数
    let a = 0.0,
      e2 = 0.0;
    switch (ellipseType) {
      // 北京54椭球
      case 1:
        a = this.m_bjEllipse.a;
        e2 = this.m_bjEllipse.e2;
        break;
      // 西安80椭球
      case 2:
        a = this.m_xaEllipse.a;
        e2 = this.m_xaEllipse.e2;
        break;
      // WGS-84椭球
      case 3:
        a = this.m_gpsEllipse.a;
        e2 = this.m_gpsEllipse.e2;
        break;
      default:
        break;
    }

    // 经度arctan(y/x)
    let fResult = Math.atan2(Y, X);
    let val = 0;
    let ang = fResult;
    while (true) {
      if (ang >= 0.0 && ang <= Math.PI) {
        val = ang;
        break;
      }

      if (ang < 0.0) {
        val += Math.PI;
        break;
      }

      if (ang > Math.PI) {
        val -= Math.PI;
        break;
      }
    }
    fResult = val;
    L = fResult;

    // 纬度 atan((z+E*N*sin(B)) / sqrt(x*x + y*y))
    let eta = 0.0,
      preLat = 0.0,
      lat = 0.0,
      fTmpL = 0.0,
      fTmpR = 0.0;
    do {
      preLat = lat;
      let E = e2; // 偏心率
      let N = a / Math.sqrt(1 - e2 * Math.sin(preLat) * Math.sin(preLat));
      fTmpL = Z + E * N * Math.sin(preLat);
      fTmpR = Math.sqrt(X * X + Y * Y);
      lat = Math.atan2(fTmpL, fTmpR);
      eta = Math.abs(lat - preLat);
    } while (eta > 0.000000001);
    ang = lat;
    while (true) {
      if (ang >= 0.0 && ang <= Math.PI) {
        val = ang;
        break;
      }

      if (ang < 0.0) {
        val += Math.PI;
        break;
      }

      if (ang > Math.PI) {
        val -= Math.PI;
        break;
      }
    }
    B = val;

    xy = { x: B, y: L };
    return xy;
  };

  // / <summary>
  // 逆向转变,将本地坐标转换为WGS84坐标
  // / </summary>
  // / <param name='x='本地坐标X</param>
  // / <param name='y='本地坐标Y</param>
  // / <param name='B='WGS84坐标 经度</param>
  // / <param name='L='纬度</param>
  // / <returns>是否成功</returns>
  this.CoorTransConverse = function(x, y) {
    let bl;

    let X = 0.0,
      Y = 0.0,
      Z = 0.0;
    let b = 0.0;

    try {
      // 偏移量
      X = x;
      Y = y;
      let xyCoor = null;
      let revBL = null;
      let xyz1 = null;
      let xyz2 = null;

      switch (this.m_transType) {
        case 9:
          {
            if (this.m_rev == 0) {
              X = y;
              Y = x;
            } else {
              X = x;
              Y = y;
            }
            xyCoor = this.FourParamTransReverseLYG(this.m_fourParam, X, Y);
            ////高斯逆向投影
            revBL = this.GaussProjInvCal(this.m_ellipseType, this.m_middleLine, xyCoor.x, xyCoor.y);
            // 经纬度转化为直角坐标
            //xyz1 = this.BLH2XYZ(this.m_ellipseType, revBL.x, revBL.y, 0);
            //xyz2 = this.SevenParamTransReverse(this.m_sevenParam, xyz1.x, xyz1.y, xyz1.z);
            //revBL = this.XYZ2BL((short)3, xyz2.x, xyz2.y, xyz2.z);
          }
          break;
        case 3:
          X = X - this.m_twoParam.y_off;
          Y = Y - this.m_twoParam.x_off;
          ////高斯逆向投影
          revBL = this.GaussProjInvCal(this.m_ellipseType, this.m_middleLine, X, Y);
          // 经纬度转化为直角坐标
          xyz1 = this.BLH2XYZ(this.m_ellipseType, revBL.x, revBL.y, 0);
          xyz2 = this.SevenParamTransReverse(this.m_sevenParam, xyz1.x, xyz1.y, xyz1.z);
          revBL = this.XYZ2BL(3, xyz2.x, xyz2.y, xyz2.z);
          break;
        case 5:
          {
            X = X - this.m_twoParam.y_off;
            Y = Y - this.m_twoParam.x_off;
            ////高斯逆向投影
            revBL = this.GaussProjInvCal(this.m_ellipseType, this.m_middleLine, X, Y);
          }
          break;
        case 21:
          {
            xyCoor = this.FourParamTransReverse(this.m_fourParam_reverse, X, Y);
            ////高斯逆向投影
            revBL = this.GaussProjInvCal(this.m_ellipseType, this.m_middleLine, xyCoor.x, xyCoor.y);
            // 经纬度转化为直角坐标
            xyz1 = this.BLH2XYZ(this.m_ellipseType, revBL.x, revBL.y, 0);
            xyz2 = this.SevenParamTransReverse(this.m_sevenParam_reverse, xyz1.x, xyz1.y, xyz1.z);
            revBL = this.XYZ2BL(3, xyz2.x, xyz2.y, xyz2.z);
          }
          break;
        default:
          {
            xyCoor = this.FourParamTransReverse(this.m_fourParam, X, Y);
            ////高斯逆向投影
            revBL = this.GaussProjInvCal(this.m_ellipseType, this.m_middleLine, xyCoor.x, xyCoor.y);
            // 经纬度转化为直角坐标
            xyz1 = this.BLH2XYZ(this.m_ellipseType, revBL.x, revBL.y, 0);
            xyz2 = this.SevenParamTransReverse(this.m_sevenParam, xyz1.x, xyz1.y, xyz1.z);
            revBL = this.XYZ2BL(3, xyz2.x, xyz2.y, xyz2.z);
          }
          break;
      }
      // 转换回来

      y = revBL.x * 180 / Math.PI;
      x = revBL.y * 180 / Math.PI;

      bl = { x: x, y: y };
      return bl;
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // 坐标转换，
  // B 纬度单位（度分秒 ddffmm如1203036.23）L经度，单位（度分秒 ddffmm）
  // x y为转换后的平面坐标，单位为 米
  // 返回值：操作是否成功，0-失败，1-成功
  this.CoorTrans = function(B, L, H) {
    let xySource;
    let x, y;

    let x0 = 0.0,
      y0 = 0.0;
    let X = 0.0,
      Y = 0.0,
      Z = 0.0,
      X1 = 0.0,
      Y1 = 0.0,
      Z1 = 0.0;
    let rev_L = 0.0,
      rev_B = 0.0;
    let b = 0.0,
      l = 0.0; // h=0.0;
    let X2 = 0.0,
      Y2 = 0.0,
      Z2 = 0.0;

    // 将度分秒转换为弧度
    if (this.m_transType < 6 || 9 == this.m_transType || 21 == this.m_transType) {
      b = this.DFMToRad(B, b);
      l = this.DFMToRad(L, l);
    } else {
      b = B;
      l = L;
    }

    // 根据转换类型进行分类处理
    // 1为四参数，2六参数，3七参数，4：七参数+四参数,5中央经线投影，二参数,6七参数+二参数反转
    // 椭球类型：1:北京54，2：西安80，3：WGS-84 椭球
    switch (this.m_transType) {
      case 1:
        // 高斯投影
        let xy0 = this.GaosPrj(1, this.m_middleLine, b, l);

        x0 = xy0.x;
        y0 = xy0.y;
        // 四参数坐标转换
        let xy = this.FourParamTrans(this.m_fourParam, x0, y0);

        x = xy.x;
        y = xy.y;
        break;
      case 2:
        // 高斯投影
        let xy01 = this.GaosPrj(3, this.m_middleLine, b, l);

        x0 = xy01.x;
        y0 = xy01.y;

        // 六参数坐标转换
        let xy1 = this.SixParamTrans(this.m_sixParam, x0, y0);

        x = xy1.x;
        y = xy1.y;
        break;
      case 3:
        let t_B = 0.0,
          t_L = 0.0;
        // 经纬度换算为空间直角坐标
        let xyz = this.BLH2XYZ(3, b, l, H);

        X = xyz.x;
        Y = xyz.y;
        Z = xyz.z;

        // 七参数坐标转换
        let xyz1 = this.SevenParamTrans_Multi(this.m_sevenParam, X, Y, Z);

        X1 = xyz1.x;
        Y1 = xyz1.y;
        Z1 = xyz1.z;

        // 空间直角坐标转换为经纬度
        let bl = this.XYZ2BL(this.m_ellipseType, X1, Y1, Z1);

        t_B = bl.x;
        t_L = bl.y;

        // 高斯投影
        let xy11 = this.GaosPrj(this.m_ellipseType, this.m_middleLine, t_B, t_L);
        x = xy11.x;
        y = xy11.y;

        x = x + this.m_twoParam.y_off;
        y = y + this.m_twoParam.x_off;
        break;
      case 4:
        t_B = 0.0;
        t_L = 0.0;
        // 经纬度换算为空间直角坐标
        let xyz11 = this.BLH2XYZ(3, b, l, H);

        X = xyz11.x;
        Y = xyz11.y;
        Z = xyz11.z;

        // 七参数坐标转换
        let xyz111 = this.SevenParamTrans_Multi(this.m_sevenParam, X, Y, Z);

        X1 = xyz111.x;
        Y1 = xyz111.y;
        Z1 = xyz111.z;

        // 空间直角坐标转换为经纬度
        let bl1 = this.XYZ2BL(this.m_ellipseType, X1, Y1, Z1);

        t_B = bl1.x;
        t_L = bl1.y;

        // 高斯投影
        let xy111 = this.GaosPrj(this.m_ellipseType, this.m_middleLine, t_B, t_L);
        x = xy111.x;
        y = xy111.y;

        // 四参数坐标转换
        let xy1111 = this.FourParamTrans(this.m_fourParam, x, y);
        x = xy1111.x;
        y = xy1111.y;
        break;
      case 5:
        // 进行高斯投影
        let xy11111 = this.GaosPrj(3, this.m_middleLine, b, l);
        x = xy11111.x;
        y = xy11111.y;

        // 偏移量
        x = x + this.m_twoParam.y_off;
        y = y + this.m_twoParam.x_off;
        break;
      case 6:
        // 偏移量
        X = l;
        Y = b;
        X = X + this.m_twoParam.x_off;
        Y = Y + this.m_twoParam.y_off;
        // 高斯逆向投影
        let bl11 = this.GaussProjInvCal(this.m_ellipseType, this.m_middleLine, Y, X);
        rev_B = bl11.x;
        rev_L = bl11.y;

        x = this.RadToDFM(rev_B, x);
        y = this.RadToDFM(rev_L, y);

        // 经纬度转化为直角坐标
        X1 = Y1 = Z1 = 0.0;

        let xyz1111 = this.BLH2XYZ(1, rev_B, rev_L, 0);
        X1 = xyz1111.x;
        Y1 = xyz1111.y;
        Z1 = xyz1111.z;

        X2 = Y2 = Z2 = 0.0;

        let xyz2 = this.SevenParamTrans_Multi(this.m_sevenParam, X1, Y1, Z1);
        X2 = xyz2.x;
        Y2 = xyz2.y;
        Z2 = xyz2.z;

        let bl111 = this.XYZ2BL(3, X2, Y2, Z2);
        rev_B = bl111.x;
        rev_L = bl111.y;

        // 转换回来
        x = this.RadToDFM(rev_L, x);
        y = this.RadToDFM(rev_B, y);
        break;
      case 9:
        {
          // 高斯投影
          let xy90 = this.GaosPrj(1, this.m_middleLine, b, l);
          x0 = xy90.x;
          y0 = xy90.y;
          // 四参数坐标转换
          let xy9 = this.FourParamTransLYG(this.m_fourParam, x0, y0);
          x = xy9.x;
          y = xy9.y;
        }
        break;
      case 21:
        {
          t_B = 0.0;
          t_L = 0.0;
          // 经纬度换算为空间直角坐标
          var xyz11 = this.BLH2XYZ(3, b, l, H);

          X = xyz11.x;
          Y = xyz11.y;
          Z = xyz11.z;

          // 七参数坐标转换
          var xyz111 = this.SevenParamTrans_Multi(this.m_sevenParam, X, Y, Z);

          X1 = xyz111.x;
          Y1 = xyz111.y;
          Z1 = xyz111.z;

          // 空间直角坐标转换为经纬度
          var bl1 = this.XYZ2BL(this.m_ellipseType, X1, Y1, Z1);

          t_B = bl1.x;
          t_L = bl1.y;

          // 高斯投影
          var xy111 = this.GaosPrj(this.m_ellipseType, this.m_middleLine, t_B, t_L);
          x = xy111.x;
          y = xy111.y;

          // 四参数坐标转换
          var xy1111 = this.FourParamTrans(this.m_fourParam, x, y);
          x = xy1111.x;
          y = xy1111.y;
        }
        break;
      default:
        break;
    }

    xySource = { x: x, y: y };
    return xySource;
  };

  // DDFFMM转换为小数格式
  this.DFMToRange = function(dfm, range) {
    let d = Math.floor(dfm / 10000);
    let f = Math.floor(dfm - d * 10000) / 100 / 60.0;
    let m = (dfm - d * 10000 - f * 6000) / 3600.0;

    range = d + f + m;

    return range;
  };

  // 小数格式转换为DDFFMM
  this.RangeToDFM = function(range, dfm) {
    let d = Math.floor(range);
    let f = Math.floor((range - d) * 60);
    let m = ((range - d) * 60 - f) * 60;
    dfm = d * 10000 + f * 100 + m;

    return dfm;
  };

  // WGS84经纬度转WGS84 web mercator投影
  this.LatLonToMeters = function(lon, lat) {
    // lon:经度
    // lat：纬度
    let originShift = 2 * Math.PI * 6378137 / 2.0;

    let mx = lon * originShift / 180.0;

    let my = Math.log(Math.tan((90 + lat) * Math.PI / 360.0)) / (Math.PI / 180.0);
    my = my * originShift / 180.0;

    return { x: mx, y: my };
  };

  // web mercator 转为 wgs84 经纬度
  this.inverseMercator = function(x, y) {
    let nt;

    let lon = x / 20037508.342787 * 180;
    let lat = y / 20037508.342787 * 180;

    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);

    nt = { x: lon, y: lat };
    return nt;
  };
  /**
   * 度转度分秒
   * @return {number}
   */
  this.DuToDFM = function(du) {
    let fDu, fFen;
    let fMiao;
    let strD, strF, strM, strResult;

    // 度
    fDu = Math.floor(du);
    strD = '' + fDu;
    // 分
    fMiao = (du - fDu) * 60;
    fFen = Math.floor(fMiao);
    strF = '' + fFen;
    if (strF.length < 2) {
      strF = '0' + strF;
    }
    // 秒
    fMiao = (fMiao - fFen) * 60;
    strM = '' + fMiao;
    if (fMiao < 10) {
      strM = '0' + strM;
    }
    strResult = strD + strF + strM;
    return Number(strResult);
  };
  this.isZero = function(data) {
    return Math.abs(data - 0.0) < 0.000006;
  };
  this.loadParams();
}

// 矩阵操作
function NNMatrix(Mrow, Mcol) {
  this.row = Mrow;
  this.col = Mcol;
  this.Matrix = [];

  for (let i = 0; i < this.row; i++) {
    this.Matrix[i] = [];
    for (let j = 0; j < this.col; j++) {
      this.Matrix[i][j] = 0;
    }
  }
}
// 矩阵加法
NNMatrix.Add = function(m1, m2) {
  if (m1.row == m2.row && m1.col == m2.col) {
    for (let i = 0; i < m1.row; i++) {
      for (let j = 0; j < m2.col; j++) {
        m1.Matrix[i][j] += m2.Matrix[i][j];
      }
    }
  }
  return m1;
};
// 矩阵加常量
NNMatrix.AddValue = function(m1, m2) {
  for (let i = 0; i < m1.row; i++) {
    for (let j = 0; j < m1.col; j++) {
      m1.Matrix[i][j] += m2;
    }
  }
  return m1;
};
// 矩阵减法
NNMatrix.Subtract = function(m1, m2) {
  if (m1.row == m2.row && m1.col == m2.col) {
    for (let i = 0; i < m1.row; i++) {
      for (let j = 0; j < m2.col; j++) {
        m1.Matrix[i][j] -= m2.Matrix[i][j];
      }
    }
  }
  return m1;
};
// 矩阵乘法
NNMatrix.Multiplication = function(m1, m2) {
  let m3r = m1.row;
  let m3c = m2.col;
  let m3 = new NNMatrix(m3r, m3c);

  if (m1.col == m2.row) {
    let value = 0.0;
    for (let i = 0; i < m3r; i++) {
      for (let j = 0; j < m3c; j++) {
        value = 0.0;
        for (let ii = 0; ii < m1.col; ii++) {
          value += m1.Matrix[i][ii] * m2.Matrix[ii][j];
        }

        m3.Matrix[i][j] = value;
      }
    }
  }
  /*
     * else throw new Exception('矩阵的行/列数不匹配。');
     */
  return m3;
};
// 矩阵乘以常量
NNMatrix.MultiplicationValue = function(m1, m2) {
  for (let i = 0; i < m1.row; i++) {
    for (let j = 0; j < m1.col; j++) {
      m1.Matrix[i][j] *= m2;
    }
  }
  return m1;
};
// 矩阵转秩
NNMatrix.Transpos = function(srcm) {
  let tmpm = new NNMatrix(srcm.col, srcm.row);
  for (let i = 0; i < srcm.row; i++) {
    for (let j = 0; j < srcm.col; j++) {
      if (i != j) {
        tmpm.Matrix[j][i] = srcm.Matrix[i][j];
      } else {
        tmpm.Matrix[i][j] = srcm.Matrix[i][j];
      }
    }
  }
  return tmpm;
};
// 交换
NNMatrix.swaper = function(m1, m2) {
  let sw;
  sw = m1;
  m1 = m2;
  m2 = sw;
};

/**
 * 实矩阵求逆的全选主元高斯－约当法
 *
 */
NNMatrix.Invers = function(srcm) {
  let rhc = srcm.row;
  if (srcm.row == srcm.col) {
    let iss = [];
    let jss = [];
    let fdet = 1;
    let f = 1;
    // 消元
    for (let k = 0; k < rhc; k++) {
      let fmax = 0;
      for (let i = k; i < rhc; i++) {
        for (let j = k; j < rhc; j++) {
          f = Math.abs(srcm.Matrix[i][j]);
          if (f > fmax) {
            fmax = f;
            iss[k] = i;
            jss[k] = j;
          }
        }
      }

      if (iss[k] != k) {
        f = -f;
        for (let ii = 0; ii < rhc; ii++) {
          swaper(srcm.Matrix[k][ii], srcm.Matrix[iss[k]][ii]);
        }
      }

      if (jss[k] != k) {
        f = -f;
        for (let ii = 0; ii < rhc; ii++) {
          swaper(srcm.Matrix[k][ii], srcm.Matrix[jss[k]][ii]);
        }
      }

      fdet *= srcm.Matrix[k][k];
      srcm.Matrix[k][k] = 1.0 / srcm.Matrix[k][k];
      for (let j = 0; j < rhc; j++) {
        if (j != k) {
          srcm.Matrix[k][j] *= srcm.Matrix[k][k];
        }
      }

      for (let i = 0; i < rhc; i++) {
        if (i != k) {
          for (let j = 0; j < rhc; j++) {
            if (j != k) {
              srcm.Matrix[i][j] = srcm.Matrix[i][j] - srcm.Matrix[i][k] * srcm.Matrix[k][j];
            }
          }
        }
      }

      for (let i = 0; i < rhc; i++) {
        if (i != k) {
          srcm.Matrix[i][k] *= -srcm.Matrix[k][k];
        }
      }
    }
    // 调整恢复行列次序
    for (let k = rhc - 1; k >= 0; k--) {
      if (jss[k] != k) {
        for (let ii = 0; ii < rhc; ii++) {
          swaper(srcm.Matrix[k][ii], srcm.Matrix[jss[k]][ii]);
        }
      }
      if (iss[k] != k) {
        for (let ii = 0; ii < rhc; ii++) {
          swaper(srcm.Matrix[k][ii], srcm.Matrix[iss[k]][ii]);
        }
      }
    }
  }

  return srcm;
};
// 矩阵输出
NNMatrix.MatrixPrint = function() {
  let tmprst;
  tmprst = '\n';
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      tmprst += Matrix[i][j] + '\t';
    }
    tmprst += '\n';
  }
  return tmprst;
};
