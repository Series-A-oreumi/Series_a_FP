// document.getElementById("sidebar").style.display = "none";

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    
    sidebar.style.transform = "translateX(-250px)"; // 초기에도 왼쪽으로 이동
    overlay.style.display = "none";
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    sidebar.classList.toggle("sidebarHidden");

    if (sidebar.classList.contains("sidebarHidden")) {
        sidebar.style.transform = "translateX(-250px)"; // 왼쪽으로 이동
        overlay.style.display = "none";
    } else {
        sidebar.style.transform = "translateX(0)"; // 다시 나타나게
        overlay.style.display = "block";
    }
}