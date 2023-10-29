// 날짜 형식 변경 함수
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('Kr', options);
    return formattedDate.replace(/\//g, '.');
}


// 제목 ,유저
// 유저 아이콘 데이터이름 확인 필요
function createDetailSection1(data) {
    const createAt = data.created_at
    const formattedEndDate = formatDate(createAt);
    const userProfileURL = `../html/profile.html?id=${data.author}`;

    return `
        <div class="title">${data.title}</div>
        <div class="user-section">
            <a href="${userProfileURL}">
                <div class="user-icon">
                    ${data.author.profile_img}
                </div>
                <div class="user-section-inner">
                    <div class="user-title">${data.author.username}</div>
                    <div class="email-text">👥 ${data.author.email}</div>
                </div>
            </a>
            <div class="created_at">|</div>
            <div class="created_at">${formattedEndDate}</div>
        </div>
    `;
}

//포스트

// const heartImageSrc = data.likes
//     ? "Series_a_FP/frontend/imgs/study/pinkheart.png"
//     : "Series_a_FP/frontend/imgs/study/grayheart.png";


function likesTrue(study, data) {
    const loggedInUser = study.username;
    const isUserLiked = data.likes_users && data.likes_users.includes(loggedInUser);
    const heartImageSrc = isUserLiked
        ? "../imgs/study/pinkheart.png" // 좋아요
        : "../imgs/study/grayheart.png"; // 좋아요x

    return `
        <img src="${heartImageSrc}">
    `
}

function createDetailSection2(data) {
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



    // 로그인 유저 정보 불러와야 함
    // const loggedInUser = `경로 어떻게 하지..`;


    const likeCount = data.likes_users.length;




    const startAt = data.start_at
    const formattedStartDate = formatDate(startAt);

    let Period = '';
    if (data.period === "6") {
        Period = `<div class="sub-content">6개월 이상</div>`;
    } else if (data.period === "0") {
        Period = `<div class="sub-content">기간 미정</div>`;
    } else {
        Period = `<div class="sub-content">${data.period}개월</div>`;
    }

    let Project = '';
    if (data.project_study === 'project') {
        Project = `<div class="study-text">프로젝트 소개</div>`
    } else {
        Project = `<div class="study-text">스터디 소개</div>`
    }

    let OnOff = '';
    if (data.online_offline === 'ON') {
        OnOff = `<div class="sub-content">온라인</div>`
    } else if (data.online_offline === 'OFF') {
        OnOff = `<div class="sub-content">오프라인</div>`
    } else {
        OnOff = `<div class="sub-content">온/오프라인</div>`
    }

    return `
        <div class="post-detail">
        <div class="detail-info">
            <div class="detail-row">
                <div class="detail-row-inner">
                    <div class="sub-title">모집 구분</div>
                    <div class="sub-content">${data.project_study}</div>
                </div>
                <div class="detail-row-inner">
                    <div class="sub-title">진행 방식</div>
                    ${OnOff}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-row-inner">
                    <div class="sub-title">모집 정원</div>
                    <div class="sub-content">${data.participant_count}명</div>
                </div>
                <div class="detail-row-inner">
                    <div class="sub-title">시작 예정</div>
                    <div class="sub-content">${formattedStartDate}</div>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-row-inner">
                    <div class="sub-title">모집 분야</div>
                    <div class="sub-content"><span class="position_tag_item">${data.field}</span></div>
                </div>
                <div class="detail-row-inner">
                    <div class="sub-title">예상 기간</div>
                    ${Period}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-row-inner">
                    <div class="sub-title">사용 언어</div>
                    <div class="sub-content">
                        ${stackTags}
                    </div>
                </div>
            </div>
        </div>
        <div class="detail-content">
            ${Project}
            <div class="content">
                ${data.content}
            </div>
        </div>
    </div>
    <div class="post-likes">
        <div class="views-box">
            <div class="views">
                <img src="../imgs/study/viewsicon.png">
                <div>${data.views}</div>
            </div>
            <div class="likes">
                <div id="likeTF">
                    
                </div>
                
                <div>${likeCount}</div>
            </div>
        </div>
    </div>
    `;
}

// 댓글 수
function createCommentCount(data) {

    return `
        <div class="comment-count">댓글 ${data.comments_count}</div>
    `;
}

