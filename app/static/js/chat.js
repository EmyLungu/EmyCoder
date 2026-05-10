import { postAction } from './post-action.js'

const messages = document.getElementById('chat-messages');
const sendChatBtn = document.getElementById('send-chat-btn');
const inputChat = document.getElementById("input-chat");

const inputArea = document.getElementById("input-code");
const output = document.getElementById("output");
const outputStatus = document.getElementById("output-status");
const chatLoader = document.getElementById("chat-loader");

function addMessage(message, isUser) {
    const newMsg = document.createElement("span");
    newMsg.classList.add("chat-message");

    if (isUser) {
        newMsg.classList.add("chat-mine");
    } else {
        newMsg.classList.add("chat-their");
    }
    newMsg.innerText = message;


    messages.appendChild(newMsg)
    messages.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

async function chatCallback(response) {
    if (!response.ok) return;

    const newMsg = document.createElement("span");
    newMsg.classList.add("chat-message", "chat-their");
    messages.appendChild(newMsg);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        newMsg.innerText = fullText;
        messages.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}

sendChatBtn.addEventListener('click', async () => {
    addMessage(inputChat.value, true);
    inputChat.value = "";

    let outputText = ""
    if (outputStatus.innerText === "Execution: Error") {
        outputText = output.innerText
    }

    const messagesList = [...messages.children].map(child => child.innerText);

    const data = {
        messages: messagesList,
        snippet: inputArea.value,
        output: outputText,
    };

    postAction('/chat', data, chatCallback, chatLoader)
});
