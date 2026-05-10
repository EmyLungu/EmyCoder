from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.src.data_types import ChatIn
from app.src.configs import llm, MAX_CONVERSATION_MESSAGES

from langchain.messages import HumanMessage, AIMessage, SystemMessage

router = APIRouter()


@router.post("/chat")
async def chat(payload: ChatIn):

    system_msg = SystemMessage(
        content=(
            "You are an expert coding assistant. "
            "Analyze the code and the execution output "
            "provided to solve the user's issue."
        )
    )

    conversation = [system_msg]

    isUser = True
    for message in payload.messages[:-1][-MAX_CONVERSATION_MESSAGES:]:
        conversation.append(
            HumanMessage(content=message)
            if isUser
            else AIMessage(content=message)
        )
        isUser = not isUser

    context = (
        f"Context Snippet:\n```\n{payload.snippet}\n```\n"
        f"Execution Result: {payload.output}\n"
        f"Current Task: {payload.messages[-1]}"
    )

    conversation.append(HumanMessage(content=context))

    # response = await llm.ainvoke(conversation)
    async def generate_stream():
        async for chunck in llm.astream(conversation):
            yield chunck.content

    return StreamingResponse(generate_stream(), media_type="text/plain")
