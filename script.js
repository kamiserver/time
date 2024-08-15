// タイマー関連の変数と要素の取得
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

// タイマーの更新関数
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// タイマーの開始と停止
function startStopTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startStopBtn.textContent = 'Start';
        statusText.textContent = '停止中';
        statusText.style.color = 'gray';
    } else {
        if (timeLeft === 0) {
            timeLeft = isWorkPeriod ? workTimeInput.value * 60 : breakTimeInput.value * 60;
        }
        timer = setInterval(() => {
            timeLeft--;
            updateTimer();

            if (timeLeft <= 0) {
                clearInterval(timer);
                alarmSound.play();
                notifyUser();
                if (isWorkPeriod) {
                    isWorkPeriod = false;
                    timeLeft = breakTimeInput.value * 60;
                    statusText.textContent = '休憩中';
                    statusText.style.color = 'orange';
                } else {
                    isWorkPeriod = true;
                    timeLeft = workTimeInput.value * 60;
                    statusText.textContent = '作業中';
                    statusText.style.color = 'blue';
                }
                startStopTimer();
            }
        }, 1000);
        isRunning = true;
        startStopBtn.textContent = 'Stop';
        statusText.textContent = isWorkPeriod ? '作業中' : '休憩中';
        statusText.style.color = isWorkPeriod ? 'blue' : 'orange';
    }
}

// タイマーのリセット
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkPeriod = true;
    timeLeft = 0;
    updateTimer();
    startStopBtn.textContent = 'Start';
    statusText.textContent = '待機中';
    statusText.style.color = 'black';
}

// 通知機能
function notifyUser() {
    if (Notification.permission === 'granted') {
        new Notification(isWorkPeriod ? '休憩時間です！' : '作業時間です！');
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(isWorkPeriod ? '休憩時間です！' : '作業時間です！');
            }
        });
    }
}

// サービスワーカーの登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}

// イベントリスナーの設定
startStopBtn.addEventListener('click', startStopTimer);
resetBtn.addEventListener('click', resetTimer);

// 初期化
resetTimer();
