from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from .database import Base, engine
from .routers import chat, upload

# 创建 SQLite 数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Knowledge Base API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(chat.router)
app.include_router(upload.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Knowledge Base API is running"}

# TODO: Add routers for documents, chat, and graph
