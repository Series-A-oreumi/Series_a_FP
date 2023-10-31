// 폼 엘리먼트를 가져옵니다.
const studyForm = document.querySelector('.study-form');

// 폼 제출 이벤트 리스너를 설정합니다.
studyForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // 폼의 기본 동작을 막습니다.

    // FormData 객체를 사용하여 폼 데이터를 수집합니다.
    const formData = new FormData(studyForm);

    // 폼 데이터를 JSON 형식으로 변환합니다.
    // const formDataObject = {};
    // formData.forEach((value, key) => {
    //     formDataObject[key] = value;
    // });
    
    // 로컬 스토리지에서 access_token 가져오기
    const accessToken = localStorage.getItem('access_token');

    // 서버로 데이터를 전송합니다.
    try {
        const response = await 
            fetch('http://localhost:8000/api/study/create/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}` // access_token을 헤더에 추가
            },
            body: JSON.stringify(formDataObject), // JSON 형식으로 데이터를 전송합니다.
            });

        if (response.ok) {
            // 성공적으로 데이터를 보냈을 때 처리
            console.log('데이터를 성공적으로 전송했습니다.');
        } else {
            // 데이터 전송 실패 시 처리
            console.error('데이터 전송에 실패했습니다.');
        }
    } catch (error) {
        console.error('오류:', error);
    }
});
