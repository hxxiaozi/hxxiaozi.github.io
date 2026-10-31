---
layout: default
title: "Houdini Foundations H21"
category: "3D & VFX"
permalink: /notes/3d-vfx/houdini-foundations-h21/
---

> **重点：** 先建项目，再按「建几何 → 节点处理 → 模拟/实例 → Solaris 导入」推进。下面是快捷键和课堂练习的速查版。

## 核心练习流程

### 点上复制与变化

1. 创建基础几何（例如杯子上方的 Box）。
2. 用 `Scatter` 在表面生成点。
3. 用 `Copy to Points` 把 Sphere 复制到这些点。
4. 用 `Attribute Randomizer` 或点属性给副本添加颜色、缩放等变化。
5. 需要刚体运动时，接入 `RBD Bullet Solver`；地面碰撞类型记为 `Plane`。

**关键概念：** 点决定副本的位置；点上的属性还能控制副本的方向、大小和颜色。

### Solaris 导入准备

1. 切换到 `Desktop → Solaris`。
2. 按 `Tab` 创建 `Scene Import`。
3. Destination Path 设为 `/geo`。
4. 选择要导入的对象并确认对象匹配模式。
5. 当前笔记记录的起始帧为 frame 1。

> 这部分目前只记录导入步骤，还没有灯光、材质和最终渲染设置。

## 常用快捷键

| 操作 | 快捷键 / 路径 |
|---|---|
| 打开 Display Options | `D` |
| 退出当前操作 | `Esc` |
| Home View | `Space + H` |
| 四视图 | `Space + B` |
| Object / Point / Edge / Primitive 模式 | `1` / `2` / `3` / `4` |
| 打开节点/工具菜单 | `Tab` 或右键 |
| 检查对象内部网络 | 选中对象后按 `I` 或双击 |
| 创建 Network Box | `Shift + O` |
| 添加 Sticky Note | `Shift + P` |
| Shape Palette / Color Palette | `Z` / `C` |
| 断开 / 连接节点 | `Y` / `J` |

快捷键可能受键位设置和当前面板影响；`Space`、`Alt`、`A`、`N` 等操作请结合鼠标动作和视图焦点确认。

## 建模工具速查

- `C → Create → Geometry → Tube → Enter`：在原点附近创建 Tube。
- `Match Size`：匹配几何体的尺寸或位置。
- `Poly Fill`：补面；`Poly Extrude`：挤出几何。
- `Soft Transform`：对选区做带衰减的柔和变形。
- `Polygon Bridge`：连接两组边界；`Subdivide`：细分几何。
- `Reverse`：反转面法线；`Null`：作为网络中的标记或连接点。

选择模式决定编辑对象整体，还是点、边、面片等组成部分。

## 节点网络整理

- `Shift + O` 建框整理节点；`A` 加鼠标拖动用于对齐节点（按原笔记记录）。
- Info Panel 可写节点说明；给网络加注释，便于回看用途。
- `Alt` 添加连线拐点（按原笔记记录）。
- `Pack and Instance` 将几何打包并以实例方式复用，适合重复对象。
- `Modify Copy to Points` 用于继续调整复制结果；`Modify → Extract` 用于提取内容（菜单位置依上下文而异）。

## 新项目与保存

1. `File → New Project...`：设置项目名称并确认。
2. `File → Save As`：设置场景文件名并保存。

先建项目有助于把场景、素材和输出放在一起管理。

## 原始版本（对照）

> [!example]- 展开查看修改前的原文
>
> ## 1 Modelling
> ### Start
> File - New Project... - change Project Name - Accept
> FIle - Save As - change File - Accept
> 
> Display Options D
> 
> C - Create - Geometry - Tube - Enter（put to origin） 
> ### Scene View
> Esc 移动视角
> Space/Alt 
> Space H - Home View
> Space B - Four Views
> 
> ### Select Modes 
> N/Double Click select all
> 
> 1 Object
> 2 Point
> 3 Edge
> 4 Primitives
> ### Tab Menu Operations
> 
> Match Size
> Poly Fill
> Soft Transform
> Poly Extrude
> Reverse
> Polygon Bridge
> Subdivide
> Null
> 
> # 2 Work with Nodes
> 
> select object I/Double Click Inspect
> 
> Tab/Right Click - Switch
> 
> Organize Network Box Shift O
> Align Nodes A and mouse down
> Shape Palette Z
> Color Palette C
> Sticky Notes Shift P
> info panel comment
> Y 断开
> J 连接
> Alt add knots
> 
> # 3 Create Simulation
> 
> - place box above cup
> - scatter points onto surface
> - copy sphere to points
> - Use attributes such as colors and scales to add variety
> 
> Modify Copy to Points
> 
> Pack and Instance (treats as  primitives)
> 
> ### Nodes:
> Scatter
> Attribute Randomizer
> RBD Bullet Solver
> 	- Collision Ground type Plane
> 
> Modify - Extract
> # 4 Render
> （frame1）
> Desktop - Solaris
> Tab  - Scene Import
> Destination path - /geo
> Object - select - accept pattern
