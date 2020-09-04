'use strict';

class Test{
    constructor() {
        this.context = null;
        this.buffer = null;
        this.source = null;
    }

    initUI(){
        this.initBtPlay();
        this.initBtStop();
    }

    initBtPlay(){
        this.initBt('Play', () => {
            console.log('this.constructor.name = ', this.constructor.name); // Test
            console.log('clicked');
            this.initAudioContext();
            this.loadAudioBuffer("https://archive.org/download/100ClassicalMusicMasterpieces/1685%20Purcell%20,%20Trumpet%20Tune%20and%20Air.mp3");
            // this.playSound(this.buffer);
        });
    }

    initBtStop(){
        this.initBt('Stop', () => {
            this.stopSound();
        });
    }

    initBt(strTitle, listener) {
        let button = document.createElement('button');
        button.innerHTML = strTitle;  // set the button content
        button.addEventListener('click', listener);

        var body = document.getElementsByTagName("body")[0];
        body.appendChild(button);
    }

    initAudioContext() {
        var contextClass = (window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext);
        if (contextClass) {
                console.log('Web Audio API is available.')
                this.context = new contextClass();
        } else {
            console.log(' Web Audio API is not available. Ask the user to use a supported browser.')
        }
    }

    loadAudioBuffer(url){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        // Decode asynchronously
        request.onload = () => {
            this.context.decodeAudioData(request.response, (theBuffer) => {
                console.log('Get the data.')
                this.buffer = theBuffer;
                this.playSound(this.buffer) 
                console.log('buffer = ', this.buffer);
                }, function () {
                    console.log('[Error] loadAudioBuffer:: decodeAudioData error.')
                });
        }
        request.send();
    }

    playSound(buffer) {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.context.destination);
        this.source.start(0);
    }

    stopSound() {
        if (this.source != null) {
            this.source.stop();
        }else{
            this._showMessageError('[Error] stopSound:: this.source == null.');
        }
    }

    _showMessageError(strMsg) {
        console.log(strMsg);
        alert(strMsg);
    }
} // end of class

var test = new Test();
test.initUI();