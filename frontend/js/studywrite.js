// 폼 엘리먼트를 가져옵니다.
const studyForm = document.querySelector('.study-form');

// 폼 제출 이벤트 리스너를 설정합니다.
studyForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // 폼의 기본 동작을 막습니다.

    // FormData 객체를 사용하여 폼 데이터를 수집합니다.
    const formData = new FormData(studyForm);

    // 로컬 스토리지에서 access_token 가져오기
    const accessToken = localStorage.getItem('access_token');

    //  선택한 기술 스택이 여러개 일 경우 선택한 값을 가져옵니다.
    const selectedStack = Array.from(document.querySelectorAll('#stacks option:checked')).map(option => option.value);

    try {
        const response = await fetch('https://estagram.site/api/study/create/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // access_token을 헤더에 추가
                'Content-Type': 'application/json', // JSON 데이터를 전송할 것임
            },
            body: JSON.stringify({
                ...Object.fromEntries(formData),
                stacks: selectedStack,
            }),
        });

        if (response.ok) {
            // 성공적으로 데이터를 보냈을 때 처리
            alert('스터디 글을 성공적으로 생성했습니다.');
            window.location.href = 'Series_a_FP/frontend/html/studylist.html';

        } else {
            // 데이터 전송 실패 시 처리
            alert('모든 항목들을 입력해주세요.');
        }
    } catch (error) {
        console.error('오류:', error);
    }
});