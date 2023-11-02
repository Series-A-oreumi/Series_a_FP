// 시간 포맷 함수를 사용하여 시간을 포맷
import { formatTimeAgo } from "./format.js"
import { clearFeedDetail, feedDetail } from "./feedDetail.js";
import { UserInfo } from "./jwtUserId.js"

// 페이지 로딩이 완료되면 실행됩니다.
document.addEventListener("DOMContentLoaded", async function () {

    // 로컬 스토리지에서 access_token 가져오기
    const accessToken = localStorage.getItem('access_token');

    try {
        const response = await // Fetch 요청 보내기
            fetch("http://localhost:8000/api/story/", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // access_token을 헤더에 추가
                    'Content-Type': 'application/json'
                },
            });

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
            const profileLink = document.createElement('a'); // 삭제하기 꼭 (테스트 추가한 부분)
            profileLink.href = `../html/profile.html?id=${post.author.id}`; // 삭제하기 꼭 (테스트 추가한 부분)

            const profileImg = document.createElement("div");
            profileImg.className = "profile_img";
            const img = document.createElement("img");
            img.src = "../imgs/common/profile.png";
            // img.src = post.author.profile.picture.url; (현재 프로필 이미지를 따로 만들어두지 않아서 일단 기본으로 하고 추후 변경예정!)
            img.alt = "프로필 이미지";
            profileImg.appendChild(img);
            profileLink.appendChild(profileImg); // 삭제하기 꼭 (테스트 추가한 부분)
            userContainer.appendChild(profileLink); // 변경하기 꼭 (테스트 추가한 부분)


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

            //모달 게시물 헤더
            const postOwner = document.createElement("div");
            postOwner.textContent = `${post.author.username} 님의 게시물`;  // 여기서 username을 사용하고 있습니다. 실제로 사용하는 데이터 필드로 변경해주세요.
            postOwner.className = "post_owner";

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
            userContainer.appendChild(postOwner);
            userName.appendChild(nickName);
            userContainer.appendChild(userName);
            const modalTitleCenter = document.querySelector(".modal_title_center");
            modalTitleCenter.innerHTML = ""; // 기존에 있던 내용을 비워줍니다.
            modalTitleCenter.appendChild(postOwner);

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
            // image.src = post.images[0].images.url;
            image.alt = "피드이미지";


            imgdiv.appendChild(image)
            postImg.appendChild(imgdiv)
            imgSection.appendChild(postImg)

            image.addEventListener("click", function () {
                // 이미 모달이 열려있는지 확인
                const isModalOpen = document.getElementById("modal_add_feed").style.display === "flex";

                if (!isModalOpen) {
                    // 모달을 열도록 설정
                    const modal = document.getElementById("modal_add_feed");
                    modal.style.top = window.scrollY + 'px';
                    modal.style.display = "flex";
                    document.body.style.overflowY = "hidden";

                    //모달 처리 코드 작성
                    feedDetail(post.pk);
                    // contentsBox.appendChild(image);


                    // 모달 닫기 코드
                    const buttonCloseModal = document.getElementById("close_modal");
                    buttonCloseModal.addEventListener("click", e => {
                        modal.style.display = "none";
                        document.body.style.overflowY = "visible";
                        clearFeedDetail();
                        // 리프레시
                        window.location.reload();
                    });

                    // 빈 화면 클릭하여 모달 닫기
                    const modalOverlay = document.querySelector(".modal_overlay");
                    modalOverlay.addEventListener("click", e => {
                        if (e.target === modalOverlay) {
                            modal.style.display = "none";
                            document.body.style.overflowY = "visible";
                            clearFeedDetail();
                            //리프레시
                            window.location.reload();
                        }
                    });
                }
            });


            // 좋아요 버튼을 선택하고 클릭 이벤트를 처리
            const likeButton = document.createElement('div');

            // 현재 로그인 한 유저
            const loggedInUserId = UserInfo(accessToken).userId

            const isUserLiked = Array.isArray(post.likes_users) && post.likes_users.includes(loggedInUserId) ? true : false;
            
            // 로그인 한 유저가 해당 게시물에 대해서 좋아요를 눌렀다면 on, 좋아요를 누르지 않았다면 '' 되도록 바꿔주기 (post.likes_user) -> 해당 게시물에 대해 좋아요를 누른 유저목록
            likeButton.className = `sprite_heart_icon_outline  ${isUserLiked ? 'on' : ''}`;
            likeButton.setAttribute('data-name', 'heartbeat');
            likeButton.setAttribute('data-post-id', post.pk);
            likeButton.addEventListener("click", async function () {
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
                        console.log(isUserLiked)
                        // 좋아요 상태를 서버에서 업데이트한 후에는 해당 버튼의 상태를 변경합니다.
                        if (response.status === 201) {
                            likeButton.classList.add("on");
                        } else if (response.status === 200) {
                            likeButton.classList.remove("on");
                        }

                        // 업데이트된 좋아요 개수를 UI에 반영
                        const likesCountResponse = await response.json();
                        const updatedLikesCount = likesCountResponse.likes_count;
                        likeCountSpan.textContent = `좋아요 ${updatedLikesCount}개`;
                    } else {
                        console.error("Error toggling like:", response.status);
                    }
                } catch (error) {
                    console.error("Error toggling like:", error);
                }
            });

            // 좋아요 개수 추가
            const likeCountSpan = document.createElement('span')
            // id 속성을 추가합니다.
            likeCountSpan.id = `like-count-${post.pk}`;
            likeCountSpan.textContent = `좋아요 ${post.likes_count}개`;
            const likeText = document.createElement('div');
            likeText.id = `like-Text-${post.pk}`;
            likeText.className = `likes m_text`;

            likeText.appendChild(likeCountSpan);

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

            //댓글 아이콘 클릭시 모달창 열림
            commentDiv.addEventListener("click", function () {
                // 이미 모달이 열려있는지 확인
                console.log("CommentDiv 클릭됨!");
                const isModalOpen = document.getElementById("modal_add_feed").style.display === "flex";

                if (!isModalOpen) {
                    // 모달을 열도록 설정
                    const modal = document.getElementById("modal_add_feed");
                    modal.style.top = window.scrollY + 'px';
                    modal.style.display = "flex";
                    document.body.style.overflowY = "hidden";

                    //모달 처리 코드 작성
                    feedDetail(post.pk);
                    // contentsBox.appendChild(image);


                    // 모달 닫기 코드
                    const buttonCloseModal = document.getElementById("close_modal");
                    buttonCloseModal.addEventListener("click", e => {
                        modal.style.display = "none";
                        document.body.style.overflowY = "visible";
                        clearFeedDetail();
                        // 리프레시
                        window.location.reload();
                    });

                    // 빈 화면 클릭하여 모달 닫기
                    const modalOverlay = document.querySelector(".modal_overlay");
                    modalOverlay.addEventListener("click", e => {
                        if (e.target === modalOverlay) {
                            modal.style.display = "none";
                            document.body.style.overflowY = "visible";
                            clearFeedDetail();
                            //리프레시
                            window.location.reload();
                        }
                    });
                }
            });

            // a 엘리먼트를 생성하고 href 속성을 설정.
            const aElement = document.createElement("a");
            aElement.href = "#";

            // div 엘리먼트를 a 엘리먼트의 자식으로 추가합니다.
            aElement.appendChild(commentDiv);

            heartBtn.appendChild(likeButton);
            leftIcons.appendChild(heartBtn);
            leftIcons.appendChild(aElement);
            bottomIcons.appendChild(leftIcons);




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

                //모달 처리 코드 작성
                feedDetail(post.pk);

                // 모달이 열린 후에 inputField에 focus 설정
                setTimeout(() => {
                    inputField.focus();
                }, 100);

                // 모달 닫기 코드
                const buttonCloseModal = document.getElementById("close_modal");
                buttonCloseModal.addEventListener("click", e => {
                    modal.style.display = "none";
                    document.body.style.overflowY = "visible";
                    clearFeedDetail();
                    // 리프레시
                    window.location.reload();
                });

                // 빈 화면 클릭하여 모달 닫기
                const modalOverlay = document.querySelector(".modal_overlay");
                modalOverlay.addEventListener("click", e => {
                    if (e.target === modalOverlay) {
                        modal.style.display = "none";
                        document.body.style.overflowY = "visible";
                        clearFeedDetail();
                        // 리프레시
                        window.location.reload();
                    }
                });
            });

            comment.id = `comment-all-${post.pk}`;
            commentContainer.appendChild(comment);

            // 부모 엘리먼트를 선택하거나 생성합니다.
            const commentAdd = document.createElement("div"); // 예시로 div 엘리먼트를 생성합니다.
            commentAdd.className = "comment_field";
            commentAdd.id = `${post.pk}`; // 원하는 ID를 설정합니다.

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
            publishButton.id = `${post.pk}`


            // comment-display 엘리먼트를 생성
            const commentDisplay = document.createElement("div");
            commentDisplay.className = "comment-display";
            displayComments(commentDisplay, post.comments);
            // 나머지 코드는 이전과 동일하게 유지

            publishButton.addEventListener("click", async function (event) {
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

                    // 서버에서 댓글 목록을 받아와 화면에 표시
                    // const comments = await fetchComments(postId);
                    // console.log(comments);
                    // displayComments(comments);
                    commentDisplay.innerHTML = '';
                    addcomment(commentDisplay,inputField.value,post.author.username,postId);
                    inputField.value='';



            
                } catch (error) {
                    console.error('Error adding comment:', error);
                }
            });

            // 서버에서 댓글 목록을 받아오는 함수
            async function fetchComments(postId) {
                try {
                    const response = await fetch(`http://localhost:8000/api/story/${postId}/commentlist/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
            
                    const dataArray = Object.values(data);
            
                    // 최신순으로 정렬
                    const sortedComments = dataArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    console.log(sortedComments);
                    // 최신 댓글 하나만 가져오기
                    const latestComment = sortedComments.length > 0 ? sortedComments[sortedComments.length - 1] : null;
            
                    return latestComment ? [latestComment] : [];
                } catch (error) {
                    console.error('Error fetching comments:', error);
                    return [];
                }
            }
            
            // 서버 응답에서 댓글 목록을 받아와 화면에 표시하는 함수
            function displayComments(element, comments) {
                console.log(comments);
                // comment-display 엘리먼트를 선택

                // 기존에 표시된 내용을 지우고 새로운 댓글 목록을 표시
                // commentDisplay.innerHTML = '';
                
                    // 최신순으로 정렬
                const sortedComments = comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                if (comments.length > 0) {
                    const latestComment = sortedComments[0]; // 최신 댓글 하나만 가져옴

                const commentItem = document.createElement('div');
                commentItem.className = "comment-item";
                const commentItem1 = document.createElement('div');
                commentItem1.className="comment-content";
                commentItem1.textContent = latestComment.content;
                const commentItem2 = document.createElement('div');
                commentItem2.className="comment-username";
                commentItem2.textContent = latestComment.author.username;
                commentItem.appendChild(commentItem2);
                commentItem.appendChild(commentItem1);
                element.appendChild(commentItem);
                    console.log(commentItem);
                }
            }

            function addcomment(element,comment, username,postId){
                const commentcount=document.getElementById(`comment-all-${postId}`);
                let commentinner=commentcount.innerHTML;
                const regex = /[^0-9]/g;
                const result = commentinner.replace(regex, "");
                const number = parseInt(result);

                commentcount.innerHTML = `댓글 ${number+1}개 모두보기`;


                const commentItem = document.createElement('div');
                commentItem.className = "comment-item";
                const commentItem1 = document.createElement('div');
                commentItem1.className="comment-content";
                commentItem1.textContent = comment;
                const commentItem2 = document.createElement('div');
                commentItem2.className="comment-username";
                commentItem2.textContent = username;
                commentItem.appendChild(commentItem2);
                commentItem.appendChild(commentItem1);
                element.appendChild(commentItem);
            }


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
            article.appendChild(commentDisplay);
            article.appendChild(commentAdd);

            // article을 postContainer에 추가
            contentsBox.appendChild(article);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }


});

