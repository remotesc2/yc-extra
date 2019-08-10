---
order: 0
title: yc-extra
---

基于 arcgis api for javascript(4.8+) 实现的一套 react 地图组件，使用 typescript 编写

## 模块划分

```bash
├── Map
├── Graphic
├── Layer
|  ├── TileLayer -- 瓦片图层
|  ├── VectorLayer -- 矢量图层
|  └── GraphicsLayer -- 图案图层
├── Geometry
|  ├── Point -- 点
|  ├── Polyline -- 线
|  └── Polygon -- 面
├── MapSymbol
|  ├── SimpleFillSymbol -- 填充样式
|  ├── SimpleLineSymbol -- 线样式
|  ├── SimpleMarkerSymbol -- 几何样式
|  └── TextSymbol -- 文字样式
├── Popup -- 弹框
└── Sketch -- 绘制
```

## 示例

```jsx
import { View, Map, Layer } from 'yc-extra';

const { MapView } = View;
const { TileLayer } = Layer;
const api = 'http://192.168.8.130:8085';

class App extends React.Component{
  render(){
    return (
      <div style={{width: '100%', height: '400px'}}>
        <MapView api={api}>
          <Map>
            <TileLayer url="https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer" />
          </Map>
        </MapView>
      </div>
    )
  }
}

ReactDOM.render(<App />, mountNode);
```
