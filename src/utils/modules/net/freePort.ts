import net from 'net';
export const findAndUseOpenPort = (startPort: number) => {
  let currentPort = startPort;
  const server = net.createServer((socket) => {
    console.log(`已连接到来自 ${socket.remoteAddress}:${socket.remotePort} 的客户端`);
    server.close();
  });

  const tryBind = () => {
    server.once('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        currentPort++;
        tryBind();
      }
    });
    server.listen(currentPort, 'localhost', () => {
      console.log(`正在监听端口 ${currentPort}...`);
    });
  }
  tryBind();
  return currentPort;
}