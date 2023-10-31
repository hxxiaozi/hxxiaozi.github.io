
document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor1");
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
