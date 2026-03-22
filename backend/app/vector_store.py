import chromadb
from chromadb.config import Settings
import os

# ChromaDB 本地存储路径
CHROMA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "chroma")
os.makedirs(CHROMA_DIR, exist_ok=True)

# 初始化 ChromaDB 客户端
chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)

# 创建或获取 Collection (类似表)
# 用于存储文档的分块及其向量
collection_name = "knowledge_chunks"
try:
    vector_collection = chroma_client.get_collection(name=collection_name)
except ValueError:
    vector_collection = chroma_client.create_collection(name=collection_name)

def get_vector_collection():
    return vector_collection
