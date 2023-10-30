// 좋아요 버튼을 선택하고 클릭 이벤트를 처리
const likeButton = document.createElement('div');

// 로그인 한 유저가 해당 게시물에 대해서 좋아요를 눌렀다면 on, 좋아요를 누르지 않았다면 '' 되도록 바꿔주기 (post.likes_user) -> 해당 게시물에 대해 좋아요를 누른 유저목록
likeButton.className = `sprite_heart_icon_outline  ${post.likes_count > 0 ? 'on' : ''}`;
likeButton.setAttribute('data-name', 'heartbeat');
likeButton.setAttribute('data-post-id', post.pk);
likeButton.addEventListener("click", async function () {
    const postId = likeButton.getAttribute("data-post-id");

    // 서버에 좋아요 토글 요청을 보냅니다.
    try {
        const response = await fetch(`http://localhost:8000/api/story/liked/${postId}/`, {
            method: "POST", // 좋아요 토글을 위한 POST 요청
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            // 좋아요 상태를 서버에서 업데이트한 후에는 해당 버튼의 상태를 변경합니다.
            // const data = await response.json();
            if (response.status === 201) {
                likeButton.classList.add("on");
            } else {
                likeButton.classList.remove("on");
            }
        } else {
            console.error("Error toggling like:", response.status);
        }
    } catch (error) {
        console.error("Error toggling like:", error);
    }
});

// 좋아요 아이콘을 만들고 설정합니다.
const heartBtn = document.createElement('div');
heartBtn.className = 'heart_btn'; // 클래스명 설정
const leftIcons = document.createElement('div');
leftIcons.className = 'left_icons'; // 클래스명 설정
const bottomIcons = document.createElement('div');
bottomIcons.className = 'bottom_icons'; // 클래스명 설정