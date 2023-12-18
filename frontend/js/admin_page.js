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

            clickDetail.addEventListener("click", function () {
                const currentDetailActive = document.getElementById("memberDetailContent");
                currentDetailActive.style.display = "block";

                if (clickDetail.tagName === "TR" && clickDetail.id.startsWith("data_")) {
                    const memberId = clickDetail.id.substring(5);
                    showMemberDetail(memberId);
                }
            });


            // const clickDetail = document.getElementById(`data_${data.id}`);
            // console.log(clickDetail)
            // const memberDetailActive = document.getElementById("memberDetailContent");
            // memberDetailActive.style.display = "none";



            // clickDetail.addEventListener("click", async (event) => {
            //     console.log(event.target);
            //     memberDetailActive.style.display = "block";
            //     const clickedElement = event.currentTarget;

            //     if (clickedElement.tagName === "TR" && clickedElement.id.startsWith("data_")) {
            //         const memberId = clickedElement.id.substring(5);
            //         await showMemberDetail(memberId);
            //     }
            // });



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
                memberDetail(user_info);
                console.log(user_stories)
                user_stories.forEach(story => {
                    console.log(story)
                    storyList(story);
                });
                user_studies.forEach(study => {
                    studyList(study);
                });


                // 회원 정보 상세, 프로필 null 값 시 데이터 수정 필요
                function createMemberDetil(data) {
                    let userAdmin = '';
                    if (data.is_admin) {
                        userAdmin = '관리자';
                    } else {
                        userAdmin = '일반 회원';
                    }

                    let userProfile = '';
                    const userprofileData = data.profile_img
                    if (userprofileData !== 'null') {
                        userProfile = `${data.profile_img}`
                    } else {
                        userProfile = '프로필이 없습니다';
                    }

                    return `
                    <div class="member_info_table">
                        <div class="member_info">
                            <div class="member_info_title_icon">아이콘</div>
                            <span class="member_icon"><img src="${userProfile}"></span>
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
                            <div>${userAdmin}</div>
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
                        <div class="member_story_title">${data.title}</div>
                        <button class="delete_btn deleteStory">삭제하기</button>
                    </div>
                `;
                }

                function storyList(story) {
                    const memberStoryList = document.getElementById("memberStoryList")
                    let inHTML3 = `${createStoryList(story)}`;
                    memberStoryList.innerHTML += inHTML3;


                    // 스토리 삭제
                    // const deleteStoryButtons = document.querySelectorAll(".deleteStory");
                    // deleteStoryButtons.forEach(deleteStory => {
                    //     deleteStory.addEventListener('click', async function () {
                    //         const storyId = deleteStory.parentElement.dataset_story_id;
                    //         const deleteStoryApi = `http://localhost:8000/api/posts/${memberId}/story/${storyId}/delete/`;
                    //         const options = {
                    //             method: 'DELETE',
                    //             headers: {
                    //                 'Authorization': `Bearer ${accessToken}`,
                    //                 'Content-Type': 'application/json',
                    //             },
                    //         };
                    //         try {
                    //             const response = await fetch(deleteStoryApi, options);
                    //             if (response.ok) {
                    //                 deleteStory.remove();
                    //             } else {
                    //                 // 삭제 실패 처리
                    //                 console.error('Failed to delete comment:', response.status);
                    //             }
                    //         } catch (error) {
                    //             console.error('Error:', error);
                    //         }
                    //     });
                    // });
                }

                // 스터디 목록
                function createStudyList(data) {
                    return `
                    <div class="member_story_content" data_study_id="${data.pk}">
                        <div class="member_story_title">${data.title}</div>
                        <button class="delete_btn deleteStudy">삭제하기</button>
                    </div>
                `;
                }

                function studyList(study) {
                    const memberStudyList = document.getElementById("memberStudyList")
                    let inHTML4 = `${createStudyList(study)}`;

                    memberStudyList.innerHTML += inHTML4;

                    // 스터디 삭제
                    // const deleteStudyButtons = document.querySelectorAll(".deleteStudy");
                    // deleteStudyButtons.forEach(deleteStudy => {
                    //     deleteStudy.addEventListener('click', async function () {
                    //         const studyId = memberDetailContent.dataset.dataset_study_id;
                    //         const deleteStudyApi = `http://localhost:8000/api/posts/${memberId}/story/${studyId}/delete/`;
                    //         const options = {
                    //             method: 'DELETE',
                    //             headers: {
                    //                 'Authorization': `Bearer ${accessToken}`,
                    //                 'Content-Type': 'application/json',
                    //             },
                    //         };
                    //         try {
                    //             const response = await fetch(deleteStudyApi, options);
                    //             if (response.ok) {
                    //                 deleteStudy.remove();
                    //             } else {
                    //                 // 삭제 실패 처리
                    //                 console.error('Failed to delete comment:', response.status);
                    //             }
                    //         } catch (error) {
                    //             console.error('Error:', error);
                    //         }
                    //     });
                    // });
                }


                // 회원 정보 수정
                const editButtons = memberDetailContent.getElementById("editBtn");
                editButtons.addEventListener('click', async function () {
                    const updatedIcon = iconImg.value;
                    const updatedUsername = usernameText.value;
                    const updatedNickname = nicknameText.value;
                    const updatedPassword = passwordText.value;
                    const updateAdmin = isAdmin.value;


                    const aditMemberApi = `http://localhost:8000/api/admin/${memberId}/update/`;
                    const options1 = {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ profile_img: updatedIcon, username: updatedUsername, nickname: updatedNickname, password: updatedPassword, is_admin: updateAdmin }),
                    };
                    try {
                        const response = await fetch(aditMemberApi, options1);
                        if (response.ok) {
                            window.location.href = '../html/admin_page.html';

                        } else {
                            // 삭제 실패 처리
                            console.error('Failed to delete comment:', response.status);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }

                });

                // 회원 정보 삭제
                const deleteButtons = memberDetailContent.getElementById("deleteBtn");
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







            } catch (error) {
                console.error('상세 정보를 가져오는 도중 오류가 발생했습니다:', error);
            }
        }
    } catch (error) {
        console.error('요청 실패:', error);

    }
});