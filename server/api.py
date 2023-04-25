import asyncio
import json 
from fastapi import FastAPI, WebSocket
import uvicorn
from app import Vits
from fastapi.middleware.cors import CORSMiddleware
import sys
from pydantic import BaseModel
class Path(BaseModel):
  path:str
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/getDisk")
async def getDisk():
    return Vits.get_disk_info()
  
@app.post("/getfiles")
async def getfiles(filesPath:Path):
    return Vits.getFiles(filesPath.path)

@app.websocket("/cmd")
async def cmd_output(websocket: WebSocket):
    try:
        await websocket.accept()
        websocket.send_text('connected\n\r')
        # 创建 cmd 进程
        process = await asyncio.create_subprocess_exec(
            "cmd.exe",
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        async def send_output():
            while True:
                output = await process.stdout.readline()
                print(output)
                if not output:
                    break
                await websocket.send_text(output.decode())
        async def send_errors():
            while True:
                error = await process.stderr.readline()
                if not error:
                    break
                await websocket.send_text(error.decode())
        asyncio.create_task(send_output())
        asyncio.create_task(send_errors())
        while True:
            try:
                message = await websocket.receive_text()
                json_message = json.loads(message)
                if json_message['Op'] == 'stdin':
                    command = json_message['Data']
                    await websocket.send_text(command)
                    process.stdin.write(command.encode())
                    await process.stdin.drain()
                elif json_message['Op'] == 'resize':
                    cols = json_message['Cols']
                    rows = json_message['Rows']
                    # 将 resize 这个命令发送给子进程的 stdin，这样子进程就知道终端的尺寸了
                    process.stdin.write(f"\033[8;{rows};{cols}t".encode() + b"\n")
                    await process.stdin.drain()
            except Exception as e:
                print(f"Error: {e}")
                process.kill()
                await process.wait()
                break
    except Exception as e:
        print(f"WebSocket Error: {e}")

if __name__ == "__main__":
    port = int(sys.argv[1])  # 从命令行参数获取端口号
    uvicorn.run(app, host="127.0.0.1", port=port)