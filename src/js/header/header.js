document.addEventListener('DOMContentLoaded', (e) => {
    const headerBar = document.querySelector('#headerBar');
    headerBar.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = '../settings/index.html';
    })
})