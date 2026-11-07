---
layout: default
title: "Maya Rigging UIs — 双语笔记"
category: "Maya & Scripting"
permalink: /notes/maya-scripting/rigging-uis/
---

> [!summary] 核心思路 | Core idea
> 先把每个 Rig 步骤写成独立、可复用的函数，再写轻量 callback 去读取窗口控件，最后搭建 UI。UI 只负责收集参数和触发步骤。
> Write each rigging step as a standalone function, then add small callbacks that read UI controls, and build the window last. The UI collects parameters and triggers steps.

## 1. 推荐结构 | Recommended structure

1. **Rig functions / Rig 函数**：例如 `make_leg_joints(side)`, `make_leg_ik(side, size)`, `make_pole_vector(side)`。函数只处理场景，不直接创建或读取 UI。
2. **Callbacks / 回调**：使用 `def on_ik(*args): ...`。回调读取当前 UI 值，并调用对应的 rig 函数。
3. **Window / 窗口**：创建控件，将按钮绑定到 callback，最后调用 `cmds.showWindow(window)`。

这种分层让 Rig 函数可以从脚本编辑器、其他工具或 UI 中复用。 | This separation lets rig functions be reused from the Script Editor, other tools, or the UI.

## 2. 腿部关节链 | Leg joint chain

示例关节位置（单位取决于场景）：

| Joint | Position / 位置 |
|---|---|
| Hip | `(x, 10, 0)` |
| Knee | `(x, 5.5, 0.5)` |
| Ankle | `(x, 1.5, 0)` |
| Ball | `(x, 0, 2)` |
| Toe | `(x, 0, 3.5)` |

- 左右侧可以用 `x = 3 if side == "L" else -3`，并将 `axis` 分别设为 `"xup"` / `"xdown"`。
- `cmds.select(clear=True)` 防止新关节意外接到已有选中对象上；连续创建关节时 Maya 会把新关节 parent 到前一个关节。
- 用 `cmds.joint(..., edit=True, orientJoint="xzy", secondaryAxisOrient=axis, children=True, zeroScaleOrient=True)` 定向骨骼：X 沿骨骼指向子关节，Z 沿世界左右方向朝外。
- 在末端临时创建一个 helper joint，让 Toe 有明确的朝向目标；定向完成后删除 helper。
- Knee 的轻微前移（示例 Z=0.5）为 IK 提供初始弯曲方向。

**Orientation / 关节朝向：** `orientJoint="xzy"` 让 X 先沿骨骼，Z 为次轴。左右腿使用 `xup` / `xdown`，使次轴在两侧都朝外。课件指出用 Y 作为次轴可能让左右腿在膝部出现相反翻转。

## 3. IK、脚踝控制与 Pole Vector

### Ankle IK control / 脚踝 IK 控制器

- 建立空组 `cmds.group(empty=True)`，并用 `matchTransform(..., position=True)` 将组移动到 Ankle。
- 在组内创建圆环控制器：`cmds.circle(normal=(0, 1, 0), radius=size, constructionHistory=False)[0]`。`[0]` 取 transform。
- 使用 `cmds.parent(ctl, grp, relative=True)` 保留控制器局部零值。
- 创建 `ikHandle(..., solver="ikRPsolver")`，将 handle parent 到控制器；再用 `orientConstraint(ctl, ankle, maintainOffset=True)` 驱动脚踝旋转，避免创建约束时跳动。

### Pole vector / 膝盖方向控制

- 在 Knee 位置建立组，将组相对移动 `(0, 0, 5)`；在组内创建朝前的圆环控制器。
- 将组 parent 到 Ankle 控制器，让膝盖目标跟随脚移动。
- `cmds.poleVectorConstraint(ctl, ikh)` 将 IK 膝盖弯曲方向交给该控制器。

### Foot FK / 脚部 FK

Ball 和 Toe 各自建立匹配关节变换的组与控制器。把 Toe 组 parent 到 Ball 控制器，形成控制链；每个控制器通过 `orientConstraint` 驱动对应关节。课件建议在 FK 控制器已对齐时不启用 `maintainOffset`。

## 4. Maya UI 与回调 | Maya UI and callbacks

### 最小窗口 | Minimal window

```python
def on_ik(*args):
    make_leg_ik("L")

window = cmds.window(title="Leg Rig")
cmds.columnLayout(adjustableColumn=True)
cmds.button(label="IK and Ankle", command=on_ik)
cmds.showWindow(window)
```

- `command=on_ik` 传入函数本身，不要写 `command=on_ik()`；后者会在建 UI 时立刻执行。
- Maya 点击按钮时会传入一个位置参数（例如按钮状态）。`*args` 将参数收集成 tuple，避免 callback 因参数数量不匹配而报 `TypeError`。
- 不要直接写 `command=make_leg_ik`：Maya 传入的值可能被错误地当成 `side`。

### 从控件读取参数 | Query controls at click time

