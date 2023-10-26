// document.getElementById("sidebar").style.display = "none";

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    sidebar.classList.add("sidebarHidden");
    overlay.style.display = "none";
    sidebar.style.display = "none";
}


function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    sidebar.classList.toggle("sidebarHidden");
    overlay.style.display = (sidebar.classList.contains("sidebarHidden")) ? "none" : "block";
    sidebar.style.display = (sidebar.classList.contains("sidebarHidden")) ? "none" : "block";
}

