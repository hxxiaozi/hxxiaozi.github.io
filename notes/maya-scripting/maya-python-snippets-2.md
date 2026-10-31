---
layout: default
title: "Maya Python Snippets 2"
category: "Maya & Scripting"
permalink: /notes/maya-scripting/maya-python-snippets-2/
---

A continuation of the rigging exercises. This note focuses on collecting joints, building names systematically, turning repeated control setup into a function, and using that function across a chain. The examples assume a Maya Python session with `maya.cmds` imported.

#Maya #Python #Rigging
## 0.1  Build the arm

Creates a three-joint left arm, clears the current selection first, then orients the chain. If these names already exist, the shoulder is deleted before rebuilding.


```Python
import maya.cmds as cmds

if cmds.objExists("L_shoulder_jnt"):
    cmds.delete("L_shoulder_jnt")

cmds.select(clear=True)
cmds.joint(name="L_shoulder_jnt", position=(2, 15, 0))
cmds.joint(name="L_elbow_jnt",    position=(6, 15, -0.5))
cmds.joint(name="L_wrist_jnt",    position=(10, 15, 0))

cmds.joint("L_shoulder_jnt", edit=True, orientJoint="xyz",
           secondaryAxisOrient="yup", children=True, zeroScaleOrient=True)
cmds.select(clear=True)
```
## 0.2  Clean up

Deletes only nodes whose names appear in the list, then removes parent constraints found on the sample joints. Check that the names belong to temporary demo objects before running.


```Python
import maya.cmds as cmds

for node in ["L_shoulder_grp", "L_elbow_grp", "L_wrist_grp",
             "R_shoulder_grp", "R_elbow_grp", "R_wrist_grp",
             "test_grp", "R_shoulder_jnt"]:
    if cmds.objExists(node):
        cmds.delete(node)

for jnt in ["L_shoulder_jnt", "L_elbow_jnt", "L_wrist_jnt"]:
    if cmds.objExists(jnt):
        cons = cmds.listRelatives(jnt, type="parentConstraint") or []
        if cons:
            cmds.delete(cons)
```
## 0.3  make_ctrl, finished

The finished helper makes a circle control and parent group, aligns them to a target, sets the curve color, locks selected channels, and returns both node names.


```Python
def make_ctrl(name, target, radius=1.0, color=17):
    if not cmds.objExists(target):
        cmds.warning(f"Target '{target}' does not exist.")
        return None, None
    if cmds.objExists(f"{name}_ctrl"):
        cmds.warning(f"'{name}_ctrl' already exists.")
        return None, None

    ctrl = cmds.circle(name=f"{name}_ctrl", normal=(1, 0, 0),
                       radius=radius, constructionHistory=False)[0]
    grp = cmds.group(ctrl, name=f"{name}_grp")
    cmds.matchTransform(grp, target, pos=True, rot=True)

    shape = cmds.listRelatives(ctrl, shapes=True)[0]
    cmds.setAttr(f"{shape}.overrideEnabled", True)
    cmds.setAttr(f"{shape}.overrideColor", color)

    for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
        cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                     keyable=False, channelBox=False)

    return ctrl, grp
```

## 1.1  Setup blocks

Use this space to record scene setup needed before running later examples, such as creating the sample arm or importing `maya.cmds`.


(no code)
## 1.2  What commands give back

Maya commands often return node names in a list. Index `[0]` selects the first returned node; query commands may instead return values such as a three-number position.


```Python
circle = cmds.circle(name="test_ctrl")
print(circle)

grp = cmds.group(circle[0], name="test_grp")
print(grp)

pos = cmds.xform("L_wrist_jnt", query=True,
                 worldSpace=True, translation=True)
print(pos)
```
## 1.3  Selection lists

`cmds.ls(sl=True)` reads the current selection. Filtering with `type="joint"` keeps only joints; the result may be empty, so loops and joins should account for that.


```Python
joints = cmds.ls(sl=True, type="joint")
print(joints)
print(len(joints))

for jnt in joints:
    print(jnt)

print(", ".join(joints))
```
## 1.4  Children and or []

`listRelatives()` can return `None` when there are no matching children. Adding `or []` gives the rest of the code a predictable empty list to work with.


```Python
kids = cmds.listRelatives("L_shoulder_jnt",
                          allDescendents=True, type="joint")
print(kids)

kids = cmds.listRelatives("L_wrist_jnt", children=True)
print(kids)

kids = cmds.listRelatives("L_wrist_jnt", children=True) or []
print(kids)
```
## 1.5  The whole chain

The descendant query gathers joints below the root. Reversing Maya’s returned order and adding the root creates a parent-to-child list for this simple single chain.


