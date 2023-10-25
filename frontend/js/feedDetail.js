// 시간 포맷 함수를 사용하여 시간을 포맷
import { formatTimeAgo } from "./format.js" 


// 페이지 로딩이 완료되면 실행됩니다.
document.addEventListener("DOMContentLoaded", async function () {
    
    try {
        // 백엔드 API에서 포스트 데이터를 가져옵니다.
        const response = await fetch("http://localhost:8000/api/story/1/"); // 현재는 post_id를 임의로 1로 두었지만 추후 ${post.pk}로 수정해야함!
        const post = await response.json();
        console.log(post)

        // 포스트 데이터를 동적으로 화면에 추가합니다.
        const contentsBox = document.querySelector(".contents_box");
        const article = document.createElement("article");
        article.className = "contents cont01";
        
        // 포스트 이미지 추가
        const imgSection = document.createElement('div');
        imgSection.className = "img_section";

        const postImg = document.createElement('div');
        postImg.className = "trans_inner";   
        const imgdiv = document.createElement('div');
        const image = document.createElement("img");
        // 사진도 일단 예시로만 
        image.src = "../media/post/2020/05/08/tiger/iOtAhiyj.jpg"
        image.alt = "피드이미지";

        imgdiv.appendChild(image)
        postImg.appendChild(imgdiv)
        imgSection.appendChild(postImg)
        
        // detail right box 생성
        const detailBox = document.createElement('div');
        detailBox.className = "detail--right_box";

        // 포스트 헤더를 추가 (프로필 이미지, 사용자 이름 등)
        const header = document.createElement("header");
        header.className = "top";
        
        const userContainer = document.createElement("div");
        userContainer.className = "user_container";
        // 프로필 이미지 추가
        const profileImg = document.createElement("div");
        profileImg.className = "profile_img";
        const img = document.createElement("img");
        img.src = "../media/accounts/tiger/uAqIxqLO.jpg";
        // img.src = post.author.profile.picture.url; (현재 프로필 이미지를 따로 만들어두지 않아서 일단 기본으로 하고 추후 변경예정!)
        img.alt = "프로필 이미지";
        profileImg.appendChild(img);
        userContainer.appendChild(profileImg);


        // 사용자 이름 및 국가 추가
        const userName = document.createElement("div");
        userName.className = "user_name";
        const nickName = document.createElement("div");
        nickName.className = "nick_name m_text";
        const postTime = formatTimeAgo(`${post.created_at}`);
        nickName.textContent = `${post.author.username} • ${postTime}`; // 요것도 아직 닉네임 설정 안해서 username으로 함. 추후 변경예정!
        userName.appendChild(nickName);
        const country = document.createElement("div");
        country.className = "country s_text";
        country.textContent = "Seoul, South Korea"; // 요것도 아직 지역 필드 없어서 서울로 임의로 설정 추후 변경 예정!
        userName.appendChild(country);
        userContainer.appendChild(userName);
        
        // 토글 기능 추가 해야함!
        const More = document.createElement('div');
        More.className = "sprite_more_icon";
        More.setAttribute("data-name", "more");
        const MoreUl = document.createElement('ul');
        MoreUl.className = "more_detail";
        const MoreLi = document.createElement('li');

        // input 엘리먼트를 생성
        const MoreInput = document.createElement("input");
        MoreInput.type = "submit";
        MoreInput.className = "follow";
        MoreInput.value = "팔로우";
        MoreInput.setAttribute("data-name", "follow");
        MoreInput.setAttribute("name", "6");

        MoreLi.appendChild(MoreInput);
        MoreUl.appendChild(MoreLi);
        More.appendChild(MoreUl);

        header.appendChild(userContainer);
        header.appendChild(More);

        // 댓글 스크롤 태그
        const scrollSection = document.createElement('section');
        scrollSection.className = "scroll_section";
        scrollSection.id = "comment-list-ajax-post8";

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
                        "Content-Type": "application/json",
                    },
                });
                
                if (response.ok) {
                    // 좋아요 상태를 서버에서 업데이트한 후에는 해당 버튼의 상태를 변경합니다.
                    const data = await response.json();
                    if (data.liked) {
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
        
        // 댓글 아이콘
        const commentDiv = document.createElement("div");

        // a 엘리먼트를 생성하고 href 속성을 설정.
        const divElement = document.createElement("div");
        divElement.className = "sprite_bubble_icon";

        // div 엘리먼트를 a 엘리먼트의 자식으로 추가합니다.
        commentDiv.appendChild(divElement);

        heartBtn.appendChild(likeButton);
        leftIcons.appendChild(heartBtn);
        leftIcons.appendChild(commentDiv);

        bottomIcons.appendChild(leftIcons);

        // 좋아요 개수 추가
        const likeCountSpan = document.createElement('span')
        // id 속성을 추가합니다.
        likeCountSpan.id = `like-count-${post.pk}`;
        likeCountSpan.className = "count";
        likeCountSpan.textContent = `좋아요 ${post.likes_count}개`;
        const countLikes = document.createElement('div');
        countLikes.className = `count_likes`;
        
        countLikes.appendChild(likeCountSpan);


        // 포스트 내용 추가
        const content = document.createElement("div");
        content.className = "content";
        content.textContent = post.content; // 포스트 내용을 여기에 추가


        // 부모 엘리먼트를 선택하거나 생성합니다.
        const commentAdd = document.createElement("div"); // 예시로 div 엘리먼트를 생성합니다.
        commentAdd.className = "comment_field";
        commentAdd.id = "add-comment-post8"; // 원하는 ID를 설정합니다.

        // "댓글 달기" 입력 필드 생성
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.name = "content";
        inputField.className = "comment-form";
        inputField.size = 70;
        inputField.placeholder = "댓글 달기...";
        inputField.maxLength = 40;
        inputField.required = true;
        inputField.id = "id_content";

        // "게시" 버튼 생성
        const publishButton = document.createElement("div");
        publishButton.className = "upload_btn m_text";
        publishButton.setAttribute("name", "8");
        publishButton.setAttribute("data-name", "comment");
        publishButton.textContent = "게시";
        
        // 로그인 확인 여부 코드 추가해야됨!
        // publishButton.addEventListener("click", function() {
        // alert("댓글을 작성하려면 로그인이 필요합니다");
        // });

        // 생성한 엘리먼트들을 부모 엘리먼트에 추가.
        commentAdd.appendChild(inputField);
        commentAdd.appendChild(publishButton);

        // detailBox에 추가
        detailBox.appendChild(header);
        detailBox.appendChild(scrollSection);
        detailBox.appendChild(bottomIcons);
        detailBox.appendChild(countLikes);
        detailBox.appendChild(content);
        detailBox.appendChild(commentAdd);
        
        
        // 나머지 요소들을 article에 추가
        article.appendChild(imgSection);
        article.appendChild(detailBox);

        // article을 postContainer에 추가
        contentsBox.appendChild(article);
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
});