let isRunning = false;
let isWorkPeriod = true;
let timer;
let timeLeft = 0;

const timeDisplay = document.getElementById('time');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const statusText = document.getElementById('status-text');
const alarmSound = document.getElementById('alarm-sound');
const currentTimeDisplay = document.getElementById('current-time');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateStatus() {
    if (!isRunning) {
        statusText.textContent = "停止中";
        statusText.style.color = "#808080"; // 灰色
    } else if (isWorkPeriod) {
        statusText.textContent = "作業中";
        statusText.style.color = "#007BFF"; // 青色
    } else {
        statusText.textContent = "休憩中";
        statusText.style.color = "#FF851B"; // オレンジ色
    }
}

function updateCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeDisplay.textContent = `現在の時刻: ${hours}:${minutes}:${seconds}`;
}

setInterval(updateCurrentTime, 1000); // 1秒ごとに現在時刻を更新

function startTimer() {
    if (!isRunning) {
        if (timeLeft === 0) {
            timeLeft = isWorkPeriod ? workTimeInput.value * 60 : breakTimeInput.value * 60;
        }
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                notifyUser();
                isWorkPeriod = !isWorkPeriod;
                timeLeft = 0;
                startTimer(); // 自動的に次のサイクルを開始
            }
        }, 1000);
        isRunning = true;
        startStopBtn.textContent = "Stop";
        resetBtn.disabled = true;
        resetBtn.style.backgroundColor = "#ccc"; // リセットボタンを灰色に変更
    } else {
        clearInterval(timer);
        isRunning = false;
        startStopBtn.textContent = "Start";
        resetBtn.disabled = false;
        resetBtn.style.backgroundColor = "#FF4136"; // リセットボタンの色を元に戻す
    }
    updateStatus(); // 状態を更新
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkPeriod = true;
    timeLeft = 0;
    updateDisplay();
    statusText.textContent = "待機中";
    statusText.style.color = "#333"; // 黒に戻す
    startStopBtn.textContent = "Start";
    resetBtn.disabled = true;
    resetBtn.style.backgroundColor = "#ccc"; // リセットボタンを灰色に変更
}

function notifyUser() {
    if (Notification.permission === "granted") {
        const notification = new Notification(isWorkPeriod ? "作業時間終了" : "休憩時間終了", {
            body: isWorkPeriod ? "休憩時間を始めましょう" : "作業時間を始めましょう",
            icon: "/icon-192x192.png"
        });
        notification.onclick = () => {
            window.focus();
        };
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                notifyUser();
            }
        });
    }
}

startStopBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay(); // 初期表示を設定
updateCurrentTime(); // ページロード時に現在時刻を表示
resetBtn.disabled = true;
resetBtn.style.backgroundColor = "#ccc"; // 初期状態でリセットボタンを無効にする
