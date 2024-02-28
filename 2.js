document.addEventListener("DOMContentLoaded", function () {
    const videoPlayer = document.getElementById("video-player");
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

            // Add the 'selected' class to the clicked video item's parent div
            this.classList.add("selected");
        });
    });
});

document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor2");
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});
