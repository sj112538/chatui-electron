export const playAudio = (audioStr: string, sampleRate: number): Promise<any> => {
  return new Promise(resolve => {
    const audioCtx = new AudioContext()
    if (audioStr.startsWith('data:audio/wav;base64,')) {
      const binaryAudio = atob(audioStr.split(',')[1]);
      const buffer = new ArrayBuffer(binaryAudio.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < binaryAudio.length; i++) {
        view[i] = binaryAudio.charCodeAt(i);
      }
      audioCtx.decodeAudioData(buffer, (audioBuffer) => {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => {
          resolve(source)
        }
        source.start();
      });
    } else {
      const audioData = JSON.parse(audioStr)
      const float32Audio = new Float32Array(audioData)
      const source = audioCtx.createBufferSource()
      source.buffer = audioCtx.createBuffer(1, float32Audio.length, sampleRate)
      source.buffer.getChannelData(0).set(float32Audio)
      source.connect(audioCtx.destination)
      source.onended = () => {
        resolve(source)
      }
      source.start()
    }
  })
}