document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const data = {
            email: email,
            password: password,
        };

        const apiUrl = 'http://localhost:8000/api/login/';

        axios.post(apiUrl, data)
            .then(response => {
                alert('로그인 성공');
                window.location.href = '/home.html';
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    alert('로그인 실패: ' + error.response.data);
                } else {
                    alert('로그인 실패: 알 수 없는 오류');
                }
            });
    });
});
