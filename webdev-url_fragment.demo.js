// webdev-url_fragment 노트의 체험 코너 동작 (build.js가 이 노트 페이지에만 연결한다)
const hashNow = document.getElementById("hash-now");
const hashLog = document.getElementById("hash-log");

function showHash() {
    hashNow.textContent = "location.hash = " + JSON.stringify(decodeURIComponent(location.hash));
}
showHash();

window.addEventListener("hashchange", () => {
    showHash();
    const time = new Date().toLocaleTimeString();
    hashLog.textContent = `[${time}] ${decodeURIComponent(location.hash) || "(빈 값)"}\n` + hashLog.textContent;
});

for (const btn of document.querySelectorAll("[data-hash]")) {
    btn.addEventListener("click", () => {
        location.hash = btn.dataset.hash;
    });
}

// 페이지가 새로 고쳐지지 않는다는 증거: 이 숫자는 다시 불러올 때만 0이 된다
const uptime = document.getElementById("uptime");
let seconds = 0;
setInterval(() => { uptime.textContent = ++seconds; }, 1000);
