from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# 挂载静态文件目录（如果存在 public 文件夹）
if os.path.exists("public"):
    app.mount("/", StaticFiles(directory="public", html=True), name="static")

@app.get("/api/hello")
def read_root():
    return {"message": "Hello! 这是来自 render 云端 Python 后端的问候!"}
