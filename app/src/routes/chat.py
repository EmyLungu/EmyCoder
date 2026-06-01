from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.src.data_types import ChatIn
from app.src.configs import llm, MAX_CONVERSATION_MESSAGES

from langchain.messages import HumanMessage, AIMessage, SystemMessage

router = APIRouter(prefix="/assistant", tags=["Chat Assistant"])


@router.post("/chat")
async def chat(payload: ChatIn):
    system_msg = SystemMessage(
        content=(
            "You are a Senior Systems Architect and Technical Instructor. "
            "Respond with absolute brevity.\n\n"
            "**Output Template (strictly follow):**\n"
            "- **Diagnosis**: [One sentence — the root cause]\n"
            "- **Implementation**: [One clean code block only]\n"
            "- **Constraint**: [One technical tip]\n\n"
            "**Hard rules — violation is failure:**\n"
            "- ONE code block maximum. Never two.\n"
            "- NEVER write console output, logs, or execution results.\n"
            "- NEVER repeat or paraphrase the user's request.\n"
            "- NEVER add pleasantries or filler.\n"
            "- If continuing a conversation, "
            "do NOT re-explain prior solutions."
        )
    )

    history_messages = payload.messages[:-1]
    if len(history_messages) % 2 != 0:
        history_messages = history_messages[1:]
    history_messages = history_messages[-MAX_CONVERSATION_MESSAGES:]

    conversation = [system_msg]

    for i, message in enumerate(history_messages):
        if i % 2 == 0:
            conversation.append(HumanMessage(content=message))
        else:
            conversation.append(AIMessage(content=message))

    context = (
        f"Task: {payload.messages[-1]}\n\n"
        f"Source code:\n```\n{payload.snippet}\n```"
    )
    if payload.output != "":
        context += f"Execution log:\n{payload.output}\n"

    conversation.append(HumanMessage(content=context))

    async def generate_stream():
        async for chunck in llm.astream(conversation):
            yield chunck.content

    return StreamingResponse(generate_stream(), media_type="text/plain")
