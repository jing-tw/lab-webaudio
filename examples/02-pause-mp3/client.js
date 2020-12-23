'use strict';
/**
 * Pause Key Idea:
 * - Pause: Save the amount of time a sound has been playing to offset
 * - Play: Start to play the audio immediately with the offiset. 
 * 
 * Reference:
 * - https://github.com/borismus/webaudioapi.com/blob/master/content/book/Web_Audio_API_Boris_Smus.pdf
 */
class Test{
    constructor() {
        this.context = null;
        this.buffer = null;
        this.source = null;

        this.startOffset = 0;
        this.startTime = 0;
    }

    initUI(){
        this._initBtPlay();
        this._initBtPause();
        this._initBtStop();
    }
   
    _uiSoundPlay(buffer) {
        this.startTime = this.context.currentTime;
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.context.destination);
        this.source.start(0, this.startOffset % buffer.duration);
    }

    _uiSoundStop() {
        if (this.source != null) {
            this.source.stop();
            return [1, 'ok'];
        }else{
            let strMsg = '[Error] _uiSoundStop:: this.source == null.';
            return [0, strMsg];
        }
    }

    _uiSoundPause() {
        const [bOk, strMsg] = this._uiSoundStop();
        if (!bOk)
            return [bOk, strMsg];

        this.startOffset += this.context.currentTime - this.startTime; // Measure how much time passed since the last pause.
        return [1, 'ok'];
    }


    _initBtPlay(){
        this._initBtComm('Play', async () => {
            console.log('this.constructor.name = ', this.constructor.name); // Test
            console.log('clicked');
            this._initAudioContext();
            this.buffer = await this._loadAudioBuffer("https://archive.org/download/100ClassicalMusicMasterpieces/1685%20Purcell%20,%20Trumpet%20Tune%20and%20Air.mp3");
            this._uiSoundPlay(this.buffer);
        });
    }

    _initBtPause(){
        this._initBtComm('Pause', () => {
            let [bOk, strMsg] = this._uiSoundPause();
            if (!bOk){
                this._showMessageError(strMsg);
            }
        });
    }

    _initBtStop(){
        this._initBtComm('Stop', () => {
            this._uiSoundStop();
        });
    }

    _initBtComm(strTitle, listener) {
        let button = document.createElement('button');
        button.innerHTML = strTitle;  // set the button content
        button.addEventListener('click', listener);

        let body = document.getElementsByTagName("body")[0];
        body.appendChild(button);
    }

    _initAudioContext() {
        let contextClass = (window.AudioContext ||
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

    _loadAudioBuffer(url){
        return new Promise(resolve => {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            // Decode asynchronously
            request.onload = () => {
                this.context.decodeAudioData(request.response, (theBuffer) => {
                    console.log('Get the data.')
                    this.buffer = theBuffer;
                    resolve(this.buffer);
                    console.log('buffer = ', this.buffer);
                    }, function () {
                        console.log('[Error] _loadAudioBuffer:: decodeAudioData error.')
                    });
            } // end of onload
            request.send();});
        }

    

    _showMessageError(strMsg) {
        console.log(strMsg);
        alert(strMsg);
    }
} // end of class

let test = new Test();
test.initUI();