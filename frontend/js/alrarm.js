// WebSocket 연결 설정
const socket = new WebSocket('ws://' + window.location.host + '/ws/notifications/');
const notificationModal = document.querySelector('.notification-modal');

// WebSocket으로부터 메시지를 받았을 때 실행되는 함수
socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const notificationMessage = data.message;

    // 받은 알림 메시지를 처리하고 UI 업데이트를 수행
    // 알림 모달 열기
    displayNotification(notificationMessage);
};

// 알림 모달 열기 함수
function displayNotification(message) {
    const notificationContent = document.querySelector('.notification-content');
    notificationContent.innerText = message;
    // 알림 모달에 active 클래스 추가하여 화면에 보이게 만듦
    notificationModal.classList.add('active');
}

// 알림 모달의 닫기 버튼 클릭 시 모달 닫기
const closeButton = document.querySelector('.notification-modal .close');
closeButton.addEventListener('click', function () {
    // 알림 모달에서 active 클래스 제거하여 화면에서 감춤
    notificationModal.classList.remove('active');
});

// 모달 외부를 클릭하면 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === notificationModal) {
        // 알림 모달에서 active 클래스 제거하여 화면에서 감춤
        notificationModal.classList.remove('active');
    }
});