// 댓글 목록
// 유저 url 경로 바꾸기
// 댓글 작성할 프로필 사진 바꾸기
function createDetailSection3(user, data) {
    // const commentUserProfileURL = `../html/profile.html?id=${data.comments_list.author}`;

    let commentList = '';
    if (data.comments_list && data.comments_list.length > 0) {
        commentList = data.comments_list.reverse().map(comment => {
            const writeAt = comment.created_at;
            const formattedCommentDate = formatDate(writeAt);

            return `
                
                <div class="comment-inner">
                    <a href="#">
                        <div class="comment-user-icon">
                            ${comment.author.profile_img}
                        </div>
                    </a>
                    <div>
                        <div class="comment-user-info">
                            <a href="#">
                                <span class="user-name">${comment.author.username}</span>
                            </a>
                            <span class="comment-created-at">${formattedCommentDate}</span>
                        </div>
                        <div class="user-comment">${comment.content}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    return `
        <div>
            <form method="post" class="comment-form" id="commentForm">
                <div class="comment-form-inner">
                    <div class="comment-input">
                        <div class="comment-user-icon">
                            <img src="${user.profile_img}">
                        </div>
                        <textarea id="commentArea" name="commentArea" placeholder="댓글을 입력하세요."></textarea>
                    </div>
                </div>
                <div class="comment-form-btn">
                    <button type="submit">댓글 등록</button>
                </div>
            </form>
        </div>
        </div>
        <div class="comment-list">
            ${commentList}
        </div>
    `;
}

// 이어 붙이기
function createDetaile(user, data) {
    const section1 = document.getElementById("detailSection1");
    const detail1 = `
        ${createDetailSection1(data)}
    `;
    section1.innerHTML += detail1;

    const section2 = document.getElementById("detailSection2");
    const detail2 = `
        ${createDetailSection2(data)}
    `;
    section2.innerHTML += detail2;

    const commentcount = document.getElementById("commentCount");
    const detail4 = `
        ${createCommentCount(data)}
    `
    commentcount.innerHTML += detail4;

    const section3 = document.getElementById("detailSection3");
    const detail3 = `
        ${createDetailSection3(user, data)}
    `;
    section3.innerHTML += detail3;
}

function userReq(study, data) {
    const likeSection = document.getElementById("likeTF");
    const detail5 = `
        ${likesTrue(study, data)}
    `;
    likeSection.innerHTML += detail5;
}



// 스터디 디테일 데이터 가져오기
async function fetchDetailFromAPI() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataId = urlParams.get('id');
    const accessToken = localStorage.getItem('access_token');
    const apiEndpoint = `http://localhost:8000/api/study/${dataId}/`;

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
        const { request_user, study } = responseData;

        createDetaile(request_user, study);
        userReq(request_user, study);

    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDetailFromAPI();


// 댓글 가져오기
// 댓글 목록 렌더링 함수
function renderComments(request_user, comments) {
    const commentList = document.querySelector('.comment-list');

    if (commentList) {
        commentList.innerHTML = '';


        const reversedComments = comments.reverse();
        reversedComments.forEach(comment => {
            const formattedCommentDate = formatDate(comment.created_at);
            const commentElement = document.createElement('div');
            let updateBtn = '';

            if (request_user.username == `${comment.author.username}`) {
                updateBtn = `<div>ㅋㅋ<img src="../imgs/study/commentupdate.png"></div>`
            }

            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-inner">
                    <a href="#">
                        <div class="comment-user-icon">
                            ${comment.author.profile_img}
                        </div>
                    </a>
                    <div>
                        <div class="comment-user-info">
                            <a href="#">
                                <span class="user-name">${comment.author.username}</span>
                            </a>
                            <span class="comment-created-at">${formattedCommentDate}</span>
                        </div>
                        <div class="user-comment">${comment.content}</div>
                        ${updateBtn}
                    </div>
                </div>
            `;
            commentList.appendChild(commentElement);
        });
    }
}


// 데이터 가져오기
async function fetchData(apiEndpoint, options) {
    try {
        const response = await fetch(apiEndpoint, options);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

// 페이지 로드 시, 댓글 작성 시 업데이트
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const studyId = urlParams.get('id');
    getComments(studyId);
});

async function getComments(studyId) {
    const accessToken = localStorage.getItem('access_token');
    const apiEndpoint = `http://localhost:8000/api/study/${studyId}/comments/`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    const comments = await response.json();
    const { request_user, study } = comments;
    renderComments(request_user, study);

}


// 댓글 업데이트 (댓글 작성 후)
async function updateComments() {
    const urlParams = new URLSearchParams(window.location.search);
    const studyId = urlParams.get('id');
    const accessToken = localStorage.getItem('access_token');
    const apiEndpoint = `http://localhost:8000/api/study/${studyId}/comments/`;
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    const comments = await response.json();
    const { request_user, study } = comments;
    renderComments(request_user, study);

    // 댓글 수 업데이트
    const commentCount = document.querySelector('.comment-count');
    if (commentCount) {
        commentCount.textContent = `댓글 ${comments.length}`;
    }
}

// 댓글 작성 버튼 클릭
document.addEventListener('DOMContentLoaded', function () {
    const commentForm = document.getElementById('commentForm');
    commentForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const dataId = urlParams.get('id');

        const commentText = commentArea.value;
        const accessToken = localStorage.getItem('access_token');
        const apiEndpoint = `http://localhost:8000/api/study/${dataId}/comments/`;
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ content: commentText }).toString(),
        };

        try {
            const response = await fetch(apiEndpoint, options);
            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            commentArea.value = '';
            updateComments(); // 댓글 업데이트
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

