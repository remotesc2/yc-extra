import request from '../request/request';
import http from './http';
import base from '../request';
import * as table from './table';
import * as layer from './layer';

http.base = {
  request,
  ...base,
};

http.table = table;
http.layer = layer;

export default http;
