document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const nickname = document.getElementById('nickname').value;
            const password = document.getElementById('password').value;
            const password2 = document.getElementById('password2').value;
            const bootcamp = document.getElementById('bootcamp').value;


            // 추가: 비밀번호 길이
            if (password.length < 8) {
                alert('비밀번호는 8자리 이상이어야 합니다.');
                return;
            }

            // // 추가: 숫자, 문자, 특수 문자 중 2개 이상 조합
            // const passwordRegex = /(?=(.*\d))(?=(.*[a-zA-Z]))(?=(.*[\W]))/;
            // if (!passwordRegex.test(password)) {
            //     alert('비밀번호는 숫자, 문자, 특수 문자 중 최소 2개 이상의 조합이어야 합니다.');
            //     return;
            // }


            const data = {
                email: email,
                username: username,
                nickname: nickname,
                password: password,
                password2: password2,
                bootcamp: bootcamp
            };

            fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
            })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '../html/login.html'; // 로그인 페이지 URL로 이동
                    } else {
                        response.json().then(data => {
                            alert('회원가입 실패: ' + JSON.stringify(data));
                        });
                    }
                })
                .catch(error => {
                    alert('회원가입 실패: ' + error.message);
                });
        });
    } else {
        console.error('register-form not found');
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