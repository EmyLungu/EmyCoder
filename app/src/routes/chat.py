from fastapi import APIRouter

from app.src.data_types import ChatIn, ChatOut
from app.src.configs import llm

router = APIRouter()


@router.post("/chat", response_model=ChatOut)
async def chat(payload: ChatIn):

    system_msg = (
        "You are a codeing chat assistant tool. "
        "Your task is to fix the programming problems needed"
        "Below there are some messages from you with the user "
        "that needs help, a last code snippet of the the user "
        "and the result of the execution.\n"
        "CRITICAL:\n"
        "1. Create a robust and good response to the user to "
        "solve their problem from the last message!"
    )

    prompt = f"<|im_start|>system\n{system_msg}<|im_end|>\n"

    isUser = True
    for message in payload.messages:
        who = "user" if isUser else "assistant"
        prompt += f"<|im_start|>{who}\n{message}<|im_end|>\n"
        isUser = not isUser

    prompt += f"<|im_start|>user\n{payload.snippet}<|im_end|>\n"
    prompt += f"<|im_start|>user\n{payload.output}<|im_end|>\n"
    prompt += "<|im_start|>assistant\n"

    output = llm(
        prompt, max_tokens=512, stop=["<|im_end|>"], echo=False, temperature=0
    )

    response = output["choices"][0]["text"]

    return {"message": response}
