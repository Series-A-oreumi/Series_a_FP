//배너
document.addEventListener("DOMContentLoaded", function () {
    let currentBanner = 1;
    const bannerCount = 2;
    const bannerContainer = document.querySelector(".banner-link");
    const bannerWidth = bannerContainer.clientWidth;
    const banners = bannerContainer.querySelectorAll(".banner-container");

    function nextBanner() {
        if (currentBanner < bannerCount) {
            currentBanner++;
        } else {
            currentBanner = 1;
        }
        moveBanners();
    }

    moveBanners();

    setInterval(nextBanner, 5000);

    function moveBanners() {
        const translateValue = -(currentBanner - 1) * bannerWidth;
        banners.forEach((banner, index) => {
            banner.style.transform = `translateX(${translateValue}px)`;
        });
    }
});

// 필터링-스터디, 프로젝트
// db연결 후 테스트 해야 함!
const studyCategories = document.querySelectorAll('.study-category');
const cards = document.querySelectorAll('.card');

studyCategories[0].classList.add('active');

studyCategories.forEach(category => {
    category.addEventListener('click', () => {
        studyCategories.forEach(tag => {
            tag.classList.remove('active');
        });

        category.classList.add('active');

        const selectedTag = category.querySelector('.study-category-text').textContent;

        cards.forEach(card => {
            card.style.display = 'none';
        });

        cards.forEach(card => {
            const cardTag = card.querySelector('.tag_list .top_tag .study-category-text').textContent;
            if (selectedTag === '전체' || selectedTag === cardTag) {
                card.style.display = 'block';
            }
        });
    });
});



// 메뉴 토글
const toggleBtns = document.querySelectorAll('.toggle-btn');
const toggleContainers = document.querySelectorAll('.toggle-container');
const isOpen = Array(toggleContainers.length).fill(false);

toggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', (event) => {
        event.stopPropagation();

        if (isOpen[index]) {
            toggleContainers[index].classList.remove('active');
        } else {
            toggleContainers.forEach((container) => {
                container.classList.remove('active');
            });
            toggleContainers[index].classList.add('active');
        }

        isOpen[index] = !isOpen[index];
    });
});

document.addEventListener('click', () => {
    toggleContainers.forEach((container, index) => {
        container.classList.remove('active');
        isOpen[index] = false;
    });
});

// 정렬
document.addEventListener("DOMContentLoaded", function () {
    const sortToggle = document.getElementById("sortToggle");
    const sortText = document.getElementById("sortText");
    const sortOptions = document.querySelectorAll("#sortContainer div");

    sortOptions.forEach((option) => {
        option.addEventListener("click", function () {
            sortText.textContent = option.textContent;

            sortOptions.forEach((opt) => opt.classList.remove("selected-sort"));
            option.classList.add("selected-sort");

            sortText.style.color = "rgb(0, 185, 174)";
            sortToggle.style.borderColor = "rgb(0, 185, 174)";
        });
    });
});

// 포지션
document.addEventListener("DOMContentLoaded", function () {
    const positionToggle = document.getElementById("positionToggle");
    const positionText = document.getElementById("positionText");
    const positionOptions = document.querySelectorAll("#positionContainer div");

    positionOptions.forEach((option) => {
        option.addEventListener("click", function () {
            positionText.textContent = option.textContent;

            positionOptions.forEach((opt) => opt.classList.remove("selected-position"));
            option.classList.add("selected-position");

            positionText.style.color = "rgb(0, 185, 174)";
            positionToggle.style.borderColor = "rgb(0, 185, 174)";
        });
    });
});

// 기술스택
document.addEventListener("DOMContentLoaded", function () {
    const stackToggleBtn = document.getElementById('stackToggle');
    const stackToggleContainer = document.getElementById('stackToggleContainer');
    const stackOptionButtons = stackToggleContainer.querySelectorAll(".sub-select-btn");
    const stackText = stackToggleBtn.querySelector('.sub-select-text');

    const selectedStacks = [];

    stackToggleBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (stackToggleContainer.classList.contains('active')) {
            stackToggleContainer.classList.remove('active');
        } else {
            stackToggleContainer.classList.add('active');
        }
    });

    document.addEventListener('click', (event) => {
        if (!stackToggleBtn.contains(event.target) && !stackToggleContainer.contains(event.target)) {
            stackToggleContainer.classList.remove('active');
        }
    });

    stackOptionButtons.forEach((option) => {
        option.addEventListener("click", function (e) {
            e.stopPropagation();
            const stackName = option.textContent;
            if (option.classList.contains("select-stack")) {
                const index = selectedStacks.indexOf(stackName);
                if (index !== -1) {
                    selectedStacks.splice(index, 1);
                }
                option.classList.remove("select-stack");
                option.style.borderColor = '';
            } else {
                selectedStacks.push(stackName);
                option.classList.add("select-stack");
                option.style.borderColor = 'rgb(0, 185, 174)';
            }

            stackText.textContent = selectedStacks.join(', ');

            if (selectedStacks.length === 0) {
                stackText.textContent = "기술 스택";
                stackToggleBtn.style.color = '';
                stackToggleBtn.style.borderColor = '';
            } else {
                stackToggleBtn.style.color = 'rgb(0, 185, 174)';
                stackToggleBtn.style.borderColor = 'rgb(0, 185, 174)';
            }
        });
    });
});




