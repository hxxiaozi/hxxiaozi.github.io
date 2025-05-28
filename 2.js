document.addEventListener("DOMContentLoaded", function () {
    const videoList = document.querySelectorAll(".video-item");

    videoList.forEach((videoItem) => {
        videoItem.addEventListener("click", function (e) {
            e.preventDefault();
            const videoSource = this.querySelector("a").getAttribute("data-video");
            const sanitizedSource = videoSource.replace(/ /g, "%20");
            
            // 找到与当前点击项同容器内的视频播放器
            const videoContainer = this.closest(".video-container");
            const videoPlayer = videoContainer.querySelector(".video-player");
            
            videoPlayer.src = sanitizedSource;
            videoPlayer.load();
            videoPlayer.play();

            // 移除所有视频项的'selected'类
            videoList.forEach((item) => {
                item.classList.remove("selected");
            });

            // 为点击的视频项添加'selected'类
            this.classList.add("selected");
        });
    });
});

document.addEventListener("mousemove", (e) => {
    const cursor = document.getElementById("custom-cursor2");
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});