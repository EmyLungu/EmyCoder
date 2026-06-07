from langchain_ollama import ChatOllama

from core.config_loader import settings


llm = ChatOllama(
    model="emycoder-qwen",
    base_url=settings.OLLAMA_BASE_URL,
    timeout=30,
    num_predict=512,
    stop=[
        "<|endoftext|>",
        "User:",
        "The execution log will show",
        "This confirms",
        "When you run",
    ],
    repeat_penalty=1.3,
)

MAX_CONVERSATION_MESSAGES = 10
