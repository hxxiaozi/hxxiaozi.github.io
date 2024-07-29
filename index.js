// Move the custom cursor element based on mouse movements
document.addEventListener("mousemove", (e) => {
  const cursor = document.getElementById("custom-cursor0");
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// Set up video player functionality once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const videoPlayer = document.querySelector(".video-player");
  const videoList = document.querySelectorAll(".video-item");

  videoList.forEach((videoItem) => {
    videoItem.addEventListener("click", function (e) {
      e.preventDefault();
      const videoSource = this.querySelector("a").getAttribute("data-video");
      videoPlayer.src = videoSource;
      videoPlayer.load();
      videoPlayer.play();

      // Remove the 'selected' class from all video items
      videoList.forEach((item) => {
        item.classList.remove("selected");
      });

      // Add the 'selected' class to the clicked video item
      this.classList.add("selected");
    });
  });
});
