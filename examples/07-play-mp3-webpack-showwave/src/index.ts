'use strict';

import { RuleTester } from "eslint";
import Scope from './Scope';

class Test{
    context:AudioContext | null;
    buffer:AudioBuffer | null;
    source:AudioBufferSourceNode | null;

    strStatusPlay:string = 'Play';
    strStatusPlaying:string = 'Playing';

    strBtPlayId:string = 'strBtPlayId';
    strBtStopId:string = 'strBtStopId';

    constructor() {
        this.context = null;
        this.buffer = null;
        this.source = null;
    }

    initUI(){
        this._initBtPlay();
        this._initBtStop();
    }

    _uiSoundPlay(buffer:AudioBuffer):{bok:boolean, strMsg:string} {
        if (buffer === null){
            return {bok:false, strMsg:'buffer === null'};
        }
        if (this.context === null){
            return {bok:false, strMsg:'this.context === null'};
        }
        this.source = this.context.createBufferSource();
        if (this.source === null){
            return  {bok:false, strMsg:'createBufferSource failure. source === null'};
        }
        this.source.buffer = this.buffer;

        // test
        let canvas = document.querySelector('canvas');
        let displayScope:Scope = new Scope(this.context, canvas); // create oscilloscope device for display audiosource on canvas
        this.source.connect(displayScope.input); // [osc source] -> [the display intput]
        displayScope.start();
        // end of test
        
        this.source.connect(this.context.destination);
        this.source.start(0);

        return {bok:true, strMsg: 'ok'};
    }

    _uiSoundStop() {
        if (this.source != null) {
            this.source.stop();
        }else{
            this._showMessageError('[Error] _uiSoundStop:: this.source == null.');
        }
    }

    _initBtPlay(){
        this._initBtComm('Play', this.strBtPlayId, async () => {
            console.log('this.constructor.name = ', this.constructor.name); // Test
            console.log('clicked');
            this._initAudioContext();
            this.buffer = await this._loadAudioBuffer("https://archive.org/download/100ClassicalMusicMasterpieces/1685%20Purcell%20,%20Trumpet%20Tune%20and%20Air.mp3");
            const {bok, strMsg} = this._uiSoundPlay(this.buffer);
            if(!bok){
                console.log(strMsg);
            }

            let btPlay:HTMLElement|null = document.getElementById(this.strBtPlayId);
            if(btPlay === null){
                console.log('[Error] _initBtPlay:: btPlay === null');
                return;
            }

            if (btPlay.innerText == this.strStatusPlay){
                btPlay.innerText = this.strStatusPlaying;
            }

        });
    }

    _initBtStop(){
        this._initBtComm('Stop', this.strBtStopId, () => {
            this._uiSoundStop();

            let btPlay:HTMLElement|null = document.getElementById(this.strBtPlayId);
            if(btPlay === null){
                console.log('[Error] _initBtPlay:: btPlay === null');
                return;
            }

            if (btPlay.innerText == this.strStatusPlaying){
                btPlay.innerText = this.strStatusPlay;
            }
        });
    }

    _initBtComm(strTitle:string, strID:string, listener:any) {
        let btCommon:HTMLElement = document.createElement('button');
        btCommon.setAttribute("id", strID);
        btCommon.innerHTML = strTitle;  // set the button content
        btCommon.addEventListener('click', listener);

        var body = document.getElementsByTagName("body")[0];
        body.appendChild(btCommon);
    }

    _initAudioContext() {
        // var contextClass = (window.AudioContext ||
        //     window.webkitAudioContext ||
        //     window.mozAudioContext ||
        //     window.oAudioContext ||
        //     window.msAudioContext);
        var contextClass = window.AudioContext;
        if (contextClass) {
                console.log('Web Audio API is available.')
                this.context = new contextClass();
        } else {
            console.log(' Web Audio API is not available. Ask the user to use a supported browser.')
        }
    }

    _loadAudioBuffer(url:string):Promise<AudioBuffer>{
        return new Promise(resolve => {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            // Decode asynchronously
            request.onload = () => {
                if(this.context === null){
                    console.log('[Error] _loadAudioBuffer:: this.context === null');
                    return;
                }
                this.context.decodeAudioData(request.response, (theBuffer:AudioBuffer) => {
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

    _showMessageError(strMsg:string) {
        console.log(strMsg);
        alert(strMsg);
    }
} // end of class

var test = new Test();
test.initUI();