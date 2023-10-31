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

// 정렬 토글
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

// 포지션 토글
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



// 하나만 선택 가능 버전
document.addEventListener("DOMContentLoaded", function () {
    const stackToggleBtn = document.getElementById('stackToggle');
    const stackToggleContainer = document.getElementById('stackToggleContainer');
    const stackOptionButtons = stackToggleContainer.querySelectorAll(".sub-select-btn");
    const stackText = stackToggleBtn.querySelector('.sub-select-text');

    let selectedStack = null;

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

            if (stackName === selectedStack) {
                selectedStack = null;
            } else {
                selectedStack = stackName;
            }

            stackOptionButtons.forEach((btn) => {
                if (btn.textContent === selectedStack) {
                    btn.classList.add("select-stack");
                    btn.style.borderColor = 'rgb(0, 185, 174)';
                } else {
                    btn.classList.remove("select-stack");
                    btn.style.borderColor = '';
                }
            });

            stackText.textContent = selectedStack ? selectedStack : "기술 스택";

            if (selectedStack) {
                stackToggleBtn.style.color = 'rgb(0, 185, 174)';
                stackToggleBtn.style.borderColor = 'rgb(0, 185, 174)';
            } else {
                stackToggleBtn.style.color = '';
                stackToggleBtn.style.borderColor = '';
            }
        });
    });
});





