const sidebarBtn = document.getElementById('sidebar-btn');
const sidebar = document.getElementById('sidebar');
const leftPanel = document.getElementById('left');

sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    sidebarBtn.classList.toggle('direction');
})

const openChatBtn = document.getElementById('open-chat-btn');
const chat = document.getElementById('chat');

openChatBtn.addEventListener('click', () => {
    const isClosed = chat.classList.toggle('hidden');
    openChatBtn.classList.toggle('direction');

    if (!isClosed) {
        leftPanel.style.borderRadius = "0 1.5em 1.5em 0"
    } else {
        leftPanel.style.borderRadius = "1.5em"
    }
})
