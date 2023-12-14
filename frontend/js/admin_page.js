document.addEventListener("DOMContentLoaded", async function () {


    const apiEndpoint = `http://localhost:8000/api/admin/`;
    const accessToken = localStorage.getItem('access_token');



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
        const { member_list, member_detile } = responseData;

        member_list.forEach(data => {
            // 회원 리스트
            memberList(data);

            // 회원 상세
            const clickDetail = document.getElementById(`data_${data.id}`);
            const memberDetailActive = document.getElementById("memberDetailContent");
            memberDetailActive.style.display = "none";



            clickDetail.addEventListener("click", (event) => {
                memberDetailActive.style.display = "blcok";
                const clickedElement = event.target;
                if (clickedElement.tagName === "TD" && clickedElement.id.startsWith("data_")) {
                    const memberId = clickedElement.id.substring(5);
                    memberDetail(memberId);

                    const member_story_list = memberId.story_list
                    member_story_list.forEach(story => {
                        storyList(story);
                    });

                    const member_study_list = memberId.study_list
                    member_study_list.forEach(study => {
                        studyList(study);
                    });
                }
            });
        })


        // 회원 리스트
        // 승인에 따라 버튼 생성 - data 확인 필요(active, 가입일)
        function createMemberList(data) {
            let memberActive = '';
            let idOrActive = '';
            if (data.is_active) {
                memberActive = `class="member_active" id="data_${data.id}"`;
                idOrActive = `${data.id}`;
            } else {
                idOrActive = `<div class="contant_btn">승인하기</div>`;
            }

            return `
                    <tr ${memberActive}>
                        <td>${idOrActive}</td>
                        <td>${data.email}</td>
                        <td>${data.name}</td>
                        <td>${data.nickname}</td>
                        <td>${data.create_at}</td>
                    </tr>
            `;
        }

        function memberList(data) {
            const memberContent = document.getElementById("memberContent")
            const inHTML1 = `
                ${createMemberList(data)}
            `;
            memberContent.innerHTML += inHTML1;
        }

        // 회원 상세

        // 회원 정보
        // data 확인 필요
        function createMemberDetil(data) {
            return `
            <div class="member_info_table">
                <div class="member_info">
                    <div class="member_info_title_icon">아이콘</div>
                    <span class="member_icon"><img src="${data.profile_icon}"></span>
                    <button class="edit_btn">삭제하기</button>
                </div>
                <div class="member_info">
                    <div class="member_info_title">이메일</div>
                    <div>${data.email}</div>
                    <button class="edit_btn">수정하기</button>
                </div>
                <div class="member_info">
                    <div class="member_info_title">이름</div>
                    <div>${data.name}</div>
                    <button class="edit_btn">수정하기</button>
                </div>
                <div class="member_info">
                    <div class="member_info_title">닉네임</div>
                    <div>${data.nickname}</div>
                    <button class="edit_btn">수정하기</button>
                </div>
                <div class="member_info">
                    <div class="member_info_title">비밀번호</div>
                    <div>${data.password}</div>
                    <button class="edit_btn">수정하기</button>
                </div>
                <div class="member_info">
                    <div class="member_info_title">가입일</div>
                    <div>${data.create_at}</div>
                </div>
            </div>
            `;
        }

        function memberDetail(detailId) {
            const memberDetailContent = document.getElementById("memberDetailContent")
            const inHTML2 = `
                ${createMemberDetil(detailId)}
            `;
            memberDetailContent.innerHTML = inHTML2;
        }

        // 스토리 목록
        function createStoryList(data) {
            return `
                <div class="member_story_content">
                    <div class="member_story_title">${data}</div>
                    <button class="delete_btn">삭제하기</button>
                </div>
            `;
        }

        function storyList(story) {
            const memberStoryList = document.getElementById("memberStoryList")
            const inHTML3 = `
                ${createStoryList(story)}
            `;
            memberStoryList.innerHTML += inHTML3;
        }

        // 스터디 목록
        function createStudyList(data) {
            return `
                <div class="member_story_content">
                    <div class="member_story_title">${data}</div>
                    <button class="delete_btn">삭제하기</button>
                </div>
            `;
        }

        function studyList(study) {
            const memberStudyList = document.getElementById("memberStudyList")
            const inHTML4 = `
                ${createStudyList(study)}
            `;
            memberStudyList.innerHTML += inHTML4;
        }




    } catch (error) {
        console.error('요청 실패:', error);

    }
});