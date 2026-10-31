---
layout: default
title: Notes
permalink: /notes/
---

<script>
    // 动态加载公共导航栏
    fetch('../nav.html')
      .then(res => res.text())
      .then(html => document.getElementById('navbar').innerHTML = html)
      .catch(err => console.error('Navigation load failed:', err));
  </script>

   <script>
        // 动态加载公共导航栏
        fetch('../header.html')
          .then(res => res.text())
          .then(html => document.getElementById('header').innerHTML = html)
          .catch(err => console.error('Header load failed:', err));
    </script>

<h2>Maya &amp; Scripting</h2>
<ul>
  <li><a href="/notes/maya-scripting/mel/">MEL</a></li>
  <li><a href="/notes/maya-scripting/maya-python-snippets-1/">Maya Python Snippets 1</a></li>
  <li><a href="/notes/maya-scripting/maya-python-snippets-2/">Maya Python Snippets 2</a></li>
  <li><a href="/notes/maya-scripting/python-maya-script-syntax/">Python 与 Maya 脚本语法</a></li>
</ul>

<h2>3D &amp; VFX</h2>
<ul>
  <li><a href="/notes/3d-vfx/houdini-foundations-h21/">Houdini Foundations H21</a></li>
  <li><a href="/notes/3d-vfx/retopology/">Retopology / 拓扑重建</a></li>
  <li><a href="/notes/3d-vfx/uv/">UV 与硬边备忘</a></li>
  <li><a href="/notes/3d-vfx/vfx/">VFX</a></li>
  <li><a href="/notes/3d-vfx/water-shader/">Water Shader / 水面着色器</a></li>
  <li><a href="/notes/3d-vfx/zbrush/">ZBrush 快捷键备忘</a></li>
</ul>
