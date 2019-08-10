# yc-extra

工具集合，从 yc 扩展而来，支持 api 文档生成

## 拉取

```bash
npm i yc-extra -D
```

## 使用

```jsx
import { request, Addr } from 'yc-extra';

const { get } = request;

get('baidu').then(res => console.log(res));
```
