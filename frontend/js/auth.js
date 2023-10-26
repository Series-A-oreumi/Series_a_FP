
// 페이지 로드 시 Access Token을 확인하고 만료 여부를 체크하는 함수
export function checkAccessTokenValidity() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
        // Access Token이 있을 때만 유효성 검사 수행
        const expirationTime = JSON.parse(atob(access_token.split('.')[1])).exp * 1000;
        const currentTime = new Date().getTime();

        if (currentTime >= expirationTime) {
            // Access Token이 만료된 경우, 로컬 스토리지에서 삭제하고 알림 후 로그인 페이지로 이동
            localStorage.removeItem('access_token');
            alert('로그인 시간이 만료되어 로그아웃 되었습니다.');
            window.location.href = '../html/login.html'; // 로그인 페이지로 이동
        }
    }
}