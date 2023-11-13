// 사용자 아이디 반환
export function UserInfo(accessToken) {
    // access_token이 존재하는지 확인
    if (accessToken) {
        // access_token은 점(.)으로 구분된 세 부분으로 이루어져 있습니다.
        // 두 번째 부분인 payload를 가져오기 위해 점을 기준으로 나눕니다.
        const tokenParts = accessToken.split('.');

        if (tokenParts.length === 3) {
            // payload 부분을 Base64 디코딩
            const payload = atob(tokenParts[1]);

            // JSON 형식으로 파싱하여 사용자 ID 가져오기
            try {
                const payloadObj = JSON.parse(payload);
                const userName = payloadObj.user_username;
                const userProfile = payloadObj.user_profile_img;
                const userId = payloadObj.user_id;

                return { userName, userProfile, userId };

            } catch (error) {
                console.error('Error parsing payload:', error);
                return 'Error parsing payload';
            }
        } else {
            console.error('Invalid access token format');
            return 'Invalid access token format';
        }
    } else {
        console.log('Access token not found in localStorage');
        return 'Access token not found';
    }
}