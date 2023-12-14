document.addEventListener("DOMContentLoaded", async function () {


    const apiEndpoint = `http://localhost:8000/api/admin/members/`;
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
        responseData.forEach(data => {
            // 회원 리스트
            memberList(data);

            // 회원 상세
            const clickDetail = document.getElementById(`data_${data.id}`);
            const memberDetailActive = document.getElementById("memberDetailContent");
            memberDetailActive.style.display = "none";



            clickDetail.addEventListener("click", async (event) => {
                memberDetailActive.style.display = "block";
                const clickedElement = event.target;
                if (clickedElement.tagName === "TD" && clickedElement.id.startsWith("data_")) {
                    const memberId = clickedElement.id.substring(5);
                    await showMemberDetail(memberId);
                }
            });
        })


        // 승인 회원 리스트
        function createMemberList(data) {
            return `
                    <tr class="member_active" id="data_${data.id}">
                        <td>${data.id}</td>
                        <td>${data.email}</td>
                        <td>${data.username}</td>
                        <td>${data.nickname}</td>
                        <td>${data.bootcamp}</td>
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


        // 미승인 회원 리스트, 클릭이벤트
        const inactiveEndpoint = `http://localhost:8000/api/admin/register/`;
        try {
            const responseInactives = await fetch(inactiveEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!responseInactives.ok) {
                throw new Error('서버에서 오류 응답 : 미승인 멤버');
            }

            const responseDataInactive = await responseInactives.json();
            responseDataInactive.forEach(data => {
                inactiveMemberList(data);
            });


            function createMemberListInactive(data) {
                return `
                    <tr>
                        <td class="fist_content">
                            <div class="content_btn okBtn">승인하기</div>
                        </td>
                        <td>${data.email}</td>
                        <td>${data.username}</td>
                        <td>${data.nickname}</td>
                        <td>${data.bootcamp}</td>
                    </tr>
                `;
            }


            function inactiveMemberList(data) {
                const inactiveMemberContent = document.getElementById("inactiveMemberContent")
                const inHTML5 = `${createMemberListInactive(data)}`;
                inactiveMemberContent.innerHTML += inHTML5

                const okMembers = document.querySelectorAll(".okBtn")
                okMembers.forEach(okMenber => {
                    okMenber.addEventListener('click', async function () {
                        await handleApprovalClick(data);
                    })
                })

            }

            async function handleApprovalClick(data) {
                const okAPi = `http://localhost:8000/api/admin/user-activate/${data.id}/`;

                const options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                try {
                    const response = await fetch(okAPi, options);
                    if (response.ok) {
                        refreshLists();
                    } else {
                        console.error('승인 실패:', response.status);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            async function refreshLists() {
                const inactiveMemberContent = document.getElementById("inactiveMemberContent");
                inactiveMemberContent.innerHTML = '';

                const responseInactives = await fetch(inactiveEndpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (responseInactives.ok) {
                    const responseDataInactive = await responseInactives.json();
                    responseDataInactive.forEach(data => {
                        inactiveMemberList(data);
                    });
                } else {
                    console.error('Failed to fetch inactive members:', responseInactives.status);
                }
                const memberContent = document.getElementById("memberContent");
                memberContent.innerHTML = '';

                const responseMembers = await fetch(apiEndpoint, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (responseMembers.ok) {
                    const membersData = await responseMembers.json();
                    membersData.forEach(data => {
                        memberList(data);
                    });
                } else {
                    console.error('Failed to fetch members:', responseMembers.status);
                }
            }

        } catch (error) {
            console.error('Error:', error);
        }



        // 회원 상세
        async function showMemberDetail(memberId) {
            const memberDetailContent = document.getElementById("memberDetailContent");
            const apiDetailMember = `http://localhost:8000/api/admin/posts/${memberId}`;

            try {
                const responseDetail = await fetch(apiDetailMember, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!responseDetail.ok) {
                    throw new Error('서버에서 상세 정보를 가져오는 데 실패했습니다.');
                }

                const detailData = await responseDetail.json();
                const { user_info, user_stories, user_studies } = detailData;
                memberDetail(user_info)
                storyList(user_stories)
                studyList(user_studies)

                // 회원 정보 상세
                function createMemberDetil(data) {
                    return `
                    <div class="member_info_table">
                        <div class="member_info">
                            <div class="member_info_title_icon">아이콘</div>
                            <span class="member_icon"><img src="${data.profile_img}"></span>
                            <button class="edit_btn">삭제하기</button>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">이메일</div>
                            <div>${data.email}</div>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">이름</div>
                            <div>${data.username}</div>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">닉네임</div>
                            <div>${data.nickname}</div>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">비밀번호</div>
                            <div>******</div>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">부트캠프</div>
                            <div>${data.bootcamp}</div>
                            <div class="member_info_title">권한정보</div>
                            <div>${data.is_member}</div>
                        </div>
                    </div>
                `;
                }

                function memberDetail(user_info) {
                    const memberDetailContent = document.getElementById("memberDetailContent")
                    const inHTML2 = `
                ${createMemberDetil(user_info)}
                `;
                    memberDetailContent.innerHTML = inHTML2;
                }

                // 스토리 목록
                function createStoryList(data) {
                    return `
                    <div class="member_story_content" data_story_id="${data.pk}">
                        <div class="member_story_title">${data}</div>
                        <button class="delete_btn deleteStory">삭제하기</button>
                    </div>
                `;
                }

                function storyList(user_stories) {
                    const memberStoryList = document.getElementById("memberStoryList")
                    let inHTML3 = '';
                    user_stories.forEach(story => {
                        inHTML3 += createStoryList(story);
                    });
                    memberStoryList.innerHTML = inHTML3;


                    // 스토리 삭제
                    const deleteStoryButtons = document.querySelectorAll(".deleteStory");
                    deleteStoryButtons.forEach(deleteStory => {
                        deleteStory.addEventListener('click', async function () {
                            const storyId = deleteStory.parentElement.dataset_story_id;
                            const deleteStoryApi = `http://localhost:8000/api/posts/${memberId}/story/${storyId}/delete/`;
                            const options = {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json',
                                },
                            };
                            try {
                                const response = await fetch(deleteStoryApi, options);
                                if (response.ok) {
                                    deleteStory.remove();
                                } else {
                                    // 삭제 실패 처리
                                    console.error('Failed to delete comment:', response.status);
                                }
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        });
                    });
                }

                // 스터디 목록
                function createStudyList(data) {
                    return `
                    <div class="member_story_content" data_study_id="${data.pk}">
                        <div class="member_story_title">${data}</div>
                        <button class="delete_btn deleteStudy">삭제하기</button>
                    </div>
                `;
                }

                function studyList(user_studies) {
                    const memberStudyList = document.getElementById("memberStudyList")
                    let inHTML4 = '';
                    user_studies.forEach(study => {
                        inHTML4 += createStudyList(study);
                    });
                    memberStudyList.innerHTML = inHTML4;

                    // 스터디 삭제
                    const deleteStudyButtons = document.querySelectorAll(".deleteStudy");
                    deleteStudyButtons.forEach(deleteStudy => {
                        deleteStudy.addEventListener('click', async function () {
                            const studyId = memberDetailContent.dataset.dataset_study_id;
                            const deleteStudyApi = `http://localhost:8000/api/posts/${memberId}/story/${studyId}/delete/`;
                            const options = {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json',
                                },
                            };
                            try {
                                const response = await fetch(deleteStudyApi, options);
                                if (response.ok) {
                                    deleteStudy.remove();
                                } else {
                                    // 삭제 실패 처리
                                    console.error('Failed to delete comment:', response.status);
                                }
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        });
                    });
                }


                // 회원 정보 수정
                const editButtons = memberDetailContent.getElementById("editBtn");
                editButtons.addEventListener('click', async function () {
                    // 수정 처리

                });

                // 회원 정보 삭제
                const deleteButtons = memberDetailContent.getElementById("deleteBtn");
                deleteButtons.addEventListener('click', async function () {
                    const isConfirmed = window.confirm('회원을 삭제하시겠습니까?');
                    if (isConfirmed) {
                        const deleteMemberApi = `http://localhost:8000/api/posts/${memberId}/delete/`;
                        const options = {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        };
                        try {
                            const response = await fetch(deleteMemberApi, options);
                            if (response.ok) {
                                window.location.href = '../html/admin_page.html';

                            } else {
                                // 삭제 실패 처리
                                console.error('Failed to delete comment:', response.status);
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }
                });







            } catch (error) {
                console.error('상세 정보를 가져오는 도중 오류가 발생했습니다:', error);
            }
        }
    } catch (error) {
        console.error('요청 실패:', error);

    }
});