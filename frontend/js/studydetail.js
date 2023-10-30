// 로그인한 유저 아이디
import { UserInfo } from "./jwtUserId.js"

const accessToken = localStorage.getItem('access_token');
UserInfo(accessToken)


// 날짜 형식 변경 함수
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('Kr', options);
    return formattedDate.replace(/\//g, '.');
}


// 제목 ,유저 ~
// 유저 아이콘 데이터이름 확인 필요
function createDetailSection1(data) {
    const createAt = data.created_at
    const formattedEndDate = formatDate(createAt);
    const userProfileURL = `../html/profile.html?id=${data.author}`;

    return `
        <div class="title">${data.title}</div>
        <div class="user-section">
            <a href="${userProfileURL}">
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



// const heartImageSrc = data.likes
//     ? "Series_a_FP/frontend/imgs/study/pinkheart.png"
//     : "Series_a_FP/frontend/imgs/study/grayheart.png";


// 본문~
function createDetailSection2(user, data) {
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


    const likeCount = data.likes_users.length;
    const loggedInUser = user.username;
    let likesTrue = ''
    if (data.likes_users && data.likes_users.includes(loggedInUser)) {
        likesTrue = `<img src="../imgs/study/pinkheart.png">`
    } else {
        likesTrue = `<img src="../imgs/study/grayheart.png">`
    }

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
                ${likesTrue}
                </div>
                <div>${likeCount}</div>
            </div>
        </div>
    </div>
    `;
}



// 댓글 목록 ~
// 랜덤 아이콘
function randomValue(...values) {
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
}


function createDetailSection3(data) {
    let commentList = '';
    if (data.comments_list && data.comments_list.length > 0) {
        commentList = data.comments_list.reverse().map(comment => {
            const commentProfileURL = `../html/profile.html?id=${data.author.id}`;
            const writeAt = comment.created_at;
            const formattedCommentDate = formatDate(writeAt);
            const randomIcon = randomValue('🎅', '👼', '🤴', '👸', '🧑', '👧', '👶', '👨‍🦱', '👱‍♀️', '🧔');

            return `
                
                <div class="comment-inner">
                    <a href="${commentProfileURL}">
                        <div class="comment-user-icon">
                            ${randomIcon}
                        </div>
                    </a>
                    <div>
                        <div class="comment-user-info">
                            <a href="${commentProfileURL}">
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
        
        <div class="comment-list">
            ${commentList}
        </div>
    `;
}


// 댓글 수
function createCommentCount(data) {

    return `
        <div class="comment-count">댓글 ${data.comments_count}</div>
    `;
}


// 이어 붙이기
function createDetaile(request_user, study_detail) {
    // 1 제목, 유저
    const section1 = document.getElementById("detailSection1");
    const detail1 = `
        ${createDetailSection1(study_detail)}
    `;
    section1.innerHTML += detail1;

    // 2 본문
    const section2 = document.getElementById("detailSection2");
    const detail2 = `
        ${createDetailSection2(request_user, study_detail)}
    `;
    section2.innerHTML += detail2;

    //3 댓글
    const section3 = document.getElementById("detailSection3");
    const detail3 = `
        ${createDetailSection3(study_detail)}
    `;
    section3.innerHTML += detail3;

    // 댓글 수
    const commentcount = document.getElementById("commentCount");
    const detail4 = `
        ${createCommentCount(study_detail)}
    `
    commentcount.innerHTML = detail4;
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


    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDetailFromAPI();


// 좋아요
// const likeButton = document.getElementById('likeButton');
// likeButton.addEventListener("click", async function () {
//     const urlParams = new URLSearchParams(window.location.search);
//     const dataId = urlParams.get('id');

//     try {
//         const response = await fetch(`http://localhost:8000/api/study/liked/${dataId}/`, {
//             method: "POST", // 좋아요 토글을 위한 POST 요청
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`,
//                 "Content-Type": "application/json",
//             },
//         });

//         if (response.ok) {
//             // 좋아요 상태를 서버에서 업데이트한 후에는 해당 버튼의 상태를 변경합니다.
//             // const data = await response.json();
//             // if (response.status === 201) {
//             //     likeButton.classList.add("on");
//             // } else {
//             //     likeButton.classList.remove("on");
//             // }
//         } else {
//             console.error("Error toggling like:", response.status);
//         }
//     } catch (error) {
//         console.error("Error toggling like:", error);
//     }
// });



// 댓글
function renderComments(comments) {
    const commentList = document.querySelector('.comment-list');
    commentList.innerHTML = ''; // 이전 댓글 삭제

    // 최신댓글 위로 가게
    const reversedComments = comments.reverse();

    reversedComments.forEach(comment => {
        const commentProfileURL = `../html/profile.html?id=${comment.author.id}`;
        const formattedCommentDate = formatDate(comment.created_at);
        const randomIcon = randomValue('🎅', '👼', '🤴', '👸', '🧑', '👧', '👶', '👨‍🦱', '👱‍♀️', '🧔');
        const commentElement = document.createElement('div');

        commentElement.className = 'comment';

        commentElement.innerHTML = `
            <div class="comment-inner">
                <a href="${commentProfileURL}">
                    <div class="comment-user-icon">
                        ${randomIcon}
                    </div>
                </a>
                <div>
                    <div class "comment-user-info">
                        <a href="${commentProfileURL}">
                            <span class="user-name">${comment.author.username}</span>
                        </a>
                        <span class="comment-created-at">${formattedCommentDate}</span>
                    </div>
                    <div class="user-comment">${comment.content}</div>
                </div>
            </div>
        `;
        commentList.appendChild(commentElement);
    });
    const commentCount = document.getElementById('commentCount');
    const updatedCommentCount = createCommentCount({ comments_count: comments.length });
    commentCount.innerHTML = updatedCommentCount;
}



// 댓글 작성 버튼 클릭 이벤트 핸들러
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
                'Content-Type': 'application/x-www-form-urlencoded', // json으로 하면 안됨!
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


// 댓글 업데이트 (댓글 작성 후)
async function updateComments() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataId = urlParams.get('id');
    const accessToken = localStorage.getItem('access_token');
    const apiEndpoint = `http://localhost:8000/api/study/${dataId}/comments/`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }

        const comments = await response.json();

        renderComments(comments);

    } catch (error) {
        console.error('Error:', error);
    }
}






// const likeButton = document.getElementById('likeButton');
// likeButton.addEventListener('click', async function (e) {
//     e.preventDefault();

//     const urlParams = new URLSearchParams(window.location.search);
//     const dataId = urlParams.get('id');
//     const accessToken = localStorage.getItem('access_token');
//     const apiEndpoint = `http://localhost:8000/api/study/liked/${dataId}/`;
//     const data = {
//         study_id: dataId,
//         user_toke: accessToken
//     }

//     const options = {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     };

//     try {
//         const response = await fetch(apiEndpoint, options);
//         if (!response.ok) {
//             throw new Error('Failed to submit comment');
//         }

//         commentArea.value = '';
//         updateComments(); // 댓글 업데이트
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
