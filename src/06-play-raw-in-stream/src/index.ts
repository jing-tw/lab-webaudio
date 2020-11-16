

class PlayAudioStream {
    audioCtx:any;
    myAudioBuffer:AudioBuffer;
    numStartAt:number;

    constructor(){
        this.audioCtx = new (window.AudioContext)();
        this.myAudioBuffer = this.audioCtx.createBuffer(2, this.audioCtx.sampleRate * 10, this.audioCtx.sampleRate);
        this.numStartAt = 0;
    }

    public render(){
        var button = document.createElement("button");
        button.innerHTML = "Play";

        var body = document.getElementsByTagName("body")[0];
        body.appendChild(button);

        button.addEventListener ("click", () => {
            this.__playAudio();
        });
    }

    private __playAudio(){
        this.__genRawData();

        var source = this.audioCtx.createBufferSource();
        source.buffer = this.myAudioBuffer;
        source.connect(this.audioCtx.destination);
        source.start(this.numStartAt);
    }

    private __genRawData(){
        for (var channel = 0; channel < this.myAudioBuffer.numberOfChannels; channel++) {
            var nowBuffering = this.myAudioBuffer.getChannelData(channel);
            for (var i = 0; i < this.myAudioBuffer.length; i++) {
                nowBuffering[i] = Math.random() * 2 - 1;
            }
        }
    }

}

function main(){
    let obj:PlayAudioStream = new PlayAudioStream();
    obj.render();
}

main();


