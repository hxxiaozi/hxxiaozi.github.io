---
layout: default
title: "Retopology / 拓扑重建"
category: "3D & VFX"
permalink: /notes/3d-vfx/retopology/
---

记录的流程是先得到可用的简化网格，再按需要重建更规整的拓扑。具体选择取决于目标用途，例如动画变形、雕刻细节或实时模型。

1. **ZBrush Decimation**：使用 ZPlugin 中的 Decimation Master 简化高面数模型，便于后续处理或导出。简化前保留原始高模副本。
2. **Maya Quad Draw**：在参考表面上手动绘制四边形拓扑，适合需要控制边流和变形的模型。
3. **ZBrush ZRemesher**：自动重建网格；可使用 ZRemesher Guides 提示边流方向。

> 小提示：Decimation 是减面；Retopology 是重新组织网格。二者目标不同，减面结果不一定适合动画变形。

## 原始版本

> [!example]- 展开查看修改前的原文
>
> 1 Zbrush z-plugin dessimation
> 2 Maya Quaddraw
> 3 ZBrush- Z remesher Z remesher guides
