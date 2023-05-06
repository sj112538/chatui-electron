import json
import subprocess
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import sys
from pydantic import BaseModel
import vits3.api as vits3
from enum import Enum
class CommandType(str, Enum):
    PYTHON = 'python'
    SYSTEM = 'command'
class CMD(BaseModel):
    command: str
    type:CommandType

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/execute")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            try:
                command = json.loads(data)['Data']
                proc = subprocess.Popen(['python', '-c', command],
                                        stdout=subprocess.PIPE,
                                        stderr=subprocess.PIPE,
                                        universal_newlines=True)
                stdout, stderr = proc.communicate()
                if stdout:
                    await websocket.send_text(stdout)
                if stderr:
                    await websocket.send_text(stderr)
            except Exception as e:
                await websocket.send_text(str(e))
    except WebSocketDisconnect as e:
        await websocket.send_text(str(e))
        
@app.post("/excuteNonRealTime")
def executeNonRealTime(cmd: CMD):
    try:
        command = cmd.command
        type = cmd.type
        if type == CommandType.PYTHON:
          proc = subprocess.Popen(['python', '-c', command],
                                  stdout=subprocess.PIPE,
                                  stderr=subprocess.PIPE,
                                  universal_newlines=True)
          stdout, stderr = proc.communicate()
          return {"result": stdout.strip() }
        elif type == CommandType.SYSTEM:
            proc = subprocess.Popen(command, shell=True,
                                    stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE,
                                    universal_newlines=True)
            stdout, stderr = proc.communicate()
            if stdout:
                return {"result": stdout}
            if stderr:
                return {"error": stderr}
        else:
            return {"error": f'Unrecognized command type: {type}'}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    port = int(sys.argv[1])
    uvicorn.run(app, host="127.0.0.1", port=port)
