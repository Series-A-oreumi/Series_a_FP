// 날짜 형식 변경 함수
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate.replace(/\//g, '.');
}


// 제목 ,유저
// 유저 아이콘 데이터이름 확인 필요
function createDetailSection1(data) {
    const createAt = data.created_at
    const formattedEndDate = formatDate(createAt);

    return `
        <div class="title">${data.title}</div>
        <div class="user-section">
            <a href="#">
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
                    <div class="sub-content">${data.online_offline}</div>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-row-inner">
                    <div class="sub-title">모집 정원</div>
                    <div class="sub-content">${data.participants}명</div>
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

// 댓글 목록
// url 확인 필요
// 댓글 작성자 이게 맞나..?
function createDetailSection3(data) {

    return `
        <div class="comment-list">
            <div class="comment-inner">
                <a href="#">
                    <div class="comment-user-icon">
                        ${data.author}
                    </div>
                </a>
                <div>
                    <div class="comment-user-info">
                        <a href="#">
                            <span class="user-name">${data.author}</span>
                        </a>
                        <span class="comment-created-at">${data.created_at}</span>

                    </div>
                    <div class="user-comment">${data.content}</div>
                </div>
            </div>
        </div>
    `;
}


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

    const section3 = document.getElementById("detailSection3");
    const detail3 = `
        ${createDetailSection2(data)}
    `;
    section3.innerHTML += detail3;
}





// API에서 데이터 가져오기
async function fetchDataFromAPI() {
    // 현재 페이지 URL에서 data.pk 값 가져오기
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

        const postData = await response.json();

        createDetaile(postData);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchDataFromAPI();
