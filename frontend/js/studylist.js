// menu
const toggleBtns = document.querySelectorAll('.toggle-btn');
const toggleContainers = document.querySelectorAll('.toggle-container');

toggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        toggleContainers.forEach((container) => {
            container.classList.remove('active');
        });

        toggleContainers[index].classList.add('active');
    });
});


// api