```python
choice = cmds.radioButtonGrp(side_radio, query=True, select=True)
side = "L" if choice == 1 else "R"
size = cmds.floatSliderGrp(size_slider, query=True, value=True)
```

在 callback 执行时读取控件，用户改变选项后仍会使用最新值。Radio group 的 `select` 返回从 1 开始的序号；slider 用 `value` 读取数字。`query=True` 读取，`edit=True` 修改。

**常用控件 | Common controls**

| Control | 用途 | 读取值 |
|---|---|---|
| `button` | 触发一步操作 | 不适用；callback 接收 `*args` |
| `radioButtonGrp` | L/R、FK/Reverse 等互斥选择 | `select`（1、2…）|
| `floatSliderGrp` | 数值，如控制器大小 | `value` |
| `optionMenu` + `menuItem` | 多项列表，如颜色 | `select`（1、2…）|
| `textFieldButtonGrp` | 输入名称；可从场景选择加载 | `text` |

每个操作使用一个清楚的 callback 和按钮。创建顺序有依赖：Pole Vector 需要先有 Ankle control 和 IK handle。

## 5. Reverse Foot / 反向脚

### Pivot 层级 | Pivot hierarchy

```text
Ankle_Ctl
└── Heel_Pivot
    └── ToeTip_Pivot
        └── Ball_Pivot
```

- 将 Leg IK handle 与 Ball IK handle parent 到 `Ball_Pivot`。
- 创建从 Ankle 到 Ball、Ball 到 Toe 的 `ikSCsolver` handles；Toe IK handle parent 到 `ToeTip_Pivot`。
- Ball pivot 转动时可抬起脚跟，同时让脚趾保持接地；Toe tip pivot 独立控制脚尖。
- 转换为反向脚时，先删除 Ankle 关节上的约束（`delete(..., constraints=True)`），因为此时由 Ball IK 驱动脚踝。

### Roll attributes / 脚部滚动属性

在 Ankle 控制器上添加可 key 的 `heelRoll`、`ballRoll`、`toeRoll` double 属性，并用 `connectAttr` 连接到对应 pivot 的 `rotateX`。Heel roll 方向需反转，可通过 `multiplyDivide` 节点将一侧乘以 `-1`。这使三个属性可以直接驱动脚跟、前脚掌和脚尖滚动。

## 6. FK 控制器工具 | FK control utilities

- **批量改色 / Color:** `cmds.ls(f"{side}_*_Ctl")` 用通配符找控制器；先设 `overrideEnabled=1` 再设 `overrideColor`。课件列出的索引：蓝 6、红 13、黄 17、绿 14。
- **调整大小 / Resize:** 查询控制器 world-space rotate pivot，再对 `ctl.cv[*]` 调用相对缩放。缩放曲线形状而非 transform，可保持通道值为 1。
- **颜色下拉菜单 / Color menu:** `optionMenu` 后创建多个 `menuItem`；`select` 为 1-based，映射 Python 列表时用 `colors[choice - 1]`。
- **从选择加载名称 / Load selected:** `cmds.ls(selection=True)` 读取场景选择，再通过 `textFieldButtonGrp(..., edit=True, text=sel[0])` 写入字段。读取时用 `query=True, text=True`，再将字段值传给通用构建函数，避免硬编码关节名。

## 7. 重要命令速查 | Command reference

| 命令 | 作用 |
|---|---|
| `cmds.group(empty=True)` | 创建空 transform 组 |
| `cmds.matchTransform(a, b)` | 匹配变换；`position=True` 只匹配位置 |
| `cmds.circle(...)[0]` | 创建 NURBS 圆环，取 transform |
| `cmds.parent(child, parent, relative=True)` | 建立层级并保留局部值 |
| `cmds.ikHandle(..., solver=...)` | 创建 IK 解算器 |
| `cmds.orientConstraint(driver, driven)` | 用 driver 旋转 driven |
| `cmds.poleVectorConstraint(ctl, ikh)` | 让 IK 膝盖朝向控制器 |
| `cmds.addAttr(..., keyable=True)` | 添加可在 Channel Box 关键帧化的属性 |
| `cmds.connectAttr(source, target)` | 建立属性间的实时连接 |
| UI `query=True` / `edit=True` | 读取 / 修改 UI 控件 |

## 8. 实用检查与扩展 | Practical checks and next steps

- 按依赖顺序建 Rig：关节链 → IK/脚踝 → Pole Vector → FK 或 Reverse Foot。
- 检查左右侧关节朝向、控制器零值、Pole Vector 初始位置，以及约束创建时是否跳动。
- 课件下一步建议增加安全检查：缺少关节、重复运行、空选择；再提供单一的 **Build Leg** 按钮，并把 Reverse Foot 集成进完整窗口。
- 当前示例主要用于教学，部分函数默认假设节点已存在、选择列表非空、且只运行一次。实际工具应验证输入和场景状态，并对重建策略作明确处理。

## Source / 来源

整理自课件 **UIs for Rigging**（28 slides）
