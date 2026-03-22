from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from ..database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    type = Column(String) # file, link, text
    summary = Column(Text, nullable=True)
    tags = Column(JSON, default=list) # 存储为 JSON 字符串
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    file_path = Column(String, nullable=True) # 如果是文件，记录本地存储路径
    original_url = Column(String, nullable=True) # 如果是链接，记录原始URL
