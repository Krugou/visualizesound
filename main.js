const canvas = document.getElementById('visualization');
const ctx = canvas.getContext('2d');

let audioCtx;
let analyser;

function startVisualization() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume().then(() => {
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
                ctx.fillStyle = 'rgb(200, 200, 200)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgb(0, 0, 0)';
                ctx.beginPath();
                const sliceWidth = canvas.width * 1.0 / bufferLength;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = v * canvas.height / 2;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
            }
            draw();
        });
    });
}

document.addEventListener('click', startVisualization);