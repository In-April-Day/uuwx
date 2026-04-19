# Mars3D 地球背景功能说明

## 概述
本项目首页引入了 Mars3D（基于 Cesium）的 3D 地球背景，为用户提供沉浸式的太空视觉体验。

## 主要特性

### 🎯 3D 地球背景
- 真实的 3D 地球模型
- 可自定义的大气层效果
- 鼠标交互：视角跟随鼠标轻微移动

### ✨ 星空粒子
- 500 颗随机分布的星星
- 不同的亮度和大小
- 在太空背景中闪烁

### 🌍 大气层光晕
- 双层大气层效果
- 蓝色辉光渲染
- 增加地球的立体感

### 🔗 数据流动线
- 主要城市节点（北京、上海、深圳、纽约、伦敦、东京）
- 城市间的动态连接线
- 模拟全球数据网络

### 🛰️ 轨道系统
- 多角度轨道线
- 模拟卫星轨迹
- 不同颜色的轨道表示

### 🌟 卫星动画
- 4 颗动态卫星
- 沿轨道移动
- 不同颜色标识

## 安装依赖

```bash
pnpm add mars3d mars3d-cesium
```

## 使用方法

### 1. 导入组件
```typescript
import MarsEarthBackground from "@/components/MarsEarthBackground.vue";
```

### 2. 在页面中使用
```vue
<template>
  <div>
    <MarsEarthBackground 
      :auto-rotate="true"
      :rotate-speed="0.003"
      @map-ready="onMapReady"
    />
    <!-- 其他内容 -->
  </div>
</template>
```

### 3. 获取地图实例
```typescript
const onMapReady = (map: mars3d.Map) => {
  console.log("地图已加载", map);
  // 可以进行自定义操作
};
```

## 配置选项

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| autoRotate | boolean | true | 是否自动旋转地球 |
| rotateSpeed | number | 0.003 | 旋转速度 |
| opacity | number | 0.8 | 透明度 |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| mapReady | 地图加载完成 | map: mars3d.Map |

## 性能优化

1. **禁用不必要的控件**：关闭了太阳、月亮、导航控件等
2. **简化天空渲染**：使用纯色背景而非天空盒
3. **优化粒子数量**：星星数量限制在 500 颗
4. **层级管理**：合理的 z-index 确保性能

## 样式定制

可以通过 CSS 覆盖以下类来自定义外观：

```css
.mars-earth-container {
  /* 容器样式 */
}

.mars-map {
  /* 地图容器样式 */
}

.overlay-glow {
  /* 光晕效果 */
}

.overlay-vignette {
  /* 暗角效果 */
}
```

## 浏览器兼容

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 注意事项

1. 确保网络连接正常，Mars3D 需要加载在线资源
2. 首次加载可能需要几秒钟初始化时间
3. 在低性能设备上可能会影响页面流畅度
4. 需要 WebGL 支持

## 许可证

使用 Mars3D 及其相关组件时，请遵守 [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) 许可证。