// api
const apiEndpoint = "http://localhost:8000/api/story/";

const heartBtn = document.getElementById("heartBtn");
const heartImage = document.getElementById("heartImage");

let isHearted = false;
if (isHearted) {
    heartImage.src = "Series_a_FP\frontend\imgs\study\pinkheart.png"; // 이미 하트를 누른 게시글인 경우
}

// 하트 버튼
heartBtn.addEventListener("click", () => {

    isHearted = !isHearted;

    if (isHearted) {
        heartImage.src = "Series_a_FP\frontend\imgs\study\pinkheart.png"; // 하트를 누른 경우
    } else {
        heartImage.src = "Series_a_FP\frontend\imgs\study\grayheart.png"; // 하트를 취소한 경우
    }
});


// 상단
function createCardTop(data) {
    let tagStudy = '';
    let tagProject = '';

    if (data.study) {
        tagStudy = `<div class="tag_study">🌠스터디</div>`;
    }

    if (data.project) {
        tagProject = `<div class="tag_project">🧪프로젝트</div>`;
    }

    const heartImageSrc = data.likes
        ? "Series_a_FP/frontend/imgs/study/pinkheart.png"
        : "Series_a_FP/frontend/imgs/study/grayheart.png";

    return `
        <div class="card_top">
            <div class="tag_list">
                <div class="top_tag">
                    ${tagStudy}
                    ${tagProject}
                </div>
                <div class="deadlineTag">${data.deadlineTag}</div>
            </div>
            <div class="heart_btn">
                <div class="sprite_heart_icon_outline">
                    <img src="${heartImageSrc}">
                </div>
            </div>
        </div>
    `;
}

// 중간
// post url 연결 필요
function createPostContent(data) {
    let stackTags = '';
    if (data.stacks && data.stacks.length > 0) {
        stackTags = `
            <div class="stack_tag">
                <ul>
                    ${data.stacks.map(stack => `
                        <li class="stack-icon">
                            <span class="stack-icon ${stack}">
                                <img src="Series_a_FP/frontend/imgs/study/${stack}_icon.png">
                            </span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    return `
        <a href="#">
            <div class="post_content">
                <div class="post_content_main">
                    <div class="deadline">마감일 | ${data.deadline}</div>
                    <div class="post_title">${data.post_title}</div>
                </div>
                <div class="post_content_tag">
                    <div class="position_tag">
                        <li class="position_tag_item">${data.field}</li>
                    </div>
                    ${stackTags}
                </div>
            </div>
        </a>
    `;
}

// 하단
// 유저 프로필 사진 변경해야 함
// 댓글 모델 확인 필요
// 유저 url 연결 필요
function createCardBottom(data) {

    const totalComments = data.comments.length;

    return `
        <div class="card_bottom study_border">
            <a href="#">
                <div class "user_container">
                    <div class="profile_img"><img src="${data.profile_img}"></div>
                    <div class="user_name">
                        <div class="nick_name m_text">${data.nick_name}</div>
                    </div>
                </div>
            </a>
            <div class="card_bottom_right">
                <div class="views_container">
                    <div class="views_icon"><img src="Series_a_FP/frontend/imgs/study/viewsicon.png"></div>
                    <div class="views">${data.views}</div>
                </div>
                <div class="conmment_container">
                    <div class="comment_icon"><img src="Series_a_FP/frontend/imgs/study/commenticon.png"></div>
                    <div class="comment">${totalComments}</div>
                </div>
            </div>
        </div>
    `;
}

// 'post' 생성
function createPost(data) {
    const innerContainer = document.querySelector(".inner");

    const postHTML = `
        <div class="contents_box">
            <div class="card">
                ${createCardTop(data)}
                ${createPostContent(data)}
                ${createCardBottom(data)}
            </div>
        </div>
    `;
    innerContainer.innerHTML += postHTML;
}

// API에서 데이터 가져오기
async function fetchDataFromAPI() {
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const postData = await response.json();

        createPost(postData);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDataFromAPI();


// test
// document.addEventListener("DOMContentLoaded", async function () {
//     try {
//         // const response = await fetch("http://localhost:8000/api/study/");
//         const response = await fetch("http://localhost:8000/api/story/");
//         const posts = await response.json();

//         const contentsBox = document.querySelector(".contents_box");

//         posts.forEach(post => {
//             const card = createCardElement(post);
//             contentsBox.appendChild(card);
//         });
//     } catch (error) {
//         console.error("데이터를 가져오는 중 오류 발생:", error);
//     }
// });

// function createCardElement(post) {
//     const card = document.createElement("div");
//     card.className = "card";

//     const cardTop = createCardTopElement(post);
//     const content = createContentElement(post);
//     const cardBottom = createCardBottomElement(post);

//     card.appendChild(cardTop);
//     card.appendChild(content);
//     card.appendChild(cardBottom);

//     return card;
// }

// function createCardTopElement(post) {
//     const cardTop = document.createElement("div");
//     cardTop.className = "card_top";


//     const topTag = document.createElement("div");
//     topTag.className = "top_tag";
//     const tagStudy = document.createElement("div");
//     tagStudy.className = "tag_study";
//     const tagProject = document.createElement("div");
//     tagProject.className = "tag_project";

//     topTag.appendChild(tagProject);
//     topTag.appendChild(tagStudy);

//     const deadlineTag = document.createElement("div");
//     deadlineTag.className = "tag_deadline";


//     const likeButton = document.createElement('div');
//     likeButton.className = 'sprite_heart_icon_outline';
//     likeButton.setAttribute('data-name', 'heartbeat');
//     likeButton.setAttribute('data-post-id', post.pk);
//     likeButton.addEventListener("click", async function () {
//         const postId = likeButton.getAttribute("data-post-id");

//         try {
//             const response = await fetch(`http://localhost:8000/api/story/liked/${postId}/`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.liked) {
//                     likeButton.classList.add("on");
//                 } else {
//                     likeButton.classList.remove("on");
//                 }
//             } else {
//                 console.error("좋아요 토글 중 오류 발생:", response.status);
//             }
//         } catch (error) {
//             console.error("좋아요 토글 중 오류 발생:", error);
//         }
//     });

//     const heartBtn = document.createElement('div');
//     heartBtn.className = 'heart_btn';
//     heartBtn.appendChild(likeButton);

//     cardTop.appendChild(topTag);
//     cardTop.appendChild(deadlineTag);
//     cardTop.appendChild(heartBtn);

//     return cardTop;
// }

// function createContentElement(post) {
//     const content = document.createElement("div");
//     content.className = "post_content";

//     const contentMain = document.createElement("div");
//     contentMain.className = "post_content_main";
//     const contentTag = document.createElement("div");
//     contentTag.className = "post_content_tag";

//     const deadline = document.createElement("div");
//     deadline.className = "deadline";
//     deadline.textContent = `마감일 | ${post.deadline}`;
//     const postTitle = document.createElement("div");
//     postTitle.className = "post_title";

//     contentMain.appendChild(deadline);
//     contentMain.appendChild(postTitle);


//     const positionTag = document.createElement("div");
//     positionTag.className = "position_tag";
//     positionTag.textContent = post.position;

//     const stackTag = document.createElement("div");
//     stackTag.className = "stack_tag";

//     contentTag.appendChild(positionTag);
//     contentTag.appendChild(stackTag);

//     content.appendChild(contentMain);
//     content.appendChild(contentTag);

//     return content;
// }

// function createCardBottomElement(post) {
//     const cardBottom = document.createElement("div");
//     cardBottom.className = "card_bottom";

//     const userContainer = document.createElement("div");
//     userContainer.className = "user_container";

//     const profileImg = document.createElement("div");
//     profileImg.className = "profile_img";
//     const img = document.createElement("img");
//     img.src = "/frontend/media/accounts/tiger/uAqIxqLO.jpg";
//     img.alt = "프로필 이미지";
//     profileImg.appendChild(img);
//     userContainer.appendChild(profileImg);

//     const userName = document.createElement("div");
//     userName.className = "user_name";
//     const nickName = document.createElement("div");
//     nickName.className = "nick_name m_text";
//     nickName.textContent = post.author.username;
//     userName.appendChild(nickName);

//     cardBottom.appendChild(userContainer);
//     cardBottom.appendChild(userName);

//     const cardBtRightDiv = document.createElement("div");
//     cardBtRightDiv.className = "card_bottom_right";

//     const viewsDiv = document.createElement("div");
//     viewsDiv.className = "views_container";

//     const viewsIcon = document.createElement('div');
//     viewsIcon.className = "views_icon";
//     const viewimg = document.createElement("img");
//     viewimg.src = "/frontend/imgs/study/viewsicon.png";
//     const views = document.createElement('div');
//     views.className = "views";
//     views.textContent = post.views_count;

//     viewsIcon.appendChild(viewimg);
//     viewsDiv.appendChild(viewsIcon);
//     viewsDiv.appendChild(views);

//     const commentDiv = document.createElement("div");
//     commentDiv.className = "comment_container";

//     const commentIcon = document.createElement('div');
//     commentIcon.className = "comment_icon";
//     const commentimg = document.createElement("img");
//     commentimg.src = "/frontend/imgs/study/commenticon.png";
//     const comment = document.createElement('div');
//     comment.className = "comment";
//     comment.textContent = post.comments_count;

//     commentIcon.appendChild(commentimg);
//     commentDiv.appendChild(commentIcon);
//     commentDiv.appendChild(comment);

//     cardBtRightDiv.appendChild(viewsDiv);
//     cardBtRightDiv.appendChild(commentDiv);

//     cardBottom.appendChild(cardBtRightDiv);

//     return cardBottom;
// }
