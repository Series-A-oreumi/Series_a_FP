document.addEventListener("DOMContentLoaded", async function() {
    const upside = document.getElementById('upside');
    const downside = document.getElementById('downside');

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const backendUrl = `http://localhost:8000/api/profile/${userId}`; 
    const accessToken = localStorage.getItem('access_token');
    
    // 사용자 프로필 정보를 가져오는 함수를 정의합니다.
    try {
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, 
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('서버에서 오류 응답을 받았습니다.');
        }

        const data = await response.json(); // JSON 데이터 파싱

        // upside 프로필 정보를 HTML에 채우기
        const upsideHTML = `
                <!-- 사용자 프로필 정보 표시 -->
            <div class="up-profile">
                <div class="up-profile-img">
                    <img src="${data.user_info.profile_img}" alt="" class="up-img">
                </div>
                <div class="up-detail-profile">
                    <div class="up-profile-name">
                        <p class="up-name">${data.user_info.nickname}</p>
                        
                        <div class="up-buttons">
                            <button class="up-chat">
                                메세지 보내기
                            </button>
                        </div>
                    </div>
                        <div class="up-user-detail">
                            <div class="article-num detail-par">
                                <p>게시물</p>
                                <p>${data.user_stories.length}</p>
                            </div>
                            <div class="follower-num detail-par">
                                <p>스터디</p>
                                <p>${data.user_studies.length}</p>
                            </div>
                             <div class="follow-num detail-par">
                                <p>프로젝트</p>
                                <p>${data.user_projects.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

            <div class="up-links" id="uplinks">
                <ul class="ul-links">
                    <a href="#" data-tab="user_stories">
                        <li>게시물</li>
                    </a>
                    <a href="#" data-tab="user_studies">
                        <li>스터디</li>
                    </a>
                    <a href="#" data-tab="user_projects">
                        <li>프로젝트</li>
                    </a>
                </ul>
            </div>
            `;

        upside.innerHTML = upsideHTML;


        // 탭 클릭 시 이벤트 핸들러 실행
        const uplinks = document.getElementById('uplinks');
        const tabButtons = uplinks.querySelectorAll('a[data-tab]');
        tabButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');

                // 탭 버튼 클릭 시 해당 탭의 데이터를 표시
                if (targetTab === 'user_stories') {
                    currentTabData = data.user_stories;
                } else if (targetTab === 'user_studies') {
                    currentTabData = data.user_studies;
                } else if (targetTab === 'user_projects') {
                    currentTabData = data.user_projects;
                }

                // 데이터를 HTML에 반영
                displayTabData();
            });
        });

        // 페이지 로드 시 기본 탭 데이터를 표시
        displayTabData();

    } catch (error) {
        console.error('요청 실패:', error); // 오류를 콘솔에 출력
        // 오류 처리 로직을 추가할 수 있습니다.
    }

    // 데이터를 HTML에 표시하는 함수
    function displayTabData() {
        // 이 부분에서 탭에 따른 데이터를 표시하도록 구현 (story, study, project 리스트 보여주기)
        // currentTabData 변수에는 현재 선택된 탭에 해당하는 데이터가 있습니다.
    }
});
