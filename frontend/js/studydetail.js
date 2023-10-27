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
    const userProfileURL = `../html/profile.html?id=${data.id}`;

    return `
        <div class="title">${data.title}</div>
        <div class="user-section">
            <a href="${userProfileURL}">
                <div class="user-icon">
                    ${data.usericon}
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

    const heartImageSrc = data.likes
        ? "../imgs/study/pinkheart.png"
        : "../imgs/study/grayheart.png";

    // const heartImageSrc = data.likes
    //     ? "Series_a_FP/frontend/imgs/study/pinkheart.png"
    //     : "Series_a_FP/frontend/imgs/study/grayheart.png";


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
                <img src="${heartImageSrc}">
                <div>${data.likes}</div>
            </div>
        </div>
    </div>
    `;
}

// 댓글 수
function createCommentCount(data) {
    const totalComments = data.comments_count;

    return `
        <div class="comment-count">댓글 ${totalComments}</div>
    `;
}

// 댓글 목록
// 유저 url 경로 바꾸기
function createDetailSection3(data) {
    // const commentUserProfileURL = `../html/profile.html?id=${data.comments_list.author}`;

    const writeAt = data.comments_list.created_at
    const formattedCommentDate = formatDate(writeAt);

    let commentList = '';
    if (data.comments_list && data.comments_list.length > 0) {
        commentList = `
            ${data.comments_list.map(comment => `
                <div class="comment-inner">
                    <a href="#">
                        <div class="comment-user-icon">
                            ${comment.author.profileicon}
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
                </div>`).join('')}
            `;
    }

    return `
        <div class="comment-list">
            ${commentList}
        </div>
    `;
}




// const commentForm = document.querySelector('.comment-form');
// commentForm.addEventListener('submit', function (e) {
//     e.preventDefault();

//     const commentText = document.querySelector('#commentArea').value;

//     sendCommentToAPI(commentText);
// });


// 이어 붙이기
function createDetaile(data) {
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
        ${createDetailSection3(data)}
    `;
    section3.innerHTML += detail3;
}



// API에서 데이터 가져오기
async function fetchDetailFromAPI() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataId = urlParams.get('id'); // 'id'는 쿼리 매개변수의 이름이어야 합니다.
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

        const data = await response.json();
        createDetaile(data);

    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDetailFromAPI();



// 데이터 보내기 (댓글, 좋아요)
async function sendCommentToAPI(commentText) {
    const urlParams = new URLSearchParams(window.location.search);
    const dataId = urlParams.get('id');

    const accessToken = localStorage.getItem('access_token');
    const apiEndpoint = `http://localhost:8000/api/study/${dataId}/comments`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: commentText })
        });

        if (!response.ok) {
            throw new Error('Failed to submit comment');
        }


    } catch (error) {
        console.error('Error:', error);
    }
}
