'use strict';

class Test{
    constructor() {
        this.context = null;
        this.buffer = null;
    }

    initUI(){
        let button = document.createElement('button');
        button.innerHTML = 'ok';  // set the button content = "ok"
        button.addEventListener('click', () => {
            console.log('this.constructor.name = ', this.constructor.name); // Test
            console.log('clicked');
            this.initAudioContext();
            this.loadAudioBuffer("https://archive.org/download/100ClassicalMusicMasterpieces/1685%20Purcell%20,%20Trumpet%20Tune%20and%20Air.mp3");

        });

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
                this.playSound(theBuffer);
                console.log('buffer = ', this.buffer);
                }, function () {
                    console.log('[Error] loadAudioBuffer:: decodeAudioData error.')
                });
        }
        request.send();
    }

    playSound(buffer) {
        var source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.context.destination);
        source.start(0);
    }
} // end of class

var test = new Test();
test.initUI();