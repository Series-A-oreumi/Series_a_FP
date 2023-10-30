
// sidebar
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

// subsidebar
function toggleSubSidebar() {
    const sidebar = document.getElementById("sidebar");
    const subSidebar = document.getElementById("sub-sidebar");

    sidebar.style.transform = "translateX(-250px)";
    subSidebar.style.display = "block";
}

// sidebar 닫힘
function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const subSidebar = document.getElementById("sub-sidebar");
    const overlay = document.getElementById("overlay");
    
    sidebar.style.transform = "translateX(-250px)";
    subSidebar.style.display = "none"; // 초기에도 왼쪽으로 이동
    overlay.style.display = "none";
}