```Python
top = "L_shoulder_jnt"

kids = cmds.listRelatives(top, allDescendents=True,
                          type="joint") or []
kids.reverse()
chain = [top] + kids

print(chain)
```
## 1.6  Counting loops

`enumerate()` provides each item and its zero-based index. `range(1, 4)` generates 1, 2, and 3; `:02d` pads those numbers for tidy names.

```Python
 arm = ["L_shoulder_jnt", "L_elbow_jnt", "L_wrist_jnt"]

for i, jnt in enumerate(arm):
    print(i, jnt)

for i in range(1, 4):
    print(f"L_arm_twist{i:02d}_jnt")
```


## 2.1  Build a name: f-strings

F-strings insert variable values into a string. Use them to build node names and attribute paths without manually joining many pieces.

```Python
side = "L"
part = "arm"
kind = "ctrl"

name = f"{side}_{part}_{kind}"
print(name)

plug = f"{name}.rotateX"
print(plug)

for s in ["L", "R"]:
    print(f"{s}_{part}_{kind}")
```
## 2.2  Swap the ending: replace

`replace()` is convenient for changing a known suffix such as `_jnt`. `endswith()` can check that the expected suffix is present before changing a name.

```Python
jnt = "L_wrist_jnt"

print(jnt.replace("_jnt", "_ctrl"))
print(jnt.replace("_jnt", "_grp"))

base = jnt.replace("_jnt", "")
print(base)
print(jnt.endswith("_jnt"))
```
## 2.3  Take a name apart: split and join

Splitting on underscores yields name components. After changing one component, joining recreates the name with the same separator.

```Python
name = "L_arm_ik_ctrl"

parts = name.split("_")
print(parts)
print(parts[0], parts[-1])

parts[-1] = "grp"
print("_".join(parts))
```

## 2.4  Mirror a name: startswith

This changes only the side prefix. Names starting with `C_` or another prefix are left unchanged.

```Python
names = ["L_arm_ctrl", "R_leg_ctrl", "C_spine_ctrl"]

for name in names:
    if name.startswith("L_"):
        new = "R_" + name[2:]
    elif name.startswith("R_"):
        new = "L_" + name[2:]
    else:
        new = name
    print(name, "->", new)

```
## 2.5  Mirror joints: mirrorJoint

`mirrorJoint()` duplicates a joint hierarchy across the YZ plane. `mirrorBehavior=True` aims to preserve mirrored joint behavior; `searchReplace` changes the side prefix in generated names.

```Python
new_joints = cmds.mirrorJoint("L_shoulder_jnt", mirrorYZ=True,
                              mirrorBehavior=True,
                              searchReplace=("L_", "R_"))
print(new_joints)

```

## 3.1  Define first, call second

Defining a function stores the recipe; calling it runs the recipe with the supplied arguments. `return` gives the caller the constructed name.


```Python
def side_name(side, part):
    return f"{side}_{part}_ctrl"

print(side_name("L", "arm"))

```

## 3.2  Four habits

A useful checklist here: give values clear names, check assumptions before scene edits, keep repeated work in functions, and test a small case before applying a loop.

(no code)
## 4.1  Step 1: commands

The first version writes each Maya operation directly. It is useful for learning the sequence before extracting reusable variables or a function.


```Python
ctrl = cmds.circle(name="L_wrist_ctrl", normal=(1, 0, 0),
                   radius=2.0, constructionHistory=False)[0]
grp = cmds.group(ctrl, name="L_wrist_grp")
cmds.matchTransform(grp, "L_wrist_jnt", pos=True, rot=True)

shape = cmds.listRelatives(ctrl, shapes=True)[0]
cmds.setAttr(f"{shape}.overrideEnabled", True)
cmds.setAttr(f"{shape}.overrideColor", 6)

for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
    cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                 keyable=False, channelBox=False)
```


## 4.2  Step 2: variables

Variables collect changing values such as the name, target, radius, and color. The creation steps stay the same while the inputs become easier to edit.

```Python
name = "L_wrist"
target = "L_wrist_jnt"
radius = 2.0
color = 6

ctrl = cmds.circle(name=f"{name}_ctrl", normal=(1, 0, 0),
                   radius=radius, constructionHistory=False)[0]
grp = cmds.group(ctrl, name=f"{name}_grp")
cmds.matchTransform(grp, target, pos=True, rot=True)

shape = cmds.listRelatives(ctrl, shapes=True)[0]
cmds.setAttr(f"{shape}.overrideEnabled", True)
cmds.setAttr(f"{shape}.overrideColor", color)

for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
    cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                 keyable=False, channelBox=False)
```

## 4.3 A  Step 3: def

Wrapping the steps in `def` creates a function, but these values are still fixed inside it. The next step makes them inputs.


