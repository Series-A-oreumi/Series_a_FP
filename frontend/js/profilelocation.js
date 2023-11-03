
import { UserInfo } from "../js/jwtUserId.js"

const accessToken = localStorage.getItem('access_token');

// 프로필 변경 버튼 클릭 시 본인 프로필 변경 페이지로 이동
document.addEventListener("DOMContentLoaded", function () {
    const profileChangeLink = document.getElementById('profile-change-link');

    profileChangeLink.addEventListener('click', function (e) {
        e.preventDefault();

        const user_id = UserInfo(accessToken).userId;
        if (user_id) {
            // user_id를 사용하여 URL을 생성하고 프로필 변경 페이지로 이동
            const profileChangeUrl = `../html/profile_write.html?id=${user_id}`;
            window.location.href = profileChangeUrl;
        } else {
            // 사용자가 로그인되지 않았을 때의 처리
            alert('로그인이 필요합니다.');
            window.location.href = "../html/login.html";
            // 로그인 페이지로 이동하거나 다른 로그인 처리를 수행할 수 있음
        }
    });
});

// 사이드 바에서 프로필 버튼 클릭 시 본인의 프로필로 이동시키기
document.addEventListener("DOMContentLoaded", function () {
    const profileChangeLink = document.getElementById('profile-link');

    profileChangeLink.addEventListener('click', function (e) {
        e.preventDefault();

        const user_id = UserInfo(accessToken).userId;
        if (user_id) {
            // user_id를 사용하여 URL을 생성하고 프로필 변경 페이지로 이동
            const profileChangeUrl = `../html/profile.html?id=${user_id}`;
            window.location.href = profileChangeUrl;
        } else {
            // 사용자가 로그인되지 않았을 때의 처리
            alert('로그인이 필요합니다.');
            window.location.href = "../html/login.html";
            // 로그인 페이지로 이동하거나 다른 로그인 처리를 수행할 수 있음
        }
    });
});