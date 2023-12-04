document.addEventListener("DOMContentLoaded", async function () {


    const apiEndpoint = `http://localhost:8000/api/admin/`;
    const accessToken = localStorage.getItem('access_token');



    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('서버에서 오류 응답을 받았습니다.');
        }








    } catch (error) {
        console.error('요청 실패:', error);

    }
});