```Python
def make_ctrl():
    name = "L_wrist"
    target = "L_wrist_jnt"
    radius = 2.0
    color = 6

    ctrl = cmds.circle(name=f"{name}_ctrl", normal=(1, 0, 0),
                       radius=radius, constructionHistory=False)[0]
    grp = cmds.group(ctrl, name=f"{name}_grp")
    cmds.matchTransform(grp, target, pos=True, rot=True)

    shape = cmds.listRelatives(ctrl, shapes=True)[0]
    cmds.setAttr(f"{shape}.overrideEnabled", True)
    cmds.setAttr(f"{shape}.overrideColor", color)

    for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
        cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                     keyable=False, channelBox=False)
```


## 4.3 B  Step 3: call it

Calling the function runs its body. In this version the function only creates the control when called; defining it alone does not run it.

```Python
make_ctrl()
```
## 4.4 A  Step 4: parameters

Parameters let each call provide its own values, so the same helper can create controls for different joints.


```Python
def make_ctrl(name, target, radius, color):
    ctrl = cmds.circle(name=f"{name}_ctrl", normal=(1, 0, 0),
                       radius=radius, constructionHistory=False)[0]
    grp = cmds.group(ctrl, name=f"{name}_grp")
    cmds.matchTransform(grp, target, pos=True, rot=True)

    shape = cmds.listRelatives(ctrl, shapes=True)[0]
    cmds.setAttr(f"{shape}.overrideEnabled", True)
    cmds.setAttr(f"{shape}.overrideColor", color)

    for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
        cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                     keyable=False, channelBox=False)
```
## 4.4 B  Step 4: call it

These calls pass values positionally in the same order as the function parameters: name, target, radius, then color.


```Python
make_ctrl("L_wrist", "L_wrist_jnt", 2.0, 6)
make_ctrl("L_elbow", "L_elbow_jnt", 2.0, 6)
```


## 4.5 A  Step 5: defaults

Default values make common options optional. A caller can omit radius or color and still get a predictable control.

```Python
def make_ctrl(name, target, radius=1.0, color=17):
    ctrl = cmds.circle(name=f"{name}_ctrl", normal=(1, 0, 0),
                       radius=radius, constructionHistory=False)[0]
    grp = cmds.group(ctrl, name=f"{name}_grp")
    cmds.matchTransform(grp, target, pos=True, rot=True)

    shape = cmds.listRelatives(ctrl, shapes=True)[0]
    cmds.setAttr(f"{shape}.overrideEnabled", True)
    cmds.setAttr(f"{shape}.overrideColor", color)

    for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
        cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                     keyable=False, channelBox=False)

```

## 4.5 B  Step 5: call it

Keyword arguments such as `color=6` make it clear which option is being changed while other defaults stay in place.

```Python
make_ctrl("L_wrist", "L_wrist_jnt")
make_ctrl("L_elbow", "L_elbow_jnt", color=6)
make_ctrl("L_shoulder", "L_shoulder_jnt", radius=3.0)
```
## 4.6 A  Step 6: return

Returning the control and group makes them available for later parenting, constraints, or cleanup.

```Python
def make_ctrl(name, target, radius=1.0, color=17):
    ctrl = cmds.circle(name=f"{name}_ctrl", normal=(1, 0, 0),
                       radius=radius, constructionHistory=False)[0]
    grp = cmds.group(ctrl, name=f"{name}_grp")
    cmds.matchTransform(grp, target, pos=True, rot=True)

    shape = cmds.listRelatives(ctrl, shapes=True)[0]
    cmds.setAttr(f"{shape}.overrideEnabled", True)
    cmds.setAttr(f"{shape}.overrideColor", color)

    for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
        cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                     keyable=False, channelBox=False)

    return ctrl, grp
```


## 4.6 B  Step 6: call it

Tuple unpacking stores the two returned node names separately. The parent constraint then makes the control drive the wrist joint.

```Python
ctrl, grp = make_ctrl("L_wrist", "L_wrist_jnt")
print(ctrl, grp)
cmds.parentConstraint(ctrl, "L_wrist_jnt")
```

## 4.7  Step 7: loop

The loop applies one reusable operation to each selected joint. The selection must contain joints with names that follow the expected `_jnt` suffix.

```Python
def make_ctrl(name, target, radius=1.0, color=17):
    ctrl = cmds.circle(name=f"{name}_ctrl", normal=(1, 0, 0),
                       radius=radius, constructionHistory=False)[0]
    grp = cmds.group(ctrl, name=f"{name}_grp")
    cmds.matchTransform(grp, target, pos=True, rot=True)

    shape = cmds.listRelatives(ctrl, shapes=True)[0]
    cmds.setAttr(f"{shape}.overrideEnabled", True)
    cmds.setAttr(f"{shape}.overrideColor", color)

    for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
        cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                     keyable=False, channelBox=False)

    return ctrl, grp


joints = cmds.ls(sl=True, type="joint")

for jnt in joints:
    name = jnt.replace("_jnt", "")
    ctrl, grp = make_ctrl(name, jnt, radius=2.0, color=6)
    print(f"Made {ctrl} on {jnt}")
```

