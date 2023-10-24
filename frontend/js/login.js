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