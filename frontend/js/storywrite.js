document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('write-form');
    const imageInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const uploadImage = document.getElementById('upload');

    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadImage.style.display = 'none';
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // 폼의 기본 동작을 중지합니다.

        // 폼 데이터를 FormData 객체로 가져옵니다.
        const formData = new FormData(form);

        // 라디오 버튼 선택 값을 확인합니다.
        const selectedOpenValue = formData.get('open');
        const isPublic = selectedOpenValue === 'all'; // 'all'이 선택된 경우 is_public은 True, 그렇지 않으면 False

        // is_public 값을 FormData에 추가합니다.
        formData.set('is_public', isPublic);

        // 백엔드 서버의 엔드포인트 URL을 설정합니다.
        const backendUrl = 'http://localhost:8000/api/story/create/';
        // 액세스 토큰을 로컬 스토리지에서 가져옵니다.
        const accessToken = localStorage.getItem('access_token');

        const headers = new Headers();
        headers.append('Authorization', `Bearer ${accessToken}`);

        // 데이터를 서버로 전송합니다.
        fetch(backendUrl, {
            method: 'POST',
            headers: headers, // 헤더에 액세스 토큰 추가
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    // 성공적으로 서버에 데이터를 보낸 경우
                    alert('게시글이 성공적으로 등록되었습니다.');
                    window.location.href = '../html/feed.html'; // 원하는 리다이렉션 URL로 변경하세요.
                    // 필요한 리다이렉션 또는 다른 작업을 수행하세요.
                } else {
                    // 서버 오류 또는 요청 오류 발생
                    alert('게시글을 등록하는 중 오류가 발생했습니다.');
                }
            })
            .catch(error => {
                // 네트워크 오류 등으로 요청 실패
                console.error('요청을 보내는 중 오류가 발생했습니다.', error);
            });
    });
});