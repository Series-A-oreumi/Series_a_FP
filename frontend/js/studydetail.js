// 로그인한 유저 아이디
import { UserInfo } from "../js/jwtUserId.js"

const accessToken = localStorage.getItem('access_token');
UserInfo(accessToken)


// 날짜 형식 변경 함수
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('Kr', options);
    return formattedDate.replace(/\//g, '.');
}


// 제목 ,유저
// 팀 url 바꾸기
function createDetailSection1(data) {
    const createAt = data.created_at
    const formattedEndDate = formatDate(createAt);
    const userProfileURL = `../html/profile.html?id=${data.author.id}`;
    const chatURL = `../html/chat.html?data=${data.author.nickname}`;
    const teampageURL = `../html/profile.html?data=${data.pk}`;

    let inviteBtn = '';
    const accessToken = localStorage.getItem('access_token');
    const UserId = UserInfo(accessToken).userId
    const studyId = data.author.id
    const study_id = data.id
    if (UserId === studyId) {
        inviteBtn = `<a href="../html/study_edit.html?id=${study_id}"><div class="studyEdit">수정하기</div></a><div class="studyDelete">삭제하기</div>`
    } else {
        inviteBtn = `<a href="${chatURL}"><div class="goChat">채팅하기</div></a><a href="${teampageURL}"><div class="goChat">참가신청</div></a>`
    }

    let goTeam = '';
    const teamMembers = data.team_members
    console.log(UserId)
    console.log(teamMembers)
    if (teamMembers.includes(UserId)) {
        goTeam = `<div class="go_team">팀페이지 바로가기<a href="${teampageURL}"><img src="../imgs/study/goteam.png"></a></div>`
    }

    return `
        <div class="outline_title">
            <div class="title">${data.title}</div>
            ${goTeam}
        </div>
        <div class="border">
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
            <div class="btnSection">${inviteBtn}</div>
        </div>
    `;
}




// const heartImageSrc = data.likes
//     ? "../imgs/study/pinkheart.png"
//     : "../imgs/study/grayheart.png";


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


    let participantCount = '';
    if (data.participant_count === '0') {
        participantCount = `<div class="sub-content">인원 미정</div>`;
    } else if (data.participant_count === '10') {
        participantCount = `<div class="sub-content">${data.participant_count}명 이상</div>`
    } else { participantCount = `<div class="sub-content">${data.participant_count}명</div>` }

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
                    ${participantCount}
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
    `;
}

function createViewAndLikes(user, data) {
    const likeCount = data.likes_users.length;
    let likesTrue = ''
    const loggedInUser = user.username;
    if (data.likes_users && data.likes_users.includes(loggedInUser)) {
        likesTrue = `../imgs/study/pinkheart.png`
    }
    else {
        likesTrue = `../imgs/study/grayheart.png`
    }

    return `
    <div class="post-likes">
        <div class="views-box">
            <div class="views">
                <img src="../imgs/study/viewsicon.png">
                <div>${data.views}</div>
            </div>
            <div class="likes">
                <div id="likeTF">
                    <img src="${likesTrue}">
                </div>
                <div id="likeCount">${likeCount}</div>
            </div>
        </div>
    </div>`
}


// 댓글 목록 ~
function createDetailSection3(data) {
    let commentList = '';
    if (data.comments_list && data.comments_list.length > 0) {
        commentList = data.comments_list.reverse().map(comment => {
            const commentProfileURL = `../html/profile.html?id=${data.author.id}`;
            const writeAt = comment.created_at;
            const formattedCommentDate = formatDate(writeAt);
            const accessToken = localStorage.getItem('access_token');
            const UserId = UserInfo(accessToken).userId
            let UpdRemo = '';
            const CommentWriter = comment.author.id

            if (UserId === CommentWriter) {
                UpdRemo = `
                <div class="update-remove">
                    <div class="comment-options">
                        <div class="comment-toggle-button">
                            🔧<div class="editbtn"></div>
                        </div>
                        <div class="comment-toggle-button">
                            ❌<div class="removebtn"></div>
                        </div>
                    </div>
                </div>`;
            }

            return `
                
                <div class="comment-inner" data-comment-id="${comment.id}">
                    <a href="${commentProfileURL}">
                        <div class="comment-user-icon">
                            <img src="${comment.author.profile_img}">
                        </div>
                    </a>
                    <div class="comment-content">
                        <div>
                            <div class="comment-user-info">
                                <a href="${commentProfileURL}">
                                    <span class="user-name">${comment.author.username}</span>
                                </a>
                                <span class="comment-created-at">${formattedCommentDate}</span>
                            </div>
                            <div class="user-comment">${comment.content}</div>
                            <div class="comment-edit-form" style="display: none;">
                                <textarea class="comment-edit-text"></textarea>
                                <button class="comment-save-button">저장</button>
                                <button class="comment-cancel-button">취소</button>
                            </div>
                        </div>
                        ${UpdRemo}
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

