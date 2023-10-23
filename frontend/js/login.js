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

        const apiUrl = 'http://localhost:8000/api/login';

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('로그인 실패');
                }
            })
            .then(data => {
                const token = data.token;
                localStorage.setItem('token', token);
                alert('로그인 성공');
                // window.location.href = '/home.html';
            })
            .catch(error => {
                alert('로그인 실패: ' + error.message);
            });
    });
});
