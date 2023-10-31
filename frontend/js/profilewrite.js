
    document.addEventListener("DOMContentLoaded", function() {
        const profileForm = document.getElementById('profileForm');
        const fileInput = document.getElementById('fileInput');
        const profileImage = document.getElementById('profileImage');
    
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 폼의 기본 동작(페이지 리로딩)을 막습니다.
    
            // FormData 객체를 사용하여 폼 데이터를 가져옵니다.
            const formData = new FormData(profileForm);
            
            // 백엔드 서버의 엔드포인트 URL을 설정합니다.
            const backendUrl = 'http://localhost:8000/api/profile/'; 
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
                window.location.href = '../html/profile.html'; // 원하는 리다이렉션 URL로 변경하세요.
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