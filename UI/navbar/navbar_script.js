const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');
var isLoad = Boolean();

window.addEventListener('loadstart', () => {
    isLoad = true;
    sidebar.classList.toggle('load');
})

toggleBtn.addEventListener('click', () => {
    if (isLoad) {
        sidebar.classList.remove('load');
        sidebar.classList.toggle('active')
        isLoad = false;
    }
    sidebar.classList.toggle('active')
})

sidebar.addEventListener('mouseover', () => {
    if (isLoad) {
        sidebar.classList.remove('load');
        sidebar.classList.toggle('active')
        isLoad = false;
    }
    sidebar.classList.add('active');
});

sidebar.addEventListener('mouseleave', () => {
    sidebar.classList.remove('active');
});