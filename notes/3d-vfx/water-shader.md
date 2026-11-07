---
layout: default
title: "Water Shader / 水面着色器"
category: "3D & VFX"
permalink: /notes/3d-vfx/water-shader/
---

水面效果可以把不同尺度的噪声组合起来：较大的形状提供波纹起伏，较细的细节补充表面变化。

## 水波纹理

- 将 **Voronoi Noise** 与 **Gradient Noise** 叠加，尝试形成有层次的水波纹理。
- Gradient Noise 可制作方向相反的两层，再叠加尝试生成闪烁细节（sparkles）。

## 屏幕空间变化

- 使用 **Screen Position** 作为渐变输入，制作随屏幕位置变化的遮罩或颜色渐变。

> 待补充：节点连接图、噪声尺度/速度、法线输出，以及目标软件（如 Maya、Houdini 或实时引擎）。

https://www.cyanilux.com/tutorials/2d-water-shader-breakdown/
## 原始版本

> [!example]- 展开查看修改前的原文
>
> Voronoi noise与gradient noise 叠加 做 水波纹理
> 
> gradient noise 左右反向 做sparkles
> 
> screenposition gradient
![Screenshot 2026-10-28 at 9.54.16 PM.png](/notes/)
