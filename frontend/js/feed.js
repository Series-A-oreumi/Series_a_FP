// 시간 포맷 함수를 사용하여 시간을 포맷
import { formatTimeAgo } from "./format.js" 


// 페이지 로딩이 완료되면 실행됩니다.
document.addEventListener("DOMContentLoaded", async function () {
    // const postContainer = document.getElementById("main_container");
    try {
        // 백엔드 API에서 포스트 데이터를 가져옵니다.
        const response = await fetch("http://localhost:8000/api/story/");
        const posts = await response.json();

        // 포스트 데이터를 동적으로 화면에 추가합니다.
        posts.forEach(post => {
            console.log(post)
            const contentsBox = document.querySelector(".contents_box");
            const article = document.createElement("article");
            article.className = "contents";
        
            // 포스트 헤더를 추가 (프로필 이미지, 사용자 이름 등)
            const header = document.createElement("header");
            header.className = "top";
            
            const userContainer = document.createElement("div");
            userContainer.className = "user_container";
            // 프로필 이미지 추가
            const profileImg = document.createElement("div");
            profileImg.className = "profile_img";
            const img = document.createElement("img");
            img.src = "../imgs/common/profile.png";
            // img.src = post.author.profile.picture.url; (현재 프로필 이미지를 따로 만들어두지 않아서 일단 기본으로 하고 추후 변경예정!)
            img.alt = "프로필 이미지";
            profileImg.appendChild(img);
            userContainer.appendChild(profileImg);
    
            header.appendChild(userContainer);
        
            // 사용자 이름 및 국가 추가
            const userName = document.createElement("div");
            userName.className = "user_name";
            const nickName = document.createElement("div");
            nickName.className = "nick_name m_text";
            
            const postTime = formatTimeAgo(`${post.created_at}`);
            
            // 사용자 이름 설정 및 스타일 지정
            const usernameSpan = document.createElement("span");
            usernameSpan.textContent = post.author.username;
            usernameSpan.style.color = "black";  // 사용자 이름의 글자색을 여기에 지정
            
            // postTime 설정 및 스타일 지정
            const postTimeSpan = document.createElement("span");
            postTimeSpan.textContent = ` • ${postTime}`;
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
            // 포스트 내용 추가
            const content = document.createElement("div");
            content.className = "content";
            content.textContent = post.content; // 포스트 내용을 여기에 추가

            // 포스트 이미지 추가
            const imgSection = document.createElement('div');
            imgSection.className = "img_section";

            const postImg = document.createElement('div');
            postImg.className = "trans_inner";   
            const imgdiv = document.createElement('div');
            const image = document.createElement("img");
            // 사진도 일단 예시로만 
            image.src = "/frontend/media/post/2020/05/08/tiger/김치찌개.png"
            image.alt = "피드이미지";

            imgdiv.appendChild(image)
            postImg.appendChild(imgdiv)
            imgSection.appendChild(postImg)
    
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
            commentDiv.className = "sprite_bubble_icon";

            // a 엘리먼트를 생성하고 href 속성을 설정.
            const aElement = document.createElement("a");
            aElement.href = "#";

            // div 엘리먼트를 a 엘리먼트의 자식으로 추가합니다.
            aElement.appendChild(commentDiv);

            heartBtn.appendChild(likeButton);
            leftIcons.appendChild(heartBtn);
            leftIcons.appendChild(aElement);
            bottomIcons.appendChild(leftIcons);

            // 좋아요 개수 추가
            const likeCountSpan = document.createElement('span')
            // id 속성을 추가합니다.
            likeCountSpan.id = `like-count-${post.pk}`;
            likeCountSpan.textContent = `좋아요 ${post.likes_count}개`;
            const likeText = document.createElement('div');
            likeText.className = `likes m_text`;
            
            likeText.appendChild(likeCountSpan);

        
            // 댓글 개수 표시
            const commentContainer = document.createElement('div')
            commentContainer.className = "comment_container";
            const comment = document.createElement('div')
            comment.className = "comment";
            
            // 댓글 개수를 표시합니다.
            comment.textContent = `댓글 ${post.comments_count}개 모두보기`;
            comment.addEventListener('click', function () {             
                // 모달을 열도록 설정
                const modal = document.getElementById("modal_add_feed");
                modal.style.top = window.scrollY + 'px'; 
                modal.style.display = "flex";
                document.body.style.overflowY = "hidden";

                // 모달 닫기 코드
                const buttonCloseModal = document.getElementById("close_modal");
                buttonCloseModal.addEventListener("click", e => {
                    modal.style.display = "none";
                    document.body.style.overflowY = "visible";
                });
            });

            comment.id = `comment-all-${post.pk}`;
            commentContainer.appendChild(comment);

            // 부모 엘리먼트를 선택하거나 생성합니다.
            const commentAdd = document.createElement("div"); // 예시로 div 엘리먼트를 생성합니다.
            commentAdd.className = "comment_field";
            commentAdd.id = "add-comment-post8"; // 원하는 ID를 설정합니다.

            // "댓글 달기" 입력 필드 생성
            const inputField = document.createElement("input");
            inputField.type = "text";
            inputField.name = "content";
            inputField.className = "comment-form";
            inputField.size = "70";
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

            // 나머지 요소들을 article에 추가
            article.appendChild(header);
            article.appendChild(content);
            article.appendChild(imgSection);
            article.appendChild(bottomIcons);
            article.appendChild(likeText);
            article.appendChild(commentContainer);
            article.appendChild(commentAdd);
        
            // article을 postContainer에 추가
            contentsBox.appendChild(article);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
    
});


