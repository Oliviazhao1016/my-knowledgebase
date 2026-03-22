from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import os
import uuid
import shutil

from ..database import get_db
from ..models.document import Document
from ..vector_store import get_vector_collection
from .chat import save_knowledge_background

router = APIRouter(prefix="/api/upload", tags=["upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. 保存文件到本地
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    save_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. 读取文件内容 (为了MVP简化，我们这里只处理 txt 和 md 的纯文本读取)
    # 实际项目中如果传 pdf，需要用到 pdfminer 或 pymupdf 来解析文本
    content = ""
    if file_ext.lower() in ['.txt', '.md', '.csv', '.json']:
        with open(save_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    else:
        # 对于不可直接读取的二进制文件，记录一个占位符
        content = f"这是一个名为 {file.filename} 的文件，由于是二进制格式或未安装解析库，暂未提取完整文本内容。"

    # 3. 交给后台任务入库（复用之前写的存入 SQLite 和向量库的逻辑）
    background_tasks.add_task(save_knowledge_background, content, file.filename, db)

    return {
        "status": "success",
        "message": f"文件 {file.filename} 已成功上传并开始解析入库。",
        "title": file.filename,
        "file_id": file_id
    }
