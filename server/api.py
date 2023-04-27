import json
import subprocess
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import sys
from pydantic import BaseModel

class Code(BaseModel):
    code: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

global_vars = {}
local_vars = {}

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
if __name__ == "__main__":
    port = int(sys.argv[1])
    uvicorn.run(app, host="127.0.0.1", port=port)
