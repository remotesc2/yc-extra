/**
 * @module
 * @ignore
 */

export default class Gps2google {
  constructor() {
    this.pi = 3.14159265358979324;
    this.a = 6378245.0;
    this.ee = 0.00669342162296594323;
  }

  transform(wgLon, wgLat) {
    let latlng = [];
    if (this.outOfChina(wgLat, wgLon)) {
      latlng[0] = wgLat;
      latlng[1] = wgLon;
      throw new Error('经纬度坐标超出中国方位');
    }
    let dLat = this.transformLat(wgLon - 105.0, wgLat - 35.0);
    let dLon = this.transformLon(wgLon - 105.0, wgLat - 35.0);
    let radLat = wgLat / 180.0 * this.pi;
    let magic = Math.sin(radLat);
    magic = 1 - this.ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = dLat * 180.0 / (this.a * (1 - this.ee) / (magic * sqrtMagic) * this.pi);
    dLon = dLon * 180.0 / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);

    latlng[0] = wgLon + dLon;
    latlng[1] = wgLat + dLat;
    return latlng;
  }

  outOfChina(lat, lon) {
    if (lon < 72.004 || lon > 137.8347) {
      return true;
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true;
    }
    return false;
  }

  transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * this.pi) + 40.0 * Math.sin(y / 3.0 * this.pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * this.pi) + 320 * Math.sin(y * this.pi / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * this.pi) + 40.0 * Math.sin(x / 3.0 * this.pi)) * 2.0 / 3.0;
    ret +=
      (150.0 * Math.sin(x / 12.0 * this.pi) + 300.0 * Math.sin(x / 30.0 * this.pi)) * 2.0 / 3.0;
    return ret;
  }
}
