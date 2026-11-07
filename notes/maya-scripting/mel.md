---
layout: default
title: "MEL"
category: "Maya & Scripting"
permalink: /notes/maya-scripting/mel/
---

#Maya #MEL 

MEL（Maya Embedded Language）是 Maya 自带的脚本语言。Maya 的历史记录里可能会显示 MEL 命令；这些命令不能直接当作 Python 运行。想从 MEL 按钮或 Shelf 触发命令时，可以把可运行的 MEL 命令添加到 Shelf。

- **Control + Shift + Click**：将当前菜单命令添加到 Shelf。
- **Tooltip**：鼠标悬停时显示的提示文字，适合简短说明按钮用途。
- **Label**：Shelf 按钮显示的名称；尽量简洁，便于快速识别。


> [!note] 来源与范围 | Source and scope
> 参考课件：[Class Week 2.pptx](/notes/)。课件示例使用 Python `maya.cmds`，以下记录的是可迁移到 MEL 的脚本设计习惯；Python 代码不能直接粘贴到 MEL 执行。

### 可复用的脚本习惯 | Reusable scripting habits

- **先确认命令的返回值 | Know what commands return:** 区分节点名、列表和查询值。后续逻辑要按实际返回类型处理；没有结果时先检查空值，避免继续访问不存在的项目。
- **统一命名 | Use consistent names:** 例如用稳定的侧别、部位和节点类型规则（`L_arm_ctrl`）。一致命名能让脚本构造目标名、查找节点和识别左右侧更可靠。
- **先定义，再调用 | Define before calling:** 按依赖顺序准备脚本，再执行函数或过程。修改定义后重新执行定义；重复建场景前清理旧的测试节点，避免自动重命名产生意外结果。
- **把重复操作参数化 | Parameterize repeated work:** 将变化项（目标关节、名称、大小、颜色等）作为输入，把固定操作集中在可复用过程里，再对关节列表循环处理。
- **先做输入检查 | Validate inputs first:** 检查目标节点是否存在、选择是否为空、生成名称是否已被占用。发现问题时给出提示并跳过创建，避免在场景中留下半成品。
- **让过程返回后续要用的数据 | Return useful results:** 若后续还要 parent、约束或继续处理控制器，过程应提供创建节点的信息；不要假设每条 Maya 命令都返回同一种类型。

### Python 与 MEL 的边界 | Python and MEL are different

Week 2 中的 `def`、f-string、Python 列表、`None`、`return` 和 `maya.cmds` 写法属于 Python。MEL 有自己的变量声明、数组、过程定义、字符串操作与命令标志。将示例迁移到 MEL 时应重写语法，并确认对应 Maya 命令在 MEL 中的名称和参数形式；概念相同不代表代码可以逐行照搬。
