// WebSocket 연결 설정
const studyId = 1;
const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${studyId}/`);
const notificationCountElement = document.querySelector('.notification-count');
const notificationTrigger = document.getElementById('notification-trigger');
const notificationModal = document.getElementById('notification-modal');


// WebSocket으로부터 메시지를 받았을 때 실행되는 함수
socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const notificationMessage = data.message;
    const notificationCount = data.count; // 숫자를 받아옴

    // 받은 알림 메시지를 처리하고 UI 업데이트를 수행
    displayNotification(notificationMessage);

    // 숫자를 알림 아이콘 위에 업데이트
    notificationCountElement.innerText = notificationCount;
};



document.addEventListener('click', function (event) {
    if (event.target !== notificationModal && !notificationTrigger.contains(event.target)) {
        notificationModal.style.display = 'none';
        isModalOpen = false;
    }
});


notificationModal.addEventListener('click', function (event) {
    event.stopPropagation();
});



// 알림 모달 열기 함수
function displayNotification(message) {
    const notificationContent = document.querySelector('.notification-content');
    notificationContent.innerText = message;
    // 알림 모달에 active 클래스 추가하여 화면에 보이게 만듦
    notificationModal.classList.add('active');
}