document.addEventListener("DOMContentLoaded", async function () {
    const upside = document.getElementById('upside');

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const apiEndpoint = `http://localhost:8000/api/profile/${userId}`;
    const accessToken = localStorage.getItem('access_token');

    // 사용자 프로필 정보를 가져오는 함수를 정의합니다.

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('서버에서 오류 응답을 받았습니다.');
        }
        const responseData = await response.json();
        const { user_info, total_count, user_stories, user_studies } = responseData;

        //프로필
        const profileData = user_info;
        profileMain(profileData, user_stories, user_studies);

        // 스토리
        const storyDataArray = user_stories;
        if (storyDataArray > 0) {
            storyDataArray.forEach(data => {
                sideCStory(data);
            });
        } else {
            const innerContent3 = document.getElementById("sideC")
            const instudyHTML3 = `
                <div>게시글이 없습니다.</div>
            `;
            innerContent3.innerHTML += instudyHTML3;
        }

        // 스터디/프로젝트
        const postDataArray = user_studies;
        if (postDataArray.length > 0) {
            postDataArray.forEach(data => {
                sideBStudy2(data);
            });
        } else {
            const innerContent2 = document.getElementById("studyVersion2")
            const instudyHTML2 = `
                <div class="all-imglist">게시글이 없습니다.</div>
            `;
            innerContent2.innerHTML += instudyHTML2;
        }

        if (user_studies.length > 3) {
            const postDataArray2 = user_studies;

            postDataArray2.sort((a, b) => b.likes_users.length - a.likes_users.length);
            const firstData = postDataArray2[0];
            const secondData = postDataArray2[1];
            const thirdData = postDataArray2[2];
            sideBStudy1(firstData, secondData, thirdData);
        }


        // 프로필
        function creatProfile(data, story, study) {
            const chatUrl = `../html/chat.html?data=${data.nickname}`
            console.log(data.profile_img)

            return `
            <div class="up-profile">
                <div class="up-profile-img">
                    <img src="${data.profile_img}" alt="" class="up-img">
                </div>
                <div class="up-detail-profile">
                    <div class="up-profile-name">
                        <p class="up-name">${data.nickname}</p>
                        <div class="up-buttons">
                            <a href="${chatUrl}" class="chatStart">
                                <img src="../imgs/user/dm.png">
                            </a>
                        </div>
                    </div>
                    <div class="up-user-detail">
                        <div class="article-num detail-par">
                            <p>📌스토리 피드</p>
                            <p>${story.length}</p>
                        </div>
                        <div class="follower-num detail-par">
                            <p>|  ⭐ 스터디•프로젝트</p>
                            <p>${study.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="up-links" id="uplinks">
                <ul class="ul-links">
                    <a href="#" data-tab="user_stories">
                        <li id="feeds">피드</li>
                    </a>
                    <a href="#" data-tab="user_studies">
                        <li id="studyList">스터디/프로젝트</li>
                    </a>
                </ul>
            </div>
            `
        }

        function profileMain(profileData, user_stories, user_studies) {
            const profileContent = document.getElementById("profileMain")
            const profileHTML = `
                ${creatProfile(profileData, user_stories, user_studies)}
            `;
            profileContent.innerHTML += profileHTML;
        }


        // 아래쪽 - 스토리 버전
        function createStory(data) {
            const storyUrl = `../html/story.html?id=${data.pk}`
            let feedList = '';
            const ImageTF = data.images
            if (ImageTF.length > 0) {
                feedList = `
                <a href="${storyUrl}">
                    <div class="imglist">
                        <div class="imghovertext">스토리 보러가기</div>
                        <div class="imghover"></div>
                        <img src="${data.images}">
                    </div>
                </a>
            `
            } else {
                feedList = `
                <a href="${storyUrl}">
                    <div class="imglist">
                        <div class="imghovertext">스토리 보러가기</div>
                        <div class="imghover"></div>
                        <div class="imglisttext">${data.content}</div>
                    </div>
                </a>
                `
            }
            return `
                ${feedList}
            `
        }


        function sideCStory(data) {
            const innerContent3 = document.getElementById("sideC")
            const instudyHTML3 = `
                ${createStory(data)}
            `;
            innerContent3.innerHTML += instudyHTML3;
        }



        // 아래쪽 - 스터디 버전
        // 날짜 형식 변경 함수
        function formatDate(dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const formattedDate = new Date(dateString).toLocaleDateString('Kr', options);
            return formattedDate.replace(/\//g, '.');
        }

        // 메인 1
        function createArticle1(data) {
            console.log(data)
            const createAt = data.created_at
            const formattedCreateDate = formatDate(createAt)
            const studyUrl = `../html/studyDetail.html?id=${data.pk}`

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

            let OnOff = '';
            if (data.online_offline === 'ON') {
                OnOff = `<div class="sub-content">온라인</div>`
            } else if (data.online_offline === 'OFF') {
                OnOff = `<div class="sub-content">오프라인</div>`
            } else {
                OnOff = `<div class="sub-content">온/오프라인</div>`
            }

            let participantCount = '';
            if (data.participant_count === 'undefined') {
                participantCount = `<div class="sub-content">인원 미정</div>`;
            } else { participantCount = `<div class="sub-content">${data.participant_count}명</div>` }

            let Period = '';
            if (data.period === "6") {
                Period = `<div class="sub-content">6개월 이상</div>`;
            } else if (data.period === "0") {
                Period = `<div class="sub-content">기간 미정</div>`;
            } else {
                Period = `<div class="sub-content">${data.period}개월</div>`;
            }



            return `
            <a href = "${studyUrl}">
            <div class="down-article-well">
                <div class="article-top">
                    <div class="tag_study">${data.project_study}</div>
                    <div class="article-img-btns">
                        <div class="views">
                            <img src="../imgs/study/viewsicon.png">
                            <p>${data.views}</p>
                        </div>
                        <div class="likes">
                            <img src="../imgs/study/pinkheart.png">
                            <p>${likeCount}</p>
                        </div>
                    </div>
                </div>
                <div class="article-profile">
                    <div class="article-title">
                        ${data.title}
                    </div>
                    <div class="article-created-at">
                        ${formattedCreateDate}
                    </div>
                </div>
                <div class="article-in">
                    <div class="article-main2">
                        <div class="flex-box gap8">
                            <div>${OnOff}</div>
                            <div class="position_tag">
                                <li class="position_tag_item">backend</li>
                            </div>
                        </div>
                        <div>${participantCount}</div>
                        <div>${Period}</div>
                        ${stackTags}
                    </div>
                    <div class="article-main">
                        ${data.content}
                    </div>
                </div>
            </div>
            </a>
            `;
        }


        // 메인 2
        function createArticle2(data1, data2) {
            const createAt1 = data1.created_at
            const formattedCreateDate1 = formatDate(createAt1)
            const createAt2 = data1.created_at
            const formattedCreateDate2 = formatDate(createAt2)

            let stackTags1 = '';
            if (data1.stacks && data1.stacks.length > 0) {
                stackTags1 = `
                    <div class="stack_tag">
                        <ul>
                            ${data1.stacks.map(stack => `
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
            let stackTags2 = '';
            if (data2.stacks && data2.stacks.length > 0) {
                stackTags2 = `
                    <div class="stack_tag">
                        <ul>
                            ${data2.stacks.map(stack => `
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

            let OnOff1 = '';
            if (data1.online_offline === 'ON') {
                OnOff1 = `<div class="sub-content">온라인</div>`
            } else if (data1.online_offline === 'OFF') {
                OnOff1 = `<div class="sub-content">오프라인</div>`
            } else {
                OnOff1 = `<div class="sub-content">온/오프라인</div>`
            }

            let OnOff2 = '';
            if (data2.online_offline === 'ON') {
                OnOff2 = `<div class="sub-content">온라인</div>`
            } else if (data2.online_offline === 'OFF') {
                OnOff2 = `<div class="sub-content">오프라인</div>`
            } else {
                OnOff2 = `<div class="sub-content">온/오프라인</div>`
            }

            let Period1 = '';
            if (data1.period === "6") {
                Period1 = `<div class="sub-content">6개월 이상</div>`;
            } else if (data1.period === "0") {
                Period1 = `<div class="sub-content">기간 미정</div>`;
            } else {
                Period1 = `<div class="sub-content">${data1.period}개월</div>`;
            }
            let Period2 = '';
            if (data2.period === "6") {
                Period2 = `<div class="sub-content">6개월 이상</div>`;
            } else if (data2.period === "0") {
                Period2 = `<div class="sub-content">기간 미정</div>`;
            } else {
                Period2 = `<div class="sub-content">${data2.period}개월</div>`;
            }

            const studyUrl1 = `../html/studyDetail.html?id=${data1.pk}`
            const studyUrl2 = `../html/studyDetail.html?id=${data2.pk}`

            return `
            
            <div class="sub">
                <a href="${studyUrl1}">
                    <div class="sub-article">
                        <div class="article-top">
                            <div class="tag_study">${data1.project_study}</div>
                            <div class="likes">
                                <img src="../imgs/study/pinkheart.png">
                                <p>${data1.likes_users.length}</p>
                            </div>

                        </div>
                        <div class="article-profile">
                            <div class="sub-article-title">${data1.content}</div>
                            <div class="article-created-at">${formattedCreateDate1}</div>
                        </div>
                        <div class="sub-article-info">
                            <div class="flex-box gap8">
                                <div>${OnOff1}</div>
                                <div class="position_tag">
                                    <li class="position_tag_item">${data1.field}</li>
                                </div>
                            </div>
                            <div>${Period1}</div>
                            ${stackTags1}
                        </div>
                        <div class="sub-article-content">${data1.content}</div>
                    </div>
                </a>

                <a href="${studyUrl2}">
                    <div class="sub-article">
                        <div class="article-top">
                            <div class="tag_study">${data2.project_study}</div>
                            <div class="likes">
                                <img src="../imgs/study/pinkheart.png">
                                <p>${data2.likes_users.length}</p>
                            </div>
                        </div>
                        <div class="article-profile">
                            <div class="sub-article-title">${data2.content}</div>
                            <div class="article-created-at">${formattedCreateDate2}</div>
                        </div>
                        <div class="sub-article-info">
                            <div class="flex-box gap8">
                                <div>${OnOff2}</div>
                                <div class="position_tag">
                                    <li class="position_tag_item">${data2.field}</li>
                                </div>
                            </div>
                            <div>${Period2}</div>
                            ${stackTags2}
                        </div>
                        <div class="sub-article-content">${data2.content}</div>
                    </div>
                </a>
            </div>
            
            
            `;
        }

        // 메인 3
        function createArticle3(data) {
            const createAt = data.created_at
            const formattedCreateDate = formatDate(createAt)

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

            const studyUrl = `../html/studyDetail.html?id=${data.pk}`

            return `
            <a href="${studyUrl}">
            <div class="contents_box">
                        <div class="article-top">
                            <div class="tag_study">${data.project_study}</div>
                        </div>
                        <div class="article-profile">
                            <div class="sub-article-title">${data.title}</div>
                            <div class="article-created-at">${formattedCreateDate}</div>
                        </div>
                        <div class="flex-box gap8">
                            <div class="flex-box gap8">
                                <div class="position_tag">
                                    <li class="position_tag_item">${data.field}</li>
                                </div>
                            </div>
                            ${stackTags}
                        </div>
                    </div>
                    </a>
            `;
        }

        // 인기글
        function sideBStudy1(firstData, secondData, thirdData) {
            const innerContent = document.getElementById("studyVersion3")
            const instudyHTML = `
                <div class="sectiontitle">✨인기글</div>
                <div class="downside" id="studyVersion">
                    ${createArticle1(firstData)}
                    ${createArticle2(secondData, thirdData)}
                </div>
                <div class="border"></div>
            `;
            innerContent.innerHTML += instudyHTML;
        }

        // 그냥글
        function sideBStudy2(data) {
            const innerContent2 = document.getElementById("studyVersion2")
            const instudyHTML2 = `
                ${createArticle3(data)}
            `;
            innerContent2.innerHTML += instudyHTML2;
        }


        // 클릭 이벤트
        const sideB = document.getElementById("sideB");
        const sideC = document.getElementById("sideCOut");
        const textTitle = document.getElementById("feeds");
        const textTitle2 = document.getElementById("studyList");
        sideB.style.display = "none";
        sideC.style.display = "block";
        textTitle.style.color = "black";
        textTitle2.style.color = "#868e96";

        function Filter(filterType) {
            const sideB = document.getElementById("sideB");
            const sideC = document.getElementById("sideCOut");
            const textTitle = document.getElementById("feeds");
            const textTitle2 = document.getElementById("studyList");

            if (filterType === "feeds") {
                sideB.style.display = "none";
                sideC.style.display = "block";
                textTitle.style.color = "black";
                textTitle2.style.color = "#868e96";

            } else if (filterType === "studyList") {
                sideB.style.display = "block";
                sideC.style.display = "none";
                textTitle2.style.color = "black";
                textTitle.style.color = "#868e96";

            }
        }


        const feeds = document.getElementById("feeds");
        feeds.addEventListener("click", () => Filter("feeds"));

        const studyList = document.getElementById("studyList");
        studyList.addEventListener("click", () => Filter("studyList"));


    } catch (error) {
        console.error('요청 실패:', error); // 오류를 콘솔에 출력
        // 오류 처리 로직을 추가할 수 있습니다.
    }

});