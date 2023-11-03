import { UserInfo } from './jwtUserId.js';

// 서버로부터 UserIds를 가져오는 함수
async function fetchStudyIds() {
    const accessToken = localStorage.getItem('access_token');
    const userInfo = UserInfo(accessToken); // 사용자 정보 추출

    if (typeof userInfo === 'object' && userInfo.userId) {
        try {
            const response = await fetch("http://localhost:8000/api/alrarm/", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'User-ID': userInfo.userId // 사용자 ID를 헤더에 추가
                },
            });

            const data = await response.json();
            console.log(data);
            return data.UserIds;
        } catch (error) {
            console.error('Error fetching UserIds:', error);
            return [];
        }
    } else {
        console.error('Error extracting user ID');
        return [];
    }
}


// 웹소켓 연결 및 알림 처리 함수
async function setupWebSocket() {
    const accessToken = localStorage.getItem('access_token');
    try {
        const response = await fetch("http://localhost:8000/api/alrarm/", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // access_token을 헤더에 추가
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        const UserIds = data;

        console.log(data)

        UserIds.forEach(studyId => {
            let userId = studyId;// 사용자 ID를 얻어올 수 있는 방법에 따라 userId 값을 설정

            if (userId === null) {
                userId = '1';
                console.log(userId);
            }

            const user = UserInfo(accessToken);

            console.log(typeof userId, userId.User, data, user.userId);

            if (userId.User == user.userId) {

                const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${userId.User}/`);
                // const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${user_noti[0]}/`);
                console.log(userId.User, user.userId, "아이디와 사용자아이디가 일치합니다.");


                // 알림 카운트를 업데이트하는 함수
                function updateNotificationCount(count) {
                    const notificationCountElement = document.querySelector('.notify_count');
                    if (notificationCountElement) {
                        notificationCountElement.innerText = count;
                    }
                }
                socket.onopen = function (message) {
                    console.log('open checked');
                }


                socket.onmessage = function (e) {
                    console.log(e, ' is checked');
                    const data = JSON.parse(e.data);
                    const notificationMessage = data['message'];
                    const notificationCount = data['count'];

                    // 알림 메시지를 처리하고 UI 업데이트를 수행
                    const notificationContent = document.querySelector('.notification-content');
                    notificationContent.innerText = notificationMessage;
                    // 알림 모달에 active 클래스 추가하여 화면에 보이게 만듦
                    notificationModal.classList.add('active');
                    // 숫자를 알림 아이콘 위에 업데이트
                    updateNotificationCount(notificationCount);
                };

                // 웹소켓 연결이 닫힐 때의 로직도 추가할 수 있습니다.
                socket.onclose = function (event) {
                    console.log('웹소켓 연결이 닫혔습니다.', event);
                };
            }
        });
    } catch (error) {
        console.error('Error fetching studyIds:', error);
    }
}

// 웹소켓 설정 함수 호출
setupWebSocket();

// 알림 모달의 열기, 닫기 등의 로직을 여기에 추가하세요.
const notificationModal = document.querySelector('.notification-modal');
const notificationCountElement = document.querySelector('.notification-count');
const notificationTrigger = document.querySelector('.notification-trigger');

// 알림 아이콘 클릭 시 모달 열기
notificationTrigger.addEventListener('click', function (event) {
    event.preventDefault(); // 링크의 기본 동작을 막음
    notificationModal.style.display = 'block';
});

// 알림 모달의 닫기 버튼 클릭 시 모달 닫기
const closeButton = document.querySelector('.notification-modal .close');
closeButton.addEventListener('click', function () {
    notificationModal.style.display = 'none';
});

// 모달 외부를 클릭하면 모달 닫기
window.addEventListener('click', function (event) {
    if (event.target === notificationModal) {
        notificationModal.style.display = 'none';
    }
});
