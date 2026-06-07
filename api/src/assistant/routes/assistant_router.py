from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from assistant.schemas.assistant import ChatIn
from assistant.services.assistant_service import get_conversation
from core.llm import llm

router = APIRouter(prefix="/assistant", tags=["Chat Assistant"])


@router.post("/chat")
async def chat(payload: ChatIn):
    conversation = get_conversation(
        payload.messages, payload.snippet, payload.output
    )

    async def generate_stream():
        async for chunck in llm.astream(conversation):
            yield chunck.content

    return StreamingResponse(generate_stream(), media_type="text/plain")