function createDetaile2(request_user, study) {
    const viewlike = document.getElementById("viewAndLikes");
    const detail5 = `
        ${createViewAndLikes(request_user, study)}
    `
    viewlike.innerHTML = detail5;
}


// 댓글 랜더링용
function renderComments(comments) {
    const commentList = document.querySelector('.comment-list');
    commentList.innerHTML = ''; // 이전 댓글 삭제

    // 최신댓글 위로 가게
    const reversedComments = comments.reverse();

    reversedComments.forEach(comment => {
        const commentProfileURL = `../html/profile.html?id=${comment.author.id}`;
        const formattedCommentDate = formatDate(comment.created_at);
        const commentElement = document.createElement('div');
        const accessToken = localStorage.getItem('access_token');
        const UserId = UserInfo(accessToken).userId
        let UpdRemo = '';
        const CommentWriter = comment.author.id


        if (UserId === CommentWriter) {
            UpdRemo = `
            <div class="update-remove">
                    <div class="comment-options">
                        <div class="comment-toggle-button">
                            🔧<div class="editbtn"></div>
                        </div>
                        <div class="comment-toggle-button">
                            ❌<div class="removebtn"></div>
                        </div>
                    </div>
                </div>`;
        }

        commentElement.className = 'comment';

        commentElement.innerHTML = `
            <div class="comment-inner">
                <a href="${commentProfileURL}">
                    <div class="comment-user-icon">
                        <img src="${comment.author.profile_img}">
                    </div>
                </a>
                <div class="comment-content">
                    <div>
                        <div class="comment-user-info">
                            <a href="${commentProfileURL}">
                                <span class="user-name">${comment.author.username}</span>
                            </a>
                            <span class="comment-created-at">${formattedCommentDate}</span>
                        </div>
                        <div class="user-comment">${comment.content}</div>
                    </div>
                    ${UpdRemo}
                </div>
            </div>
        `;
        commentList.appendChild(commentElement);
    });
    const commentCount = document.getElementById('commentCount');
    const updatedCommentCount = createCommentCount({ comments_count: comments.length });
    commentCount.innerHTML = updatedCommentCount;
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
        createDetaile2(request_user, study);

    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDetailFromAPI();



// 글 삭제
document.addEventListener('click', async function (event) {
    const targetElement = event.target;

    // 삭제하기 버튼을 클릭했을 때만 이벤트 처리
    if (targetElement.classList.contains('studyDelete')) {
        const confirmation = window.confirm('글을 삭제하시겠습니까?');

        if (confirmation) {
            const urlParams = new URLSearchParams(window.location.search);
            const dataId = urlParams.get('id');
            const accessToken = localStorage.getItem('access_token');
            const apiEndpoint = `http://localhost:8000/api/study/${dataId}/`;
            const options = {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };
            try {
                const response = await fetch(apiEndpoint, options);
                if (response.ok) {
                    window.location.href = '../html/studylist.html';
                } else {
                    console.error('Failed to delete comment:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
});



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


// 댓글 수정, 삭제
document.addEventListener('click', async function (event) {
    const commentToggleButton = event.target.closest('.comment-toggle-button');

    if (commentToggleButton) {
        // 클릭된 버튼의 텍스트 확인
        const buttonText = commentToggleButton.textContent.trim();

        // 댓글 요소 선택
        const commentElement = event.target.closest('.comment-inner');
        if (commentElement) {
            // 클릭된 댓글 요소에서 댓글 내용과 수정 폼을 선택
            const commentContent = commentElement.querySelector('.user-comment');
            const commentEditForm = commentElement.querySelector('.comment-edit-form');
            const commentEditText = commentEditForm.querySelector('.comment-edit-text');
            const commentSaveButton = commentEditForm.querySelector('.comment-save-button');
            const commentCancelButton = commentEditForm.querySelector('.comment-cancel-button');

            //수정하기
            if (buttonText === '🔧') {
                // 수정하기 버튼을 클릭한 경우
                // 클릭된 댓글 내용을 수정 폼으로 복사
                commentEditText.value = commentContent.textContent;

                // 수정 폼을 보이게 하고 댓글 내용을 숨김
                commentContent.style.display = 'none';
                commentEditForm.style.display = 'block';

                // 수정 버튼 클릭 이벤트
                commentSaveButton.addEventListener('click', async function () {
                    const updatedContent = commentEditText.value;
                    const commentId = commentElement.dataset.commentId;
                    const accessToken = localStorage.getItem('access_token');
                    const apiEndpoint = `http://localhost:8000/api/study/comments/${commentId}/`;

                    const options = {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ content: updatedContent }),
                    };

                    try {
                        const response = await fetch(apiEndpoint, options);
                        if (response.ok) {
                            // 댓글 수정이 성공한 경우 화면에 업데이트된 내용 반영
                            commentContent.textContent = updatedContent;
                            commentContent.style.display = 'block';
                            commentEditForm.style.display = 'none';
                        } else {
                            // 댓글 수정 실패 처리
                            console.error('Failed to update comment:', response.status);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                });
                // 수정 취소 버튼 클릭
                commentCancelButton.addEventListener('click', function () {
                    // 수정 폼을 숨기고 댓글 내용을 다시 보임
                    commentContent.style.display = 'block';
                    commentEditForm.style.display = 'none';
                });
                // 삭제하기
            } else if (buttonText === '❌') {
                const isConfirmed = window.confirm('댓글을 삭제하시겠습니까?');
                if (isConfirmed) {
                    const commentId = commentElement.dataset.commentId;
                    const accessToken = localStorage.getItem('access_token');
                    const apiEndpoint = `http://localhost:8000/api/study/comments/${commentId}/`;
                    const options = {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    };
                    try {
                        const response = await fetch(apiEndpoint, options);
                        if (response.ok) {
                            commentElement.remove();
                        } else {
                            // 댓글 삭제 실패 처리
                            console.error('Failed to delete comment:', response.status);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            }
        }
    }
});



// 좋아요
document.addEventListener('click', async function (event) {
    const LikesButton = event.target.closest('.likes');

    if (LikesButton) {
        const likeButton = LikesButton.querySelector('#likeTF img');
        const currentImageSrc = likeButton.src;
        const likeCountElement = document.getElementById('likeCount');
        const likeCount = parseInt(likeCountElement.textContent, 10);


        const urlParams = new URLSearchParams(window.location.search);
        const studyId = urlParams.get('id');
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
                    likeCountElement.textContent = likeCount - 1;
                } else {
                    likeButton.src = '../imgs/study/pinkheart.png';
                    likeCountElement.textContent = likeCount + 1;
                }

                // updateLikes();
            } else {
                // 좋아요 요청 실패 처리
                console.error('Failed to update comment:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});