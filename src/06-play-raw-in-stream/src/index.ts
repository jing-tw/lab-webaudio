class PlayAudioStream {
    private static readonly strDATA_SOURCE:string = 'sin'; // 'random'
    private static readonly numSAMLING_RATE:number = 4000; //44100;
    private __audioCtx:any;
    private __numStartAt:number;

    constructor(){
        this.__numStartAt = 0;
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
            this.__nextFrame();  //simulate the streaming call back
        });
    }

    private __nextFrame(){
        let myData:Float32Array;
        switch(PlayAudioStream.strDATA_SOURCE){
            case 'sin':
                myData = this.__genSinData();
                break;
            case 'random':
                myData = this.__genRandomData();
                break;
            default:
                console.error('[__nextFrame] Unknown DATA_SOURCE, strDATA_SOURCE = ' + PlayAudioStream.strDATA_SOURCE + ' Act: Stop render audio');
                return;
        }
        this.__playAudio(myData);
        // console.log('next');
        setTimeout(this.__nextFrame.bind(this));
    }

    private __genRandomData():Float32Array{
        let length:number = PlayAudioStream.numSAMLING_RATE;
        let floatRawArray:Float32Array = new Float32Array(length);

        for(let i = 0; i<length; i++){
            floatRawArray[i] = Math.random() * 2 - 1; // Math.random() is in [0; 1.0], audio needs to be in [-1.0; 1.0]
        }

        return floatRawArray;
    }

    private __genSinData():Float32Array{
        let length:number = PlayAudioStream.numSAMLING_RATE;
        const frequency = 1000;
        let floatRawArray:Float32Array = new Float32Array(length);
        const secondsPerSample = 1 / PlayAudioStream.numSAMLING_RATE;
        const twoPi = 2 * Math.PI;

        let time = 0;
        for(let i = 0; i<length; i++, time += secondsPerSample){
            floatRawArray[i] = Math.sin(twoPi * frequency * time) * 1.0; 
        }

        return floatRawArray;
    }

    private __genAudioBuffer(floatRawArray:Float32Array):AudioBuffer{
        // console.log('1 this.__audioCtx.sampleRate = ', this.__audioCtx.sampleRate);
        let myAudioBuffer:AudioBuffer = this.__audioCtx.createBuffer(2, floatRawArray.length, this.__audioCtx.sampleRate);
        for (var channel = 0; channel < myAudioBuffer.numberOfChannels; channel++) {
            var nowBuffering = myAudioBuffer.getChannelData(channel);
            for (var i = 0; i < myAudioBuffer.length; i++) {
                nowBuffering[i] = floatRawArray[i];
            }
        }
        return myAudioBuffer;
    }

    private __playAudio(floatRawArray:Float32Array){
        let myAudioBuffer:AudioBuffer = this.__genAudioBuffer(floatRawArray);

        let source:AudioBufferSourceNode = this.__audioCtx.createBufferSource();
        source.buffer = myAudioBuffer;
        source.connect(this.__audioCtx.destination);
        source.start(this.__numStartAt);
        this.__numStartAt = this.__numStartAt + myAudioBuffer.duration;
    }
}

function main(){
    let obj:PlayAudioStream = new PlayAudioStream();
    obj.render();
}

main();


