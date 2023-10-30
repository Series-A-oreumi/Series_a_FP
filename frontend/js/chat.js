document.addEventListener('DOMContentLoaded', function () {
    // chat 클래스를 가진 모든 요소를 선택합니다.
    const chatElements = document.querySelectorAll('.chat');

    // 각 chat 요소에 클릭 이벤트 리스너를 추가합니다.
    chatElements.forEach(function (chatElement) {
        chatElement.addEventListener('click', function () {
            // dm 아이디를 가진 태그의 스타일을 block으로 변경합니다.
            const dmElement = document.getElementById('dm');
            dmElement.style.display = 'block';
        });
    });
});



document.addEventListener("DOMContentLoaded", async function () {
    const accessToken = localStorage.getItem('access_token');
    const urlParams = new URLSearchParams(window.location.search);
    const riceve_user_nickname = urlParams.get("data");

    async function fetchData() {
        try {
            //현재 토큰값으로 API 요청하여 로그인한 유저 정보를 불러옴
            const response_json = await fetch(`http://localhost:8000/chat/api?riceve_user_nickname=${riceve_user_nickname}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // access_token을 헤더에 추가
                    'Content-Type': 'application/json'
                },

            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
            //로그인한 유저 정보가 있을때(로그인이 되어 있을때)              
            if (response_json) {
                //로그인한 유저의 닉네임
                const username = await response_json.user.nickname;
                var myNickElement = document.getElementById("my_nick");
                myNickElement.innerHTML = username;
                if (riceve_user_nickname) {
                    const chat_list = await fetch(`http://localhost:8000/chat/create_chatroom`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`, // access_token을 헤더에 추가
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ guest: riceve_user_nickname }),
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                        ;
                    // const chat_lists = await response_json.user.nickname;
                    for (const chatroom of chat_list){                        
                        const chat_partner = chatroom.chat_partner;
                        const chat_room_id = chatroom.chatroom                        
                        const section = document.querySelector(".list");
                        const tagElement = document.createElement("div");
                        tagElement.className = "chat_nick";
                        tagElement.textContent = chat_partner;
                        tagElement.addEventListener('click', async function () {                            
                            const chat_info = document.querySelector('#chat_info');
                            chat_info.innerHTML = chat_partner;
                            
                            // 채팅 내용을 불러온다
                            const chat_desc = await fetch(`http://localhost:8000/chat/chat_desc`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`, // access_token을 헤더에 추가
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ guest: chat_partner , chat_room_id : chat_room_id }),
                            }).then(response => {
                                if (!response.ok) {
                                    throw new Error("Network response was not ok");
                                }
                                return response.json();
                            })
                            if(!chat_desc.messages){
                                // for (const chatroom of chat_desc)
                                console.log(chat_desc.messages)
                            }
                            console.log(chat_desc.messages)


                            const socket = new WebSocket(`ws://localhost:8000/ws/chat/${chat_room_id}/`);
                            
                            const inputElement = document.getElementById("chat_input");
                            inputElement.addEventListener("keydown", function (event) {
                                if (event.key === "Enter") {
                                    // 엔터 키가 눌렸을 때 실행할 동작을 여기에 추가합니다.
                                    // 이 곳에 원하는 동작을 작성하세요.
                                    // 예를 들어, 어떤 함수를 호출하거나 서버에 데이터를 보낼 수 있습니다.
                                    const message = inputElement.value;
                                    socket.send(JSON.stringify({
                                        message: message,
                                        chat_room_id : chat_room_id,
                                        sender : username,
                                        receiver : chat_partner
                                    }));
                                    inputElement.value = '';
                                }
                            });

                            
                            
                        });
                        section.appendChild(tagElement);
                    }
                }

            } else {
                // 정보가 없을 경우 대체 내용을 표시
                var myNickElement = document.getElementById("my_nick");
                const noInfoElement = document.createElement("p");
                noInfoElement.textContent = "No information available.";
                myNickElement.innerHTML = noInfoElement;
            }

        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    fetchData();


    // fetch("http://localhost:8000/chat/api/", {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${accessToken}`, // access_token을 헤더에 추가
    //         'Content-Type': 'application/json'
    //     },
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         console.log(response)
    //         throw new Error("Network response was not ok");
    //     }        
    //     return response.json();
    // })
    // .then(posts => {                                        
    //     // const infoJSON = JSON.stringify(posts);  

    //     // json 형태로 불러온 데이터중 로그인한 유저의 닉네임을 불러옴
    //     const infoData = posts.user.nickname
    //     console.log(infoData)

    //     // 닉네임이 존재할경우(로그인 한 유저가 있을경우=토큰값이 존재할경우)
    //     if (infoData) {
    //         var myNickElement = document.getElementById("my_nick");
    //         myNickElement.innerHTML = infoData;


    //     } else {
    //         // 정보가 없을 경우 대체 내용을 표시
    //         var myNickElement = document.getElementById("my_nick");
    //         const noInfoElement = document.createElement("p");
    //         noInfoElement.textContent = "No information available.";
    //         myNickElement.innerHTML = noInfoElement;
    //     }
    // })
    // .catch(error => {
    //     console.error("Error fetching data:", error);
    // });    
});
