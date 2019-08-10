---
order: 0
title:
  zh-CN: 在线地址搜索（百度）
  en-US: online search
---

## zh-CN

使用在线地址搜索

```jsx
import { Button } from 'antd';
import { Addr } from 'yc-extra';

const addsOptions = { cityId: 332 };

const addr = new Addr(addsOptions);

addr.search('医院', 20, res => {
  console.log(res);
});

ReactDOM.render(<Button>获取地址</Button>, mountNode);
```
