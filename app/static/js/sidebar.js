const sidebarBtn = document.getElementById('sidebar-btn');
const sidebar = document.getElementById('sidebar');

sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    sidebarBtn.classList.toggle('direction');
})

const openChatBtn = document.getElementById('open-chat-btn');
const chat = document.getElementById('chat');

openChatBtn.addEventListener('click', () => {
    chat.classList.toggle('hidden');
    openChatBtn.classList.toggle('direction');
})
