document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor0");
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });