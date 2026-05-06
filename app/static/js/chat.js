import { postAction } from './post-action.js'

const messages = document.getElementById('chat-messages');
const sendChatBtn = document.getElementById('send-chat-btn');
const inputChat = document.getElementById("input-chat");

const inputArea = document.getElementById("input-code");
const output = document.getElementById("output");

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
    const result = await response.json();
    let message = JSON.stringify(result['message']).slice(1, -1);
    message = message.replaceAll("\\n", "\n")
    message = message.replace("/`([^`]+)`/g", "**$1**");

    addMessage(message, false)
}

sendChatBtn.addEventListener('click', async () => {
    addMessage(inputChat.value, true);
    inputChat.value = "";

    const messagesList = [...messages.children].map(child => child.innerText);

    const data = {
        messages: messagesList,
        snippet: inputArea.value,
        output: output.innerText,
    };

    postAction('/chat', data, chatCallback)
});

