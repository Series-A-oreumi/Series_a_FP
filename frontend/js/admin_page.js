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
            let clickDetail = document.getElementById(`data_${data.id}`);
            let memberDetailActive = document.getElementById("memberDetail");

            memberDetailActive.style.display = "none";
            let isMemberDetailOpen = false;

            document.body.addEventListener("click", function (event) {

                if (!memberDetailActive.contains(event.target)) {
                    memberDetailActive.style.display = "none";
                    isMemberDetailOpen = false;
                    clearMemberDetail();
                }
            });

            // 회원 상세 클릭 이벤트

            clickDetail.addEventListener("click", function (event) {
                event.stopPropagation();

                const currentDetailActive = document.getElementById("memberDetail");

                if (isMemberDetailOpen) {
                    clearMemberDetail();
                }

                currentDetailActive.style.display = "block";
                isMemberDetailOpen = true;

                if (event.currentTarget.tagName === "TR" && event.currentTarget.id.startsWith("data_")) {
                    const memberId = event.currentTarget.id.substring(5);
                    showMemberDetail(memberId);
                }
            });
        });

        // 내용 초기화
        function clearMemberDetail() {
            let storyInfoContainer = document.getElementById("memberStoryList");
            let studyInfoContainer = document.getElementById("memberStudyList");
            storyInfoContainer.innerHTML = '';
            studyInfoContainer.innerHTML = '';
        }


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
                        window.location.href = '../html/admin_page.html';
                    } else {
                        console.error('승인 실패:', response.status);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }



        // 회원 상세
        async function showMemberDetail(memberId) {
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

                // 상세 정보
                memberDetail(user_info);

                // 스토리 정보
                const postStory = user_stories
                if (postStory.length > 0) {
                    postStory.forEach(story => {
                        storyList(story);
                    });
                } else {
                    const memberStoryList = document.getElementById("memberStoryList")
                    const inHTML3 = `<div>게시글이 없습니다.</div>`;
                    memberStoryList.innerHTML += inHTML3;
                }

                // 스터디 정보
                const postStudy = user_studies
                if (postStudy.length > 0) {
                    postStudy.forEach(study => {
                        studyList(study);
                    });
                } else {
                    const memberStudyList = document.getElementById("memberStudyList")
                    const inHTML4 = `<div>게시글이 없습니다.</div>`;
                    memberStudyList.innerHTML += inHTML4;
                }


                // 회원 정보 상세, 프로필 null 값 시 데이터 수정 필요
                function createMemberDetil(data) {
                    let userAdmin = '';
                    let isAdmin = '';
                    if (data.is_admin) {
                        userAdmin = '관리자';
                        isAdmin = `
                        <option value="false">일반 회원</option>
                        <option value="true" selected>관리자</option>`;

                    } else {
                        userAdmin = '일반 회원';
                        isAdmin = `
                        <option value="false" selected>일반 회원</option>
                        <option value="true">관리자</option>`;
                    }

                    let userProfile = '';
                    if (data.profile_img === null) {
                        userProfile = '프로필이 없습니다';
                    } else {
                        userProfile = `
                        <div id="iconSet">
                        <span class="member_icon">
                            <img src="${data.profile_img}">
                        </span>
                        <button class="resetBtn member_data" id="deleteIcon">삭제하기</button>
                        </div>`;
                    }

                    let bootCampSelect = '';
                    if (data.bootcamp === '백엔드 1기') {
                        bootCampSelect = `
                        <option value="백엔드 1기" selected>백엔드 1기</option>
                        <option value="백엔드 2기">백엔드 2기</option>
                        <option value="백엔드 3기">백엔드 3기</option>
                        <option value="AI 1기">AI 1기</option>`;
                    } else if (data.bootcamp === '백엔드 2기') {
                        bootCampSelect = `
                        <option value="백엔드 1기" >백엔드 1기</option>
                        <option value="백엔드 2기" selected>백엔드 2기</option>
                        <option value="백엔드 3기">백엔드 3기</option>
                        <option value="AI 1기">AI 1기</option>`;
                    } else if (data.bootcamp === '백엔드 3기') {
                        bootCampSelect = `
                        <option value="백엔드 1기" >백엔드 1기</option>
                        <option value="백엔드 2기">백엔드 2기</option>
                        <option value="백엔드 3기" selected>백엔드 3기</option>
                        <option value="AI 1기">AI 1기</option>`;
                    } else if (data.bootcamp === 'AI 1기') {
                        bootCampSelect = `
                        <option value="백엔드 1기" >백엔드 1기</option>
                        <option value="백엔드 2기">백엔드 2기</option>
                        <option value="백엔드 3기">백엔드 3기</option>
                        <option value="AI 1기" selected>AI 1기</option>`;
                    } else {
                        bootCampSelect = `
                        <option value="none" selected>선택</option>
                        <option value="백엔드 1기" >백엔드 1기</option>
                        <option value="백엔드 2기">백엔드 2기</option>
                        <option value="백엔드 3기">백엔드 3기</option>
                        <option value="AI 1기">AI 1기</option>`;
                    }

                    return `
                    <div class="member_info_table">
                        <div class="member_info" id="iconElement">
                            <div class="member_info_title_icon">아이콘</div>
                            ${userProfile}
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">이메일</div>
                            <div class="member_data email_data">${data.email}</div>
                            <div class="edit_form" style="display: none;">
                                <textarea class="email_edit_text">${data.email}</textarea>
                            </div>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">이름</div>
                            <div class="member_data username_data">${data.username}</div>
                            <div class="edit_form" style="display: none;">
                                <textarea class="username_edit_text">${data.username}</textarea>
                            </div>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">닉네임</div>
                            <div class="member_data nickname_data">${data.nickname}</div>
                            <div class="edit_form" style="display: none;">
                                <textarea class="nickname_edit_text">${data.nickname}</textarea>
                            </div>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">비밀번호</div>
                            <div class="member_data password_data">****** <button class="resetBtn" id="resetButton">비밀번호 초기화</button></div>
                            <div class="edit_form" style="display: none;">******</div>
                        </div>
                        <div class="member_info">
                            <div class="member_info_title">부트캠프</div>
                            <div class="member_data bootcamp_data">${data.bootcamp}</div>
                            <div class="edit_form " style="display: none;">
                                <select id="editedBootcamp" class="bootcamp_edit_text">
                                    ${bootCampSelect}
                                </select>
                            </div>
                            <div class="member_info_title">권한정보</div>
                            <div class="member_data admin_data">${userAdmin}</div>
                            <div class="edit_form " style="display: none;">
                                <select id="editedAdmin" class="admin_edit_text">
                                    ${isAdmin}
                                </select>
                            </div>
                        </div>
                    </div>
                `;
                }

                // 회원 상세
                function memberDetail(user_info) {
                    const memberDetailContent = document.getElementById("memberDetailContent")
                    const inHTML2 = `${createMemberDetil(user_info)}`;
                    memberDetailContent.innerHTML = inHTML2;
                }

                // 회원 스토리 목록
                function createStoryList(data) {
                    return `
                    <div class="member_story_content" data-story-id="${data.pk}">
                        <div class="member_story_title">${data.title}</div>
                        <button class="delete_btn deleteStory" >삭제하기</button>
                    </div>
                `;
                }

                // 스토리 html 반영, 스토리 삭제
                function storyList(story) {
                    const memberStoryList = document.getElementById("memberStoryList")
                    let inHTML6 = `${createStoryList(story)}`;
                    memberStoryList.innerHTML += inHTML6;


                    //스토리 삭제 클릭 이벤트
                    const deleteStoryButtons = document.querySelectorAll(".deleteStory");
                    deleteStoryButtons.forEach(deleteStory => {
                        deleteStory.addEventListener('click', async function () {
                            const storyId = deleteStory.parentElement.dataset.storyId;
                            const deleteStoryApi = `http://localhost:8000/api/admin/posts/${memberId}/story/${storyId}/delete/`;
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
                                    deleteStory.parentElement.remove();
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

                // 회원 스터디 목록
                function createStudyList(data) {
                    return `
                    <div class="member_story_content" data-study-id="${data.pk}">
                        <div class="member_story_title">${data.title}</div>
                        <button class="delete_btn deleteStudy">삭제하기</button>
                    </div>
                `;
                }

                //스터디 html 반영, 스터디 삭제
                function studyList(study) {
                    const memberStudyList = document.getElementById("memberStudyList")
                    let inHTML4 = `${createStudyList(study)}`;

                    memberStudyList.innerHTML += inHTML4;

                    // 스터디 삭제
                    const deleteStudyButtons = document.querySelectorAll(".deleteStudy");
                    deleteStudyButtons.forEach(deleteStudy => {
                        deleteStudy.addEventListener('click', async function () {
                            const studyId = deleteStudy.parentElement.dataset.studyId;
                            const deleteStudyApi = `http://localhost:8000/api/admin/posts/${memberId}/study/${studyId}/delete/`;
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
                                    deleteStudy.parentElement.remove();
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


                // 회원 정보 수정하기 클릭 시
                const editButton = document.getElementById("editBtn");
                const saveButton = document.getElementById("saveBtn");
                const deleteButton = document.getElementById("deleteBtn");

                const normalForm = document.querySelectorAll(".member_data");
                const editForm = document.querySelectorAll(".edit_form");


                // 각 항목에 대한 수정할 값
                const nameContent = document.querySelector('.username_data');
                const nameEditContent = document.querySelector('.username_edit_text');

                const nicknameContent = document.querySelector('.nickname_data');
                const nicknameEditContent = document.querySelector('.nickname_edit_text');

                const emailContent = document.querySelector('.email_data');
                const emailEditContent = document.querySelector('.email_edit_text');

                const bootcampContent = document.querySelector('.bootcamp_data');
                const bootcampEditContent = document.querySelector('.bootcamp_edit_text');

                const adminContent = document.querySelector('.admin_data');
                const adminEditContent = document.querySelector('.admin_edit_text');


                // 회원 정보 수정하기 버튼 클릭 이벤트
                editButton.addEventListener("click", function () {
                    // form 변경
                    editForm.forEach(form => {
                        form.style.display = "block";
                    });
                    normalForm.forEach(form => {
                        form.style.display = "none";
                    });

                    // 버튼 숨기기
                    saveButton.style.display = "block";
                    deleteButton.style.display = "none";
                    editButton.style.display = "none";


                    // 저장 버튼 클릭 시
                    saveButton.addEventListener('click', async function () {
                        const updateEmail = emailEditContent.value;
                        const updatedUsername = nameEditContent.value;
                        const updatedNickname = nicknameEditContent.value;
                        const updateBootcamp = bootcampEditContent.value;
                        const updateAdmin = adminEditContent.value;

                        const aditMemberApi = `http://localhost:8000/api/admin/${memberId}/update/`;

                        const options = {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: updateEmail, username: updatedUsername, nickname: updatedNickname, is_admin: updateAdmin, bootcamp: updateBootcamp }),
                        };

                        try {
                            const response = await fetch(aditMemberApi, options);
                            if (response.ok) {
                                // 수정 성공 시 화면에 반영
                                emailContent.textContent = updateEmail;
                                nameContent.textContent = updatedUsername;
                                nicknameContent.textContent = updatedNickname;
                                bootcampContent.textContent = updateBootcamp;
                                adminContent.textContent = updateAdmin;

                                normalForm.forEach(form => {
                                    form.style.display = "block";
                                });
                                editForm.forEach(form => {
                                    form.style.display = "none";
                                });

                                saveButton.style.display = "none";
                                editButton.style.display = "block";
                                deleteButton.style.display = "block";

                                memberList();

                            } else {
                                console.error('Failed to update comment:', response.status);
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    });


                });


                // 회원 정보 삭제 버튼 클릭 이벤트
                const deleteButtons = document.getElementById("deleteBtn");
                deleteButtons.addEventListener('click', async function () {
                    const isConfirmed = window.confirm('회원을 삭제하시겠습니까?');
                    if (isConfirmed) {
                        const deleteMemberApi = `http://localhost:8000/api/admin/${memberId}/delete/`;
                        const options2 = {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        };
                        try {
                            const response = await fetch(deleteMemberApi, options2);
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

                // 프로필 아이콘 삭제
                const iconContent = document.getElementById('iconSet');
                const deleteIconBtn = document.getElementById('deleteIcon');
                deleteIconBtn.addEventListener('click', async function () {
                    const isConfirmed = window.confirm('프로필 이미지를 삭제 하시겠습니까?');
                    if (isConfirmed) {
                        const passwordMemberApi = `http://localhost:8000/api/admin/${memberId}/update/`;
                        const options3 = {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ profile_img: null }),
                        };
                        try {
                            const response = await fetch(passwordMemberApi, options3);
                            if (response.ok) {
                                window.alert('프로필 이미지가 삭제되었습니다.');
                                iconContent.style.display = 'none';
                            } else {
                                // 삭제 실패 처리
                                console.error('Failed to delete comment:', response.status);
                            }
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    }
                });

                // 비밀번호 초기화
                const resetButtons = document.getElementById('resetButton');
                const newpassword = `${user_info.username}` + `${user_info.id}`
                resetButtons.addEventListener('click', async function () {
                    const isConfirmed = window.confirm('비밀번호를 초기화 하시겠습니까?');
                    if (isConfirmed) {
                        const passwordMemberApi = `http://localhost:8000/api/admin/${memberId}/update/`;
                        const options3 = {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ password: newpassword }),
                        };
                        try {
                            const response = await fetch(passwordMemberApi, options3);
                            if (response.ok) {
                                window.alert('비밀번호가 초기화되었습니다.');

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