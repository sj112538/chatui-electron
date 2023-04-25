/// <reference types="vite/client" />
declare module '@kangc/v-md-editor/lib/theme/github.js'
declare module '@kangc/v-md-editor/lib/preview'
declare module '@kangc/v-md-editor'
declare module 'node-cmd' {
  function run(command: string, callback: (err: Error, data: string, stderr: string) => void): ChildProcess;
  function runSync(command: string, callback: (err: Error, data: string, stderr: string) => void): ChildProcess;
}