// api
// 상단
function createCardTop(request_user, data) {
    let tagStudy = '';
    let deadlineTag = '';

    if (data.project_study === 'study') {
        tagStudy = `<div class="tag_study">🌠스터디</div>`;
    } else {
        tagStudy = `<div class="tag_project">🧪프로젝트</div>`;
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

    console.log(data)
    const loggedInUser = request_user.username;
    const isUserLiked = data.likes_users && data.likes_users.includes(loggedInUser);
    const heartImageSrc = isUserLiked
        ? "../imgs/study/pinkheart.png"
        : "../imgs/study/grayheart.png";

    return `
        <div class="card_top" data-study-id="${data.pk}">
        
            <div class="tag_list">
                <div class="top_tag">
                    ${tagStudy}
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
                        <li class="position_tag_item ${data.field}">${data.field}</li>
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

function createLikes(request_user, data) {
    const heartBtn = document.querySelector(".heart_btn");
    heartBtn.addEventListener("click", () => toggleLike(data.pk));
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


function sendLikes(data) {

}



//좋아요 보내기
// 좋아요 버튼 클릭 이벤트 핸들러
document.addEventListener('click', async function (event) {
    const LikesButton = event.target.closest('.heart_btn');

    if (LikesButton) {
        const likeButton = LikesButton.querySelector('img');
        const currentImageSrc = likeButton.src;
        const studyElement = LikesButton.closest('.card_top');
        const studyId = studyElement.dataset.studyId;
        const accessToken = localStorage.getItem('access_token');
        const apiEndpoint = `http://localhost:8000/api/study/liked/${studyId}/`;

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await fetch(apiEndpoint, options);
            if (response.ok) {
                if (currentImageSrc.includes('pinkheart.png')) {
                    likeButton.src = '../imgs/study/grayheart.png';
                } else {
                    likeButton.src = '../imgs/study/pinkheart.png';
                }
            } else {
                // 좋아요 요청 실패 처리
                console.error('Failed to update comment:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});





// 필터
// 필터 - 스터디, 프로젝트
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

function filterStudy(filterType) {
    const contentBoxes = document.querySelectorAll(".contents_box");

    contentBoxes.forEach(contentBox => {
        const tagStudy = contentBox.querySelector(".tag_study");
        const tagProject = contentBox.querySelector(".tag_project");

        if (filterType === "all") {
            contentBox.classList.remove("filtered");
        } else if (filterType === "study") {
            if (tagStudy) {
                contentBox.classList.remove("filtered");
            } else {
                contentBox.classList.add("filtered");
            }
        } else if (filterType === "project") {
            if (tagProject) {
                contentBox.classList.remove("filtered");
            } else {
                contentBox.classList.add("filtered");
            }
        }
    });
}
const studyCategory = document.getElementById("studyCategory");
const projectCategory = document.getElementById("projectCategory");
const allCategory = document.getElementById("allCategory");

studyCategory.addEventListener("click", () => filterStudy("study"));
projectCategory.addEventListener("click", () => filterStudy("project"));
allCategory.addEventListener("click", () => filterStudy("all"));


// 필터 - 정렬
function filterSort(sortType) {
    const contentBoxes = Array.from(document.querySelectorAll(".contents_box"));

    contentBoxes.forEach(contentBox => {
        if (sortType === "latest") {
            contentBox.style.order = 'initial';
        } else if (sortType === "popularity") {
            const views = parseInt(contentBox.querySelector(".views").textContent);
            contentBox.style.order = -views;
        } else if (sortType === "deadline") {
            const deadlineText = contentBox.querySelector(".deadline").textContent;
            const datePattern = /\d+/g;
            const matchResult = deadlineText.match(datePattern);
            const extractedNumber = matchResult.join('');
            contentBox.style.order = extractedNumber;
        }
    });

    const sortedContentBoxes = contentBoxes.sort((a, b) => {
        return a.style.order - b.style.order;
    });

    const contentsContainer = document.querySelector(".contents-container");
    sortedContentBoxes.forEach(contentBox => {
        contentsContainer.appendChild(contentBox);
    });
}

const Latest = document.getElementById("latest");
const Popularity = document.getElementById("popularity");
const Deadline = document.getElementById("deadLine");

Latest.addEventListener("click", () => filterSort("latest"));
Popularity.addEventListener("click", () => filterSort("popularity"));
Deadline.addEventListener("click", () => filterSort("deadline"));


// 필터 - 포지션
function filterPosition(filterType) {
    const contentBoxes = document.querySelectorAll(".contents_box");

    contentBoxes.forEach(contentBox => {
        const Pfrontend = contentBox.querySelector(".frontend");
        const Pbackend = contentBox.querySelector(".backend");
        const Pdevops = contentBox.querySelector(".devops");
        const Pdesigner = contentBox.querySelector(".design");

        if (filterType === "all") {
            contentBox.style.display = "block"; // 전체 표시
        } else if (filterType === "frontend") {
            if (Pfrontend) {
                contentBox.style.display = "block";
            } else {
                contentBox.style.display = "none";
            }
        } else if (filterType === "backend") {
            if (Pbackend) {
                contentBox.style.display = "block";
            } else {
                contentBox.style.display = "none";
            }
        } else if (filterType === "devops") {
            if (Pdevops) {
                contentBox.style.display = "block";
            } else {
                contentBox.style.display = "none";
            }
        } else if (filterType === "designer") {
            if (Pdesigner) {
                contentBox.style.display = "block";
            } else {
                contentBox.style.display = "none";
            }
        }
    });
}

const allPosition = document.getElementById("all");
const frontend = document.getElementById("frontend");
const backend = document.getElementById("backend");
const devops = document.getElementById("devops");
const designer = document.getElementById("designer");

designer.addEventListener("click", () => filterPosition("designer"));
devops.addEventListener("click", () => filterPosition("devops"));
backend.addEventListener("click", () => filterPosition("backend"));
frontend.addEventListener("click", () => filterPosition("frontend"));
allPosition.addEventListener("click", () => filterPosition("all"));


// 필터 - 기술 스택 - 하나만 선택 가능
const selectedStacks = [];

function filterStack(filterType) {
    const contentBoxes = document.querySelectorAll(".contents_box");

    const isStackSelected = selectedStacks.includes(filterType);

    contentBoxes.forEach(contentBox => {
        const stackElements = contentBox.querySelectorAll(`.${filterType}`);

        if (isStackSelected) {
            contentBox.style.display = "block";
        } else if (stackElements.length > 0) {
            contentBox.style.display = "block";
        } else {
            contentBox.style.display = "none";
        }
    });

    // 스택 선택 토글
    if (isStackSelected) {
        // 이미 선택된 스택을 다시 클릭하면 선택 취소
        const stackIndex = selectedStacks.indexOf(filterType);
        if (stackIndex !== -1) {
            selectedStacks.splice(stackIndex, 1);
        }
    } else {
        // 이미 다른 스택이 선택되어 있으면 기존 스택 선택 취소
        if (selectedStacks.length > 0) {
            const prevStack = selectedStacks.pop();
            const prevStackElements = document.querySelectorAll(`.${prevStack}`);
            prevStackElements.forEach(element => {
                element.classList.remove("select-stack");
            });
        }
        selectedStacks.push(filterType);
    }
}
const python = document.getElementById("Python");
const java = document.getElementById("Java");
const javascript = document.getElementById("Javascript");
const spring = document.getElementById("Spring");
const react = document.getElementById("React");
const django = document.getElementById("Django");

python.addEventListener("click", () => filterStack("python"));
java.addEventListener("click", () => filterStack("java"));
javascript.addEventListener("click", () => filterStack("javascript"));
spring.addEventListener("click", () => filterStack("spring"));
react.addEventListener("click", () => filterStack("react"));
django.addEventListener("click", () => filterStack("django"));



// 필터 - 검색
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const searchText = searchInput.value.toLowerCase();
        const contentBoxes = document.querySelectorAll(".contents_box");

        contentBoxes.forEach(contentBox => {
            const title = contentBox.querySelector(".post_title").textContent.toLowerCase();
            const content = contentBox.querySelector(".post_content_main").textContent.toLowerCase();
            const name = contentBox.querySelector(".user-name-text").textContent.toLowerCase();

            if (title.includes(searchText) || content.includes(searchText) || name.includes(searchText)) {
                contentBox.style.display = "block";
            } else {
                contentBox.style.display = "none";
            }
        });
    }
});

