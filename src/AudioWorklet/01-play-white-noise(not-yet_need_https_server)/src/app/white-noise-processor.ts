// white-noise-processor.js
class WhiteNoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

    process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>):boolean {
      const output = outputs[0]
      output.forEach(channel => {
        for (let i = 0; i < channel.length; i++) {
          channel[i] = Math.random() * 2 - 1
        }
      })
      return true
    }
}
  
registerProcessor('white-noise-processor', WhiteNoiseProcessor)