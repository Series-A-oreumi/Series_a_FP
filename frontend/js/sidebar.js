// sidebar
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    sidebar.classList.toggle("sidebarHidden");

    if (sidebar.classList.contains("sidebarHidden")) {
        sidebar.style.transform = "translateX(-280px)"; // 왼쪽으로 이동
        overlay.style.display = "none";
    } else {
        sidebar.style.transform = "translateX(0)"; // 다시 나타나게
        overlay.style.display = "block";
    }
}

// subsidebar
function toggleSubSidebar() {
    const sidebar = document.getElementById("sidebar");
    const subSidebar = document.getElementById("sub-sidebar");

    sidebar.style.transform = "translateX(-280px)";
    subSidebar.style.display = "block";
    searchInput.focus();
}

// sidebar 닫힘
function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const subSidebar = document.getElementById("sub-sidebar");
    const overlay = document.getElementById("overlay");
    const overlay2 = document.getElementById("overlay2");

    sidebar.style.transform = "translateX(-280px)";
    subSidebar.style.display = "none"; // 초기에도 왼쪽으로 이동
    overlay.style.display = "none";
}


// 클라이언트 측 JavaScript 코드 예시
const searchInput = document.getElementById('search-input');

// 검색어를 저장할 변수
let searchQuery = '';

// 검색어를 서버에 보내 검색 결과를 업데이트하는 함수
const updateSearchResults = async () => {
    try {
        // 검색어가 없을 때는 서버 요청을 보내지 않고 결과를 초기화
        if (!searchQuery) {
            const searchResultsContainer = document.getElementById('searchResultsContainer');
            searchResultsContainer.innerHTML = '';
            return;
        }

        // 서버에 GET 요청 보내기
        const response = await fetch(`http://localhost:8000/api/story/search/?query=${searchQuery}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // 결과를 표시할 컨테이너 엘리먼트
        const searchResultsContainer = document.getElementById('searchResultsContainer');

        // 기존 검색 결과를 지워줌
        searchResultsContainer.innerHTML = '';

        // 검색 결과가 있을 때만 처리
        if (data.length > 0) {
            // 검색 결과를 돌면서 각각의 결과를 표시
            // 검색 결과를 돌면서 각각의 결과를 표시
            const matchingUsers = data.filter(user => {
                // 검색어와 일치하는 경우만 필터링
                return user.username.includes(searchQuery) || user.nickname.includes(searchQuery);
            }) || [];

            matchingUsers.forEach(user => {
                const resultItem = document.createElement('a'); // a 태그로 변경
                resultItem.href = `../html/profile.html?id=${user.id}`; // 이동할 페이지의 URL 지정
                resultItem.className = 'result-item';



                // 프로필 이미지를 표시
                const profileImage = document.createElement('img');
                profileImage.src = "../imgs/common/profile.png"; // 유저 객체에 프로필 이미지 URL이 있다고 가정
                profileImage.alt = 'Profile Image';
                profileImage.className = 'result-profile-image';
                resultItem.appendChild(profileImage);

                // 유저네임과 닉네임을 표시하는 컨테이너
                const userInfoContainer = document.createElement('div');
                userInfoContainer.className = 'result-user-info'; // 부모 클래스 추가

                // 유저네임 표시
                const usernameElement = document.createElement('div');
                usernameElement.className = 'result-username';
                usernameElement.textContent = `${user.username}`;

                // 닉네임 표시
                const nicknameElement = document.createElement('div');
                nicknameElement.className = 'result-nickname';
                nicknameElement.textContent = `${user.nickname}`;

                // 유저네임과 닉네임을 컨테이너에 추가
                userInfoContainer.appendChild(usernameElement);
                userInfoContainer.appendChild(nicknameElement);

                // 컨테이너를 결과 아이템에 추가
                resultItem.appendChild(userInfoContainer);

                // 클릭 이벤트 리스너 추가
                resultItem.addEventListener('click', function() {
                    // 클릭 시 페이지 이동
                    window.location.href = resultItem.href;
                });

                // 결과를 컨테이너에 추가
                searchResultsContainer.appendChild(resultItem);
            });
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        console.log('Search query:', searchQuery);
        console.log('Data received:', data);
    }
};

// input 요소에 입력이 발생할 때마다 검색어를 업데이트하고 검색 결과를 갱신
searchInput.addEventListener('input', function (event) {
    searchQuery = event.target.value;
    console.log(searchQuery);

    // 검색어가 변경되면 검색 결과를 업데이트
    updateSearchResults();
});

// Enter 키 입력을 감지하여 검색 요청
searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        // 엔터 키를 누르면 검색 결과를 업데이트
        updateSearchResults();
    }
});