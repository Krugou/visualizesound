const canvas = document.getElementById('visualization');
const ctx = canvas.getContext('2d');
const body = document.querySelector('body');

let audioCtx;
let analyser;

function startVisualization() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;
            console.log("🚀 ~ file: main2.js:25 ~ draw ~ average", average)
            const r = Math.round(average * 2);
            console.log("🚀 ~ file: main2.js:26 ~ draw ~ r", r)
            const g = Math.round(250 - average * 2);
            console.log("🚀 ~ file: main2.js:28 ~ draw ~ g", g)
            const b = Math.round(250 + average * 2);
            console.log("🚀 ~ file: main2.js:30 ~ draw ~ b", b)
            body.style.background = `rgb(${r}, ${g}, ${b})`;
        }
        draw();
    });
}

document.addEventListener('click', startVisualization);
