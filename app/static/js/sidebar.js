const sidebarBtn = document.getElementById('sidebar-btn');
const sidebar = document.getElementById('sidebar');

sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    console.log(sidebar.hidden);
})
