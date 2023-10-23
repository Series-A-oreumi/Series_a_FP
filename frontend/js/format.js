// 시간 포맷 함수
export function formatTimeAgo(created_at) {
    const postCreatedAt = new Date(created_at);
    const now = new Date();
    const timeDifference = now - postCreatedAt;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    if (daysDifference > 0) {
        return `${daysDifference}일 전`;
    } else if (hoursDifference > 0) {
        return `${hoursDifference}시간 전`;
    } else {
        return `${minutesDifference}분 전`;
    }
}