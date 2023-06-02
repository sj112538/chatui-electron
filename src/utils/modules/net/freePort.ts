export let findAndUseOpenPort: (startPort: number) => Promise<number>
try {
  const net = require('net')
  findAndUseOpenPort = (startPort: number): Promise<number> => {
    return new Promise((resolve, reject) => {
      let currentPort = startPort;
      const server = net.createServer((socket: { remoteAddress: any; remotePort: any; }) => {
        server.close();
      });
      const tryBind = () => {
        server.once('error', (error: { code: string; }) => {
          if (error.code === 'EADDRINUSE') {
            currentPort++;
            tryBind();
          } else {
            reject(error);
          }
        });
        server.listen(currentPort, 'localhost', () => {
          resolve(currentPort);
        });
      };
      tryBind();
    });
  }
} catch { }