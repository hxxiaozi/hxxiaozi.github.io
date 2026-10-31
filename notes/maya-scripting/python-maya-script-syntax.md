---
layout: default
title: "Python 与 Maya 脚本语法"
category: "Maya & Scripting"
permalink: /notes/maya-scripting/python-maya-script-syntax/
---

这份笔记介绍如何在 Maya 的 Script Editor 中运行 Python，并回顾常用 Python 数据类型。代码块中的 `>>>` 表示交互式命令提示符；实际输入时不要把提示符一起复制进去。

#Maya #Python #Rigging

https://www.bilibili.com/video/BV1d4411a7aH?spm_id_from=333.788.videopod.episodes&vd_source=b03515e445c6f1512e591a5b4d607928&p=3

## Maya 脚本编辑器 

Script Editor 是在 Maya 内运行 MEL 或 Python 命令的地方。注意先选择 Python 标签，再运行 Python 代码。

### 打开方式

可以从菜单、右下角按钮或视图面板打开 Script Editor。不同 Maya 布局的位置可能略有不同。

- Window - General Editors - Script Editor
- 右下角 icon
- Panel - Panel - Script Editor （viewport）
### 页面

上方区域显示命令历史和结果，下方区域用于输入脚本。单箭头通常执行并清空输入区，双箭头执行并保留输入，适合反复修改。


顶部——maya运行的命令输出 （MEL）
底部——编写脚本处

Add Tab
选择语言 (Python)

单箭头 run（之后清除脚本代码）
双箭头 run（保留脚本代码）
保存 save 保存脚本
Load Script 加载已保存脚本
Source Script 打开并运行脚本
Clear History 清除顶部
Clear Input 清除底部

### 操作 Commands

Echo 命令帮助观察 Maya UI 操作对应的命令，可用来学习命令参数或排查操作步骤。


History - Echo All Demands  展示所有MAYA会运行的指令 （Useful for debugging）

```Python
from maya import cmds # 让Python能访问commandAPI
cmds.polyCube(w=1, h=1, d=15) # 
cmds.select(clear=True)
```

Input Editor 右键 Quickhelp / Command Doc 

##  Python基础

Python 变量可以保存文本、数字、真假值和集合。理解这些类型有助于读懂 Maya 命令的输入和返回结果。

### 变量 Variables

变量名指向一个值；`type()` 可以查看值的类型。字符串方法如 `lower()` 和 `upper()` 会返回转换后的新字符串。


string 字符串

```Python
>>> name = "xx"

>>> type(name)
<class 'str'>

>>> name = name + "H"

>>> name
'xx H'

>>> name.lower()
'xx h'

>>> name.upper()
'XX H'
```

integers 整数

```Python
>>> age = 22

>>> type(age)
<class 'int'>

>>> age = age + 1

>>> age
23 
```

str + int
```Python
>>> name + str(age)
'xx H23'
```
float
```Python
>>> age = 22.5

>>> type(age)
<class 'float'>
```
boolean
```Python
>>> lying = False

>>> type(lying)
<class 'bool'>

>>> lying = not lying

>>> lying
True
```
none type

```Python
>>> nothing = None

>>> type(nothing)
<class 'NoneType'>

>>> lying = not lying

>>> lying
True
```

### 集合 Collections

集合用于把多个值放在一起。列表可以修改，元组创建后不能改，字典则通过键来查找和更新值。


list 

```Python
>>> list
<class 'list'>

>>> myList = [name,age,lying,nothing]

>>> myList
[xx H,22.5,True,None]
```

Update List

```Python
>>> name = xiaoxuan

>>> myList
[xx H, 22.5, True, None]

>>> myList[0] = name

>>> myList
[xiaoxuan, 22.5, True, None]
```
Tuple
cannot be changed once created
```Python
>>> myTuple = (name, 22, False)
```

Dictionary

```Python
>>> myDict = {"name":name, "age":age}

>>> myDict
{'age': 22.5, 'name': 'xiaoxuan'}

>>> myDict['age']
22.5

>>> myDict['age'] = 23

>>> myDict
{'age': 23,'name': 'xiaoxuan'}
```
