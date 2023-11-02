
    document.addEventListener("DOMContentLoaded", async function() {
        const profileForm = document.getElementById('profileForm');
        const fileInput = document.getElementById('fileInput');
        const profileImage = document.getElementById('profileImage');
        
        const usernameInput = document.querySelector('input[name="username"]');
        const nicknameInput = document.querySelector('input[name="nickname"]');
        const introductionInput = document.querySelector('input[name="info"]');
        
        // url 에서 user_id 빼오기
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('id');

        // 백엔드 서버에서 데이터를 가져옵니다.
        const accessToken = localStorage.getItem('access_token');
        const backendUrl = `https://estagram.site/api/profile/${userId}`; // 백엔드 서버의 URL로 변경해야 합니다.

        try {
            const response = await fetch(backendUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const profileData = await response.json();
                
                // 가져온 데이터를 각 입력 필드의 기본값으로 설정
                usernameInput.value = profileData.user_info.username || '';
                nicknameInput.value = profileData.user_info.nickname || '';
                introductionInput.value = profileData.user_info.info || '';

                // 프로필 이미지를 가져와서 설정
                if (profileData.user_info.profile_img) {
                    profileImage.src = profileData.user_info.profile_img;
                }
                console.log(profileData.user_info.profile_img)
            } else {
                alert('프로필 데이터를 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('오류:', error);
        }

        profileForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 폼의 기본 동작(페이지 리로딩)을 막습니다.
    
            // FormData 객체를 사용하여 폼 데이터를 가져옵니다.
            const formData = new FormData(profileForm);
            
            // 백엔드 서버의 엔드포인트 URL을 설정합니다.
            const backendUrl = 'https://estagram.site/api/profile/'; 
            // 액세스 토큰을 로컬 스토리지에서 가져옵니다.
            const accessToken = localStorage.getItem('access_token');
            
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${accessToken}`);
            
            // 서버로 데이터를 전송합니다.
            fetch(backendUrl, {
                method: 'PUT',
                headers: headers, // 헤더에 액세스 토큰 추가
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // 성공적으로 서버에 데이터를 보낸 경우
                alert('프로필이 성공적으로 업데이트되었습니다.');
                window.location.href = `../html/profile.html?id=${userId}`; // 원하는 리다이렉션 URL로 변경하세요.
            })
            .catch(error => {
                // 서버 오류 또는 요청 오류 발생
                alert('프로필을 업데이트하는 중 오류가 발생했습니다.');
            });
        });
    
        // 프로필 이미지 미리보기 기능
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0]; // 선택한 파일을 가져옵니다.
    
            if (file) {
                // 파일을 선택한 경우, 선택한 파일의 정보를 확인할 수 있습니다.
                const reader = new FileReader();
                reader.onload = function(e) {
                    // 선택한 이미지 파일을 미리보기합니다.
                    profileImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });