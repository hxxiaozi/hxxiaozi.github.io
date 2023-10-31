document.addEventListener("DOMContentLoaded", function () {
    const videoPlayer = document.getElementById("video-player");
    const videoList = document.querySelectorAll(".video-item a");

    videoList.forEach((videoLink) => {
        videoLink.addEventListener("click", function (e) {
            e.preventDefault();
            const videoSource = this.getAttribute("data-video");
            videoPlayer.src = videoSource;
            videoPlayer.load();
            videoPlayer.play();
        });
    });
});
document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor2");
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });
