// 필터링
// 스터디, 프로젝트
document.addEventListener("DOMContentLoaded", function () {
    const studyCategories = document.querySelectorAll('.study-category');

    studyCategories[0].classList.add('active');

    studyCategories.forEach(category => {
        category.addEventListener('click', () => {
            studyCategories.forEach(tag => {
                tag.classList.remove('active');
            });
            category.classList.add('active');
        });
    });
});

// 테스트
document.addEventListener("DOMContentLoaded", function () {
    const studyCategory = document.getElementById("studyCategory");
    const projectCategory = document.getElementById("projectCategory");
    const allCategory = document.getElementById("allCategory");
    const contentBoxes = document.querySelectorAll(".contents_box");

    projectCategory.addEventListener("click", function () { // 프로젝트를 눌렀을 때
        contentBoxes.forEach(contentBox => { //아래 항목들 - 나누기
            const tagStudy = contentBox.querySelector(".tag_study");
            if (tagStudy) {
                contentBox.style.display = "block";
            } else {
                contentBox.style.display = "none";
            }
        });
    });

    studyCategory.addEventListener("click", function () {
        contentBoxes.forEach(contentBox => {
            const tagProject = contentBox.querySelector(".tag_project");
            if (tagProject) {
                contentBox.style.display = "block";
            } else {
                contentBox.style.display = "none";
            }
        });
    });

    allCategory.addEventListener("click", function () {
        contentBoxes.forEach(contentBox => {
            contentBox.style.display = "block";
        });
    });
});





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
// 상단
function createCardTop(request_user, data) {
    let tagStudy = '';
    let tagProject = '';
    let deadlineTag = '';

    if (data.project_study === 'study') {
        tagStudy = `<div class="tag_study">🌠스터디</div>`;
    } else {
        tagProject = `<div class="tag_project">🧪프로젝트</div>`;
    }

    const currentTime = new Date();
    const endAtTime = new Date(data.end_at);
    const timeDifference = endAtTime - currentTime;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    if (timeDifference < oneDayInMilliseconds && timeDifference >= 0) {
        // 마감일이 오늘
        deadlineTag = `<div class="deadlineTag">🔥마감코앞</div>`;
    } else if (timeDifference < oneDayInMilliseconds * 10 && timeDifference >= oneDayInMilliseconds) {
        // 마감일이 10일 이내
        const daysLeft = Math.floor(timeDifference / oneDayInMilliseconds);
        deadlineTag = `<div class="deadlineTag">마감 ${daysLeft}일전</div>`;
    }


    const loggedInUser = request_user.username;
    const isUserLiked = data.likes_users && data.likes_users.includes(loggedInUser);
    const heartImageSrc = isUserLiked
        ? "../imgs/study/pinkheart.png"
        : "../imgs/study/grayheart.png";

    return `
        <div class="card_top">
            <div class="tag_list">
                <div class="top_tag">
                    ${tagStudy}
                    ${tagProject}
                </div>
                ${deadlineTag}
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
function createPostContent(data) {
    const endAt = data.end_at;
    const formattedEndDate = formatDate(endAt);
    const studyDetailURL = `../html/studyDetail.html?id=${data.pk}`;

    let stackTags = '';
    if (data.stacks && data.stacks.length > 0) {
        stackTags = `
            <div class="stack_tag">
                <ul>
                    ${data.stacks.map(stack => `
                        <li class="stack-icon">
                            <span class="stack-icon ${stack.name}">
                                <img src="../imgs/study/${stack.name}_icon.png">
                            </span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    return `
        <a href="${studyDetailURL}">
            <div class="post_content" id="postContent">
                <div class="post_content_main">
                    <div class="deadline">마감일 | ${formattedEndDate}</div>
                    <div class="post_title">${data.title}</div>
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

// 날짜 형식 변경 함수
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('Kr', options);
    return formattedDate.replace(/\//g, '.');
}


// 하단
// 유저 url 경로 확인하기
function createCardBottom(data) {

    const totalComments = data.comments_count;
    const userProfileURL = `../html/profile.html?id=${data.id}`;


    return `
        <div class="card_bottom study_border">
            <a href="${userProfileURL}">
                <div class "user_container">
                    <div class="user_name">
                        <div class="user-name-text">${data.author.username}</div>
                        <div class="email-text">${data.author.email}</div>
                    </div>
                </div>
            </a>
            <div class="card_bottom_right">
                <div class="views_container">
                    <div class="views_icon">
                        <img src="../imgs/study/viewsicon.png">
                        
                    </div>
                    <div class="views">${data.views}</div>
                </div>
                <div class="conmment_container">
                    <div class="comment_icon"><img src="../imgs/study/commenticon.png"></div>
                    <div class="comment">${totalComments}</div>
                </div>
            </div>
        </div>
    `;
}

// 'post' 생성
function createPost(request_user, data) {
    const innerContainer = document.querySelector(".inner");
    const postHTML = `
        <div class="contents_box" id="contentBox">
            <div class="card">
                ${createCardTop(request_user, data)}
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

        const responseData = await response.json();
        const { request_user, studylist } = responseData;

        const postDataArray = studylist;

        postDataArray.forEach(data => {
            createPost(request_user, data);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDataFromAPI();


// 좋아요 보내기
async function toggleLike(studyId) {
    try {
        const accessToken = localStorage.getItem('access_token');
        const apiEndpoint = `http://localhost:8000/api/study/liked/${studyId}/`;
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        const response = await fetch(apiEndpoint, options);

        if (!response.ok) {
            throw new Error('Failed to toggle like');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}