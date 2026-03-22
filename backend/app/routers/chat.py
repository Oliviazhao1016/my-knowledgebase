from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from ..database import get_db
from ..models.document import Document
from ..vector_store import get_vector_collection
from ..services.llm_service import detect_intent, get_embedding, chat_with_rag

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    intent: str # "chat" 或 "record"
    response_text: str
    citations: list[dict] = []
    saved_doc_id: str = None

def save_knowledge_background(text: str, title: str, db: Session):
    """后台任务：将用户想记录的知识保存到数据库和向量库"""
    doc_id = str(uuid.uuid4())
    
    # 1. 保存到 SQLite 关系型数据库
    db_doc = Document(
        id=doc_id,
        title=title or text[:15] + "...",
        content=text,
        type="text",
        summary=text[:100] + "..." if len(text) > 100 else text,
        tags=["灵感速记"]
    )
    db.add(db_doc)
    db.commit()
    
    # 2. 存入 ChromaDB 向量库
    # 这里我们为了简化，直接把整段文字算作一个 Chunk。如果文本很长，需要先分块。
    embedding = get_embedding(text)
    if embedding:
        collection = get_vector_collection()
        collection.add(
            ids=[f"{doc_id}_chunk_1"],
            embeddings=[embedding],
            documents=[text],
            metadatas=[{"doc_id": doc_id, "title": title}]
        )
    print(f"✅ Successfully saved new knowledge: {doc_id}")


@router.post("/", response_model=ChatResponse)
def handle_chat(request: ChatRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user_msg = request.message
    
    # 1. 意图识别
    intent_result = detect_intent(user_msg)
    intent = intent_result.get("intent", "chat")
    title = intent_result.get("extracted_title", "")
    
    if intent == "record":
        # 2. 如果是记录意图，将其交由后台任务处理入库
        background_tasks.add_task(save_knowledge_background, user_msg, title, db)
        return ChatResponse(
            intent="record",
            response_text=f"好的，我已经将这条信息记录到您的知识库中。标题提取为：【{title}】",
        )
        
    else:
        # 3. 如果是聊天意图，进行 RAG 检索
        query_embedding = get_embedding(user_msg)
        
        context_docs = []
        citations = []
        
        if query_embedding:
            # 去向量库检索最相似的 3 个片段
            collection = get_vector_collection()
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=3
            )
            
            # 解析检索结果
            if results and results['documents'] and len(results['documents']) > 0:
                for i, doc_text in enumerate(results['documents'][0]):
                    context_docs.append(doc_text)
                    meta = results['metadatas'][0][i]
                    citations.append({
                        "id": f"c{i}",
                        "text": doc_text[:50] + "...",
                        "docId": meta.get("doc_id", "")
                    })
        
        # 调用大模型生成回答
        ai_response = chat_with_rag(user_msg, context_docs)
        
        return ChatResponse(
            intent="chat",
            response_text=ai_response,
            citations=citations
        )
