class PlayAudioStream {
    private static readonly strDATA_SOURCE:string = 'sin'; // 'random'
    private static readonly numSAMLING_RATE:number = 4000; //44100;
    private readonly numChunkSizeInSec:number = 0.1;
    private __audioCtx:any;

    private __numStartAt:number; // for webaudio play time index
    private __time:number;   // for sin wave generate
    private __lastTimeoutTime:number; // for caucuating the the processing duration
    
    constructor(){
        this.__numStartAt = 0;
        this.__time = 0;

        this.__lastTimeoutTime = 0;
    }

    public render(){
        var button = document.createElement("button");
        button.innerHTML = "Play";

        var body = document.getElementsByTagName("body")[0];
        body.appendChild(button);

        button.addEventListener ("click", () => {
            this.__audioCtx = new (window.AudioContext)({
                latencyHint: 'interactive', //try to use the lowest possible and reliable latency it can
                sampleRate: PlayAudioStream.numSAMLING_RATE,
              });
            // this.__nextFrame();  //simulate the streaming call back
            setTimeout(this.__nextFrame.bind(this), 0);
        });
    }

    private __nextFrame(){
        let myData:Float32Array;
        myData = this.__getAudioData(this.numChunkSizeInSec);
        this.__playAudio(myData);

        // schedule the next chunk to play
        const numCurChunkDurInMs:number = myData.length * 1000 /PlayAudioStream.numSAMLING_RATE;
        let nextTimeoutDuration:number = numCurChunkDurInMs - (performance.now() - this.__lastTimeoutTime); // schedule time = current chunk duration - processing duration
        this.__lastTimeoutTime = performance.now();
        setTimeout(this.__nextFrame.bind(this), nextTimeoutDuration);
        console.log('next, len = ' + myData.length + ' dur = ' + numCurChunkDurInMs + '(in ms)' + ' nextTimeoutDuration = ' + nextTimeoutDuration + ' (in ms)');
    }

    private __getAudioData(numSec:number):Float32Array{
        let myData:Float32Array;
        switch(PlayAudioStream.strDATA_SOURCE){
            case 'sin':
                myData = this.__genSinData(numSec);
                break;
            case 'random':
                myData = this.__genRandomData(numSec);
                break;
            default:
                console.error('[__nextFrame] Unknown DATA_SOURCE, strDATA_SOURCE = ' + PlayAudioStream.strDATA_SOURCE + ' Act: return a data with zero');
                return Float32Array.from([0]);
        }
        return myData;
    }

    private __genRandomData(numSec:number):Float32Array{
        let length:number = PlayAudioStream.numSAMLING_RATE * numSec;
        let floatRawArray:Float32Array = new Float32Array(length);

        for(let i = 0; i<length; i++){
            floatRawArray[i] = Math.random() * 2 - 1; // Math.random() is in [0; 1.0], audio needs to be in [-1.0; 1.0]
        }

        return floatRawArray;
    }

    private __genSinData(numSec:number):Float32Array{
        let length:number = PlayAudioStream.numSAMLING_RATE * numSec;
        const frequency = 300; //1000;
        let floatRawArray:Float32Array = new Float32Array(length);
        const secondsPerSample = 1 / PlayAudioStream.numSAMLING_RATE;
        const twoPi = 2 * Math.PI;

        
        for(let i = 0; i<length; i++, this.__time += secondsPerSample){
            floatRawArray[i] = Math.sin(twoPi * frequency * this.__time) * 1.0; 
        }

        // let time:number = 0;
        // for(let i = 0; i<length; i++, time += secondsPerSample){
        //     floatRawArray[i] = Math.sin(twoPi * frequency * time) * 1.0; 
        // }

        return floatRawArray;
    }

    private __genAudioBuffer(floatRawArray:Float32Array):AudioBuffer{
        let myAudioBuffer:AudioBuffer = this.__audioCtx.createBuffer(2, floatRawArray.length, this.__audioCtx.sampleRate);
        myAudioBuffer.copyToChannel(floatRawArray, 0, 0);
        myAudioBuffer.copyToChannel(floatRawArray, 1, 0);
        return myAudioBuffer;
    }

    private __playAudio(floatRawArray:Float32Array){
        let myAudioBuffer:AudioBuffer = this.__genAudioBuffer(floatRawArray);

        let source:AudioBufferSourceNode = this.__audioCtx.createBufferSource();
        source.buffer = myAudioBuffer;
        source.connect(this.__audioCtx.destination);
        source.start(this.__numStartAt);
        this.__numStartAt = this.__numStartAt + myAudioBuffer.duration;
        console.log('play audio, this.__numStartAt = ' + this.__numStartAt + ' dur = ', myAudioBuffer.duration + ' (secs).');
    }
}

function main(){
    let obj:PlayAudioStream = new PlayAudioStream();
    obj.render();
}

main();


