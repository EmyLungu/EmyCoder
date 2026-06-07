from langchain.messages import HumanMessage, AIMessage, SystemMessage

from core.llm import MAX_CONVERSATION_MESSAGES


def get_conversation(
    messages: list[str], snippet: str, output: str
) -> list[str]:
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

    history_messages = messages[:-1]
    if len(history_messages) % 2 != 0:
        history_messages = history_messages[1:]
    history_messages = history_messages[-MAX_CONVERSATION_MESSAGES:]

    conversation = [system_msg]

    for i, message in enumerate(history_messages):
        if i % 2 == 0:
            conversation.append(HumanMessage(content=message))
        else:
            conversation.append(AIMessage(content=message))

    context = f"Task: {messages[-1]}\n\n" f"Source code:\n```\n{snippet}\n```"
    if output != "":
        context += f"Execution log:\n{output}\n"

    conversation.append(HumanMessage(content=context))

    return conversation
