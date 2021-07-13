export default class FrequencyBar {
    ac: any;
    canvas: any;
    ctx: any;
    width: number;
    height: number;
    input: any;
    analyzer: any;
    freqData: Uint8Array;
    rAF: any;
    strokeStyle: any;
    sensitivity: number;

    constructor(ac: any, canvas: any) {
        if (!ac) {
            throw new Error('No AudioContext provided');
        }
        if (!canvas) {
            throw new Error('No Canvas provided');
        }
        this.ac = ac;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.input = ac.createGain();
        this.analyzer = ac.createAnalyser();
        this.analyzer.fftSize = 2048;
        this.input.connect(this.analyzer);
        this.freqData = new Uint8Array(this.analyzer.frequencyBinCount);
        this.rAF = null;
        this.strokeStyle = '#6cf';
        this.sensitivity = 42;
        console.log(this.freqData.length);
    }



    start() {
        this.rAF = requestAnimationFrame(this.draw.bind(this));
        return this;
    }

    stop() {
        cancelAnimationFrame(this.rAF);
        this.rAF = null;
        return this;
    }

    draw() {
        let len: number = this.freqData.length,
            scale: number = this.height / 256 / 2,
            i: number = 50,
            j: number = i,
            magnitude: number;

        // grid
        this.ctx.fillStyle = '#002233';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.lineWidth = 0;
        this.ctx.strokeStyle = 'rgba(60,180,220,0.05)';
        this.ctx.beginPath();
        for (; i < this.width; i += 50) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.height);
            for (j = 0; j < this.height; j += 50) {
                this.ctx.moveTo(0, j);
                this.ctx.lineTo(this.width, j);
            }
        }
        this.ctx.stroke();

        // x axis
        this.ctx.strokeStyle = 'rgba(60,180,220,0.22)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height / 2);
        this.ctx.lineTo(this.width, this.height / 2);
        this.ctx.stroke();

        // bar
        this.analyzer.getByteFrequencyData(this.freqData);
        let barWidth = (this.width / this.freqData.length) * 2.5;
        let barHeight;
        let x = 0;

        // let max = Math.max.apply(this.freqData);
        let max = this.freqData.reduce((a, b) => { return Math.max(a, b) });

        let y = 0, r = 0;
        for(i = 0; i < this.freqData.length; i++) {
            barHeight = this.freqData[i];
            // this.ctx.fillStyle = 'rgb(' + (barHeight+100) + ',' + (barHeight+150) + ',' + (barHeight+100) + ')';
            // this.ctx.fillRect(x, this.height - barHeight/2, barWidth, barHeight);
            
            r = barHeight / max;
            y = r * this.height;
            
            if (r > 0.8)
                this.ctx.fillStyle = 'rgb(' + (barHeight+150) + ',' + (50) + ',' + (50) + ')';

            if (r > 0.5 && r <= 0.8)
                this.ctx.fillStyle = 'rgb(' + (50) + ',' + (barHeight + 150) + ',' + (50) + ')';

            if (r <= 0.5)
                this.ctx.fillStyle = 'rgb(' + (barHeight+100) + ',' + (barHeight+100) + ',' + (barHeight+100) + ')';

            this.ctx.fillRect(x, this.height - y-1, barWidth, y);

            x += barWidth + 1;
        }



        // this.ctx.lineWidth = 2.5;
        // this.ctx.strokeStyle = this.strokeStyle;

        // this.ctx.beginPath();
        // this.ctx.moveTo(0, (256 - this.freqData[i]) * scale + this.height / 4);
        // for (j = 0; i < len && j < this.width; i++, j++) {
        //     magnitude = (256 - this.freqData[i]) * scale + this.height / 4;
        //     this.ctx.lineTo(j, magnitude);
        // }
        // this.ctx.stroke();

        this.rAF = requestAnimationFrame(this.draw.bind(this));
        return this;
    }
}