## 4.8 A and B  Step 8: checks

The helper now checks for a missing target and an existing control name before creating scene nodes, reducing avoidable errors and duplicates.


```Python
def make_ctrl(name, target, radius=1.0, color=17):
    if not cmds.objExists(target):
        cmds.warning(f"Target '{target}' does not exist.")
        return None, None
    if cmds.objExists(f"{name}_ctrl"):
        cmds.warning(f"'{name}_ctrl' already exists.")
        return None, None

    ctrl = cmds.circle(name=f"{name}_ctrl", normal=(1, 0, 0),
                       radius=radius, constructionHistory=False)[0]
    grp = cmds.group(ctrl, name=f"{name}_grp")
    cmds.matchTransform(grp, target, pos=True, rot=True)

    shape = cmds.listRelatives(ctrl, shapes=True)[0]
    cmds.setAttr(f"{shape}.overrideEnabled", True)
    cmds.setAttr(f"{shape}.overrideColor", color)

    for attr in ["scaleX", "scaleY", "scaleZ", "visibility"]:
        cmds.setAttr(f"{ctrl}.{attr}", lock=True,
                     keyable=False, channelBox=False)

    return ctrl, grp
```

## 4.8 C  Step 8: call it

This caller warns if nothing is selected and skips any joint for which the helper returned `(None, None)`.

```Python
joints = cmds.ls(sl=True, type="joint")

if not joints:
    cmds.warning("Select one or more joints first.")

for jnt in joints:
    name = jnt.replace("_jnt", "")
    ctrl, grp = make_ctrl(name, jnt, radius=2.0, color=6)
    if ctrl is None:
        continue
    print(f"Made {ctrl} on {jnt}")
```

## 4.9  The 8 steps

The progression is: write commands, name values, define a function, add parameters, choose defaults, return results, loop over items, then validate inputs.

(no code)


## 5.1  Lab

Practice the name-mirroring logic separately from scene creation, then use Maya’s joint mirroring command to build the other side of the hierarchy.

### 1  mirror_name
```Python
names = ["L_arm_ctrl", "R_leg_ctrl", "C_spine_ctrl"]

for name in names:
    if name.startswith("L_"):
        new = "R_" + name[2:]
    elif name.startswith("R_"):
        new = "L_" + name[2:]
    else:
        new = name
    print(name, "->", new)
```

### 3  Both arms
```Python
new_joints = cmds.mirrorJoint("L_shoulder_jnt", mirrorYZ=True,
                              mirrorBehavior=True,
                              searchReplace=("L_", "R_"))
```

## 5.2  Check your understanding

Try explaining what each helper receives, what it creates, and what it returns. Then change one input and predict the output before running it.

(no code)

## 6.1  Find by pattern

`cmds.ls()` accepts wildcard patterns: `*` matches any sequence of characters. Adding `type="joint"` narrows results to joint nodes.


```Python
print(cmds.ls("L_*_jnt"))
print(cmds.ls("*_elbow_*"))

for jnt in cmds.ls("L_*_jnt", type="joint"):
    print(jnt.replace("_jnt", "_ctrl"))
```
## 6.2  Controls for a whole chain

This helper gathers the root and its descendants, creates one control per joint, and returns the created control names. It relies on the earlier `make_ctrl` definition.

```Python
def make_chain_ctrls(top, radius=2.0, color=6):
    kids = cmds.listRelatives(top, allDescendents=True,
                              type="joint") or []
    kids.reverse()
    chain = [top] + kids

    ctrls = []
    for jnt in chain:
        ctrl, grp = make_ctrl(jnt.replace("_jnt", ""), jnt,
                              radius, color)
        if ctrl:
            ctrls.append(ctrl)
    return ctrls


ctrls = make_chain_ctrls("L_shoulder_jnt")
print(ctrls)
```

## 6.3  An FK arm

In forward kinematics, each control affects its own joint and child controls inherit motion from their parent controls. The group hierarchy creates that cascading motion; constraints connect controls to joints.


```Python
chain = ["L_shoulder_jnt", "L_elbow_jnt", "L_wrist_jnt"]
ctrls = []
grps = []

for jnt in chain:
    name = jnt.replace("_jnt", "")
    ctrl, grp = make_ctrl(name, jnt, radius=2.0)
    ctrls.append(ctrl)
    grps.append(grp)

for i in range(1, len(chain)):
    cmds.parent(grps[i], ctrls[i - 1])

for i in range(len(chain)):
    cmds.parentConstraint(ctrls[i], chain[i])
```
