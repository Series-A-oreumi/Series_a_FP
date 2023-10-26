// 로그인
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const data = {
                email: email,
                password: password,
            };

            fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
            })
                .then(response => {
                    if (response.ok) {
                        response.json().then(data => {
                            alert('로그인 성공');
                
                            // JWT 토큰을 로컬 스토리지에 저장
                            localStorage.setItem('access_token', data.access);
                            localStorage.setItem('refresh_token', data.refresh);
                            window.location.href = '../html/feed.html'; // feed 페이지 URL로 이동
                        });
                        
                    } else {
                        response.json().then(data => {
                            alert('로그인 실패: ' + JSON.stringify(data));
                        });
                    }
                })
                .catch(error => {
                    alert('로그인 실패: ' + error.message);
                });
        });
    } else {
        console.error('login-form not found');
    }
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === name + '=') {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});

// 로그아웃 버튼 클릭 시 (로그아웃 버튼 만들어야 됨)
document.getElementById('logout-button').addEventListener('click', function() {
    // 로컬 스토리지에서 토큰 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // 로그아웃 후 원하는 동작 수행 (예: 로그아웃 성공 페이지로 리다이렉트)
    window.location.href = '../html/login.html'; // 로그인 페이지로 이동시키기
});