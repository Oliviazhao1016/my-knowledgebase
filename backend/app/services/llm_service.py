import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# 初始化火山引擎客户端
# 注意：火山引擎完全兼容 OpenAI 的 SDK，所以我们使用的是 openai 库
client = OpenAI(
    api_key=os.getenv("VOLCENGINE_API_KEY"),
    base_url=os.getenv("VOLCENGINE_BASE_URL"),
)

CHAT_MODEL = os.getenv("CHAT_MODEL_ENDPOINT")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL_ENDPOINT")

def get_embedding(text: str) -> list[float]:
    """调用火山引擎向量模型将文本转为向量"""
    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error getting embedding: {e}")
        return []

def detect_intent(user_input: str) -> dict:
    """使用大模型判断用户输入是普通聊天还是记录新知识"""
    system_prompt = """
    你是一个知识库助手的意图识别引擎。
    请判断用户的输入是希望进行"普通问答/聊天"还是"将这段内容作为新知识记录下来"。
    
    返回 JSON 格式，包含两个字段：
    - intent: "chat" 或 "record"
    - extracted_title: 如果是 record，请提取或生成一个简短的标题（不超过15个字）。如果是 chat，则为空字符串。
    
    规则：
    1. 包含祈使句要求保存、记录、记住的，如"帮我记下来"、"存一下"，设为 record。
    2. 纯陈述句分享一个灵感、一个事实，但没有明确提问的，倾向于 record。
    3. 包含问号，或者是明确要求解释、查询、总结的，如"这是什么意思"、"什么是XXX"，设为 chat。
    """
    
    try:
        response = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        import json
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print(f"Error detecting intent: {e}")
        return {"intent": "chat", "extracted_title": ""}

def chat_with_rag(user_input: str, context_docs: list[str]) -> str:
    """结合检索到的知识库内容回答用户问题"""
    
    context_str = "\n\n".join([f"[参考片段 {i+1}]: {doc}" for i, doc in enumerate(context_docs)])
    
    system_prompt = f"""
    你是一个有用的个人知识库助手。请根据以下提供的参考片段回答用户的问题。
    如果参考片段中没有答案，请明确告诉用户"在知识库中未找到相关信息"，并给出你自己的通用回答。
    在回答中，请尽量引用参考片段的编号（如 [参考片段 1]）。
    
    参考知识库内容：
    {context_str}
    """
    
    try:
        response = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating chat response: {e}")
        return "抱歉，连接大模型服务时出现了问题。"
