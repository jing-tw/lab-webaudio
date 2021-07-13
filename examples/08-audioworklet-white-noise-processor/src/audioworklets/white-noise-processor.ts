
// This code is copied from https://github.com/microsoft/TypeScript/issues/28308.
interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, Float32Array>): void;
}

declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
}

// the definition also checked at https://webaudio.github.io/web-audio-api/#dom-audioworkletglobalscope-registerprocessor
declare function registerProcessor(
  name: string,
  processorCtor: (new (
    options?: AudioWorkletNodeOptions
  ) => AudioWorkletProcessor) & {
    parameterDescriptors?: AudioParamDescriptor[];
  }
):undefined;

class WhiteNoiseProcessor extends AudioWorkletProcessor {

    process(inputs:Float32Array[][], outputs:Float32Array[][], parameters:Map<string, Float32Array>) {
      const output = outputs[0]
      output.forEach(channel => {
        for (let i = 0; i < channel.length; i++) {
          channel[i] = Math.random() * 2 - 1
        }
      })
      return true;
    }
  }

  registerProcessor('white-noise-processor', WhiteNoiseProcessor);
