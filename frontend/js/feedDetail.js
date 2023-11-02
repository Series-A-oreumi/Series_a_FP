// 시간 포맷 함수를 사용하여 시간을 포맷
import { formatTimeAgo } from "./format.js"

// 페이지 로딩이 완료되면 실행됩니다.
export async function feedDetail(postId) {

    // 로컬 스토리지에서 access_token 가져오기
    const accessToken = localStorage.getItem('access_token');

    try {
        // 백엔드 API에서 포스트 데이터를 가져옵니다.
        const response = await // Fetch 요청 보내기
            // 임시로 story/1 게시물로 선정 -> 추후 변경해야됨!
            fetch(`http://localhost:8000/api/story/${postId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // access_token을 헤더에 추가
                    'Content-Type': 'application/json'
                },
            });
        // 현재는 post_id를 임의로 1로 두었지만 추후 ${post.pk}로 수정해야함!
        const post = await response.json();
        console.log(`feedDetail ${post.content}`);

        // 포스트 데이터를 동적으로 화면에 추가합니다.
        const contentsBox = document.querySelector(".contents_detail_box");
        const article = document.createElement("article");
        article.className = "contents_detail cont01";

        // 포스트 이미지 추가
        const imgSection = document.createElement('div');
        imgSection.className = "img_section";

        const postImg = document.createElement('div');
        postImg.className = "trans_inner";
        const imgdiv = document.createElement('div');
        const image = document.createElement("img");
        // 사진도 일단 예시로만 
        image.src = "../media/post/2020/05/08/tiger/iOtAhiyj.jpg"
        // image.src = "/frontend/media/post/2020/05/08/tiger/김치찌개.png"
        // image.src = post.데이터 이름 넣기.images.url;
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
        const usernameSpan = document.createElement("span");
        usernameSpan.textContent = post.author.username;
        usernameSpan.style.color = "black";  // 사용자 이름의 글자색을 여기에 지정

        // postTime 설정 및 스타일 지정
        const postTimeSpan = document.createElement("span");
        postTimeSpan.textContent = `${postTime}`;
        postTimeSpan.style.color = "#888";
        nickName.appendChild(usernameSpan);
        nickName.appendChild(postTimeSpan);
        // const country = document.createElement("div");
        // country.className = "country s_text";
        // country.textContent = "Seoul, South Korea"; // 요것도 아직 지역 필드 없어서 서울로 임의로 설정 추후 변경 예정!
        // userName.appendChild(country);
        userName.appendChild(nickName);
        userContainer.appendChild(userName);

        // 토글 기능 추가 해야함!
        const More = document.createElement('div');
        More.className = "sprite_more_icon";
        More.setAttribute("data-name", "more");
        const MoreUl = document.createElement('ul');
        MoreUl.className = "more_detail";
        const MoreLi = document.createElement('li');

        // input 엘리먼트를 생성
        // const MoreInput = document.createElement("input");
        // MoreInput.type = "submit";
        // MoreInput.className = "follow";
        // MoreInput.value = "팔로우";
        // MoreInput.setAttribute("data-name", "follow");
        // MoreInput.setAttribute("name", "6");

        // MoreLi.appendChild(MoreInput);
        // MoreUl.appendChild(MoreLi);
        // More.appendChild(MoreUl);

        header.appendChild(userContainer);
        // header.appendChild(More);

        // 댓글 스크롤 태그
        const scrollSection = document.createElement('section');
        scrollSection.className = "scroll_section";
        scrollSection.id = "comment-list-ajax-post8";


        // 좋아요 아이콘을 만들고 설정합니다.
        // const heartBtn = document.createElement('div');
        // heartBtn.className = 'heart_btn'; // 클래스명 설정
        // const leftIcons = document.createElement('div');
        // leftIcons.className = 'left_icons'; // 클래스명 설정


        // // 댓글 아이콘
        // const commentDiv = document.createElement("div");

        // // a 엘리먼트를 생성하고 href 속성을 설정.
        // const divElement = document.createElement("div");
        // divElement.className = "sprite_bubble_icon";

        // // div 엘리먼트를 a 엘리먼트의 자식으로 추가합니다.
        // commentDiv.appendChild(divElement);


        // leftIcons.appendChild(heartBtn);
        // leftIcons.appendChild(commentDiv);

        const heartBtn = document.createElement('div');
        heartBtn.className = 'heart_btn'; // 클래스명 설정

        // "좋아요" 텍스트 추가
        const likeText = document.createElement('span');
        likeText.textContent = '좋아요';

        const likeContainer = document.createElement('div');

        // 좋아요 버튼을 선택하고 클릭 이벤트를 처리
        const likeButton = document.createElement('div');

        // 로그인 한 유저가 해당 게시물에 대해서 좋아요를 눌렀다면 on, 좋아요를 누르지 않았다면 '' 되도록 바꿔주기 (post.likes_user) -> 해당 게시물에 대해 좋아요를 누른 유저목록
        likeButton.className = `sprite_heart_icon_outline  ${post.likes_count > 0 ? 'on' : ''}`;
        likeButton.setAttribute('data-name', 'heartbeat');
        likeButton.setAttribute('data-post-id', post.pk);
        likeContainer.addEventListener("click", async function () {
            const postId = likeButton.getAttribute("data-post-id");

            try {
                const response = await fetch(`http://localhost:8000/api/story/liked/${postId}/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {


                    // 좋아요 상태를 서버에서 업데이트한 후에는 해당 버튼의 상태를 변경합니다.
                    if (response.status === 201) {
                        likeButton.classList.add("on");
                    } else if (response.status === 200) {
                        likeButton.classList.remove("on");
                    }

                    // 업데이트된 좋아요 개수를 UI에 반영
                    const likesCountResponse = await response.json();
                    const updatedLikesCount = likesCountResponse.likes_count;
                    likeCountSpan.textContent = `${updatedLikesCount}`;
                } else {
                    console.error("Error toggling like:", response.status);
                }
            } catch (error) {
                console.error("Error toggling like:", error);
            }
        });

        likeContainer.className = 'like_container'; // 클래스명 설정
        likeContainer.appendChild(likeButton);
        likeContainer.appendChild(heartBtn);
        likeContainer.appendChild(likeText);




        // 댓글 이미지
        const commentImg = document.createElement('img');
        commentImg.src = '../imgs/postdetail/comment.svg'; // 이미지 경로를 실제 이미지 경로로 바꿔주세요.
        commentImg.alt = '댓글';
        commentImg.className = 'comment_img'; // 클래스명 설정

        // 댓글 이미지와 텍스트를 같은 div에 추가
        const commentContainer2 = document.createElement('div');
        commentContainer2.className = 'comment_container2'; // 클래스명 설정
        commentContainer2.appendChild(commentImg);

        // "댓글 달기" 텍스트 추가
        const commentText = document.createElement('span');
        commentText.textContent = '댓글 달기';
        commentContainer2.appendChild(commentText);

        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'icons_container'; // 클래스명 설정

        iconsContainer.appendChild(likeContainer);
        iconsContainer.appendChild(commentContainer2);


        const interactionContainer = document.createElement('div');
        interactionContainer.className = 'interaction_container';

        const likeCountContainer = document.createElement('div');
        likeCountContainer.className = 'like_count_container';

        // 좋아요 이미지
        const heartImg = document.createElement('img');
        heartImg.src = '../imgs/postdetail/like.svg'; // 좋아요 이미지 경로
        heartImg.alt = '좋아요';
        heartImg.className = 'heart_img'; // 클래스명 설정

        // 좋아요 개수 추가
        const likeCountSpan = document.createElement('span')
        // id 속성을 추가합니다.
        likeCountSpan.id = `like-count-${post.pk}`;
        likeCountSpan.className = "count";
        likeCountSpan.textContent = post.likes_count;

        likeCountContainer.appendChild(heartImg);
        likeCountContainer.appendChild(likeCountSpan);

        //댓글 개수 추가
        const commentContainer = document.createElement('div')
        commentContainer.className = "comment_container";
        const comment = document.createElement('div')
        comment.className = "comment";

        // 댓글 개수를 표시합니다.
        comment.textContent = `댓글 ${post.comments_count}개`;
        comment.id = `comment-all-${post.pk}`;
        commentContainer.appendChild(comment);

        interactionContainer.appendChild(likeCountContainer);
        interactionContainer.appendChild(commentContainer);

        // 포스트 내용 추가
        const content = document.createElement("div");
        content.className = "content_detail";
        console.log(post.content);
        content.textContent = post.content; // 포스트 내용을 여기에 추가
        // content.textContent = `zz ${postId}`; // 포스트 내용을 여기에 추가


        const commentAdd = document.createElement("div");
        commentAdd.className = "comment_field";
        commentAdd.id =  `${post.pk}`; 

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
        publishButton.id = `${post.pk}`
        

        const commentListContainer = document.createElement("div");
        commentListContainer.id = "comment-list-container";
        const commentList = document.createElement("div");
        commentList.id = "comment-list";
            // comment-display 엘리먼트를 생성
        const commentDisplay = document.createElement("div");
        commentDisplay.className = "comment-display";
        commentListContainer.appendChild(commentList);
        commentListContainer.appendChild(commentDisplay);
        displayComments(commentDisplay, post.comments);
        
            
        publishButton.addEventListener("click", async function(event){
            const postId = event.currentTarget.id;
            try {
                const response = await fetch(`http://localhost:8000/api/story/${postId}/comments/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({ content: inputField.value }).toString(),
                });
                // console.log(response);
                const res = await response.json();
                console.log(res);
        


                // 서버에서 댓글 목록을 받아와 화면에 표시
                const comments = await fetchComments(postId);
                displayComments(comments);
                console.log(comments);

        
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        });
        
        // 서버에서 댓글 목록을 받아오는 함수
        async function fetchComments(postId) {
            const response = await fetch(`http://localhost:8000/api/story/${postId}/comments/`);
            const data = await response.json();
            return data;
        }
        
        // 서버 응답에서 댓글 목록을 받아와 화면에 표시하는 함수
        function displayComments(element, comments) {
            console.log(comments);
            // comment-display 엘리먼트를 선택

            // 기존에 표시된 내용을 지우고 새로운 댓글 목록을 표시
            // commentDisplay.innerHTML = '';
            comments.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.className = "comment-item";
                const commentItem1 = document.createElement('div');
                commentItem1.className="comment-content";
                commentItem1.textContent = comment.content;
                const commentItem2 = document.createElement('div');
                commentItem2.className="comment-username";
                commentItem2.textContent = comment.author.username;
                commentItem.appendChild(commentItem2);
                commentItem.appendChild(commentItem1);
                element.appendChild(commentItem);
                console.log(commentItem);
            });
        }
        // 로그인 확인 여부 코드 추가해야됨!
        // publishButton.addEventListener("click", function() {
        // alert("댓글을 작성하려면 로그인이 필요합니다");
        // });

        // 생성한 엘리먼트들을 부모 엘리먼트에 추가.
        commentAdd.appendChild(inputField);
        commentAdd.appendChild(publishButton);
        // detailBox에 추가
        detailBox.appendChild(header);
        detailBox.appendChild(content);
        detailBox.appendChild(scrollSection);
        detailBox.appendChild(iconsContainer);
        detailBox.appendChild(interactionContainer);
        detailBox.appendChild(commentListContainer);
        // detailBox.appendChild(commentAdd);
        
        
        // 나머지 요소들을 article에 추가
        article.appendChild(detailBox);
        article.appendChild(imgSection);
        article.appendChild(interactionContainer);
        // article.appendChild(commentContainer);
        article.appendChild(iconsContainer);
        article.appendChild(commentListContainer);
        // article.appendChild(commentAdd);
        // article을 postContainer에 추가
        contentsBox.appendChild(article);
        contentsBox.appendChild(commentAdd);
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }

};

export function clearFeedDetail() {
    document.querySelector(".contents_detail_box").replaceChildren();
}