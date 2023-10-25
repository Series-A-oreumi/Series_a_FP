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
            toggleContainers.forEach((container, i) => {
                if (i !== index) {
                    container.classList.remove('active');
                    isOpen[i] = false;
                }
            });
            toggleContainers[index].classList.add('active');
        }

        isOpen[index] = !isOpen[index];
    });
});

// 다른 토글 버튼 클릭 시 기술스택 컨테이너 닫기
toggleBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        stackToggleContainer.classList.remove('active');
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
    const accessToken = localStorage.getItem('access_token');
    const apiEndpoint = "http://localhost:8000/api/study/";

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const postData = await response.json();

        createDetaile(postData);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDataFromAPI();