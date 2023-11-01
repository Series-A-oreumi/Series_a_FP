// document.addEventListener('DOMContentLoaded', function () {
//     // chat 클래스를 가진 모든 요소를 선택합니다.
//     const chatElements = document.querySelectorAll('.chat');

//     // 각 chat 요소에 클릭 이벤트 리스너를 추가합니다.
//     chatElements.forEach(function (chatElement) {
//         chatElement.addEventListener('click', function () {
//             // dm 아이디를 가진 태그의 스타일을 block으로 변경합니다.
//             const dmElement = document.getElementById('dm');
//             dmElement.style.display = 'block';
//         });
//     });
// });



document.addEventListener("DOMContentLoaded", async function () {
    const accessToken = localStorage.getItem('access_token');
    const urlParams = new URLSearchParams(window.location.search);
    const riceve_user_nickname = urlParams.get("data");
    console.log(riceve_user_nickname)

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

                const socket_alarm = new WebSocket(`ws://localhost:8000/ws/chat_alarm/${username}/`);

                
                socket_alarm.onmessage = function(event) {
                    const data = JSON.parse(event.data);
                    const count = data.count;
                    const room_id = data.chatroom_id;                    
                    // 수신한 메시지를 처리할 수 있습니다.
                    var count_roomid = document.getElementById(room_id);                    
                    if(count == 1){
                        var alarm_count = parseInt(count_roomid.innerHTML) + parseInt(count)
                        count_roomid.innerHTML = alarm_count
                    }
                    else if(count == 0){
                        count_roomid.innerHTML = 0;
                        console.log("읽음")
                    }
                };                




                
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
                    const profile_img = document.createElement("img");
                    profile_img.className = "profile_img";                        
                    const profile_id = document.createElement("div");
                    profile_id.className = "profile_id";
                    const alarm = document.createElement("div");
                    alarm.className = "alarm";
                    alarm.id = chat_room_id;
                    if (chatroom.profile_id){
                        profile_img.src = chatroom.profile_id
                    }
                    else{                            
                        profile_img.src = "../media/profile/행복오르미.jpg";                        
                    }
                    const profile_img_2 = document.createElement("img");
                    profile_img_2.className = "profile_img";                        
                    const profile_id_2 = document.createElement("div");
                    profile_id_2.className = "profile_id";
                    const alarm_2 = document.createElement("div");
                    alarm_2.id = chat_room_id;
                    if (chatroom.profile_id){
                        profile_img_2.src = chatroom.profile_id
                    }
                    else{                            
                        profile_img_2.src = "../media/profile/행복오르미.jpg";                        
                    }                        
                    profile_id.textContent = chat_partner;                        
                    profile_id_2.textContent = chat_partner; 
                    alarm.textContent = chatroom.unread_count
                    tagElement.className = "chat_nick";
                    tagElement.appendChild(profile_img);
                    tagElement.appendChild(profile_id);
                    tagElement.appendChild(alarm);

                    
                    tagElement.addEventListener('click', async function () {                            
                        const chat_info = document.querySelector('#chat_info');
                        chat_info.innerHTML = "";                            
                        chat_info.appendChild(profile_img_2);
                        chat_info.appendChild(profile_id_2);                        
                        chat_info.style.borderBottom = '1px solid rgb(219, 219, 219)';
                                                

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
                            console.log("데이터가 없습니다.")
                        }
                        //채팅 내용창 초기화
                        const chat_descs = document.getElementById("chat_desc")
                        chat_descs.innerHTML = '<br>';
                        // console.log(chat_desc)
                        // 채팅 내용을 반복문으로 태그 추가
                        for (const message of chat_desc.messages){
                            const chats_sender = document.createElement("div");
                            const chats_receiver = document.createElement("div");                            
                            chats_sender.className = "chats_sender";
                            chats_receiver.className = "chats_receiver";

                            const receiver_send = document.createElement("p");
                            const sender_send = document.createElement("p");
                            receiver_send.className = "receiver"
                            sender_send.className = "sender";

                            
                            const receiver_rece = document.createElement("p");
                            const sender_rece = document.createElement("p");
                            receiver_rece.className = "receiver"
                            sender_rece.className = "sender";

                            chats_sender.appendChild(receiver_send)
                            chats_sender.appendChild(sender_send)
                            chats_receiver.appendChild(receiver_rece)
                            chats_receiver.appendChild(sender_rece)                            
                            if(message.sender == username){                                                                        
                                sender_send.innerHTML = message.content                                                                    
                                chat_descs.appendChild(chats_sender);
                            }
                            else{
                                receiver_rece.innerHTML = message.content                                    
                                chat_descs.appendChild(chats_receiver);
                            }
                            
                        }
                        // chat_desc 엘리먼트의 스크롤을 맨 아래로 이동
                        
                        chat_descs.scrollTop = chat_descs.scrollHeight;


                        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${chat_room_id}/`);                        
                        
                        
                        socket.onmessage = (e) => {
                            const senders = JSON.parse(e.data).sender;                            
                            const content = JSON.parse(e.data).message;                            
                            
                            const chats_sender = document.createElement("div");
                            const chats_receiver = document.createElement("div");                            
                            chats_sender.className = "chats_sender";
                            chats_receiver.className = "chats_receiver";

                            const receiver_send = document.createElement("p");
                            const sender_send = document.createElement("p");
                            receiver_send.className = "receiver"
                            sender_send.className = "sender";

                            
                            const receiver_rece = document.createElement("p");
                            const sender_rece = document.createElement("p");
                            receiver_rece.className = "receiver"
                            sender_rece.className = "sender";

                            chats_sender.appendChild(receiver_send)
                            chats_sender.appendChild(sender_send)
                            chats_receiver.appendChild(receiver_rece)
                            chats_receiver.appendChild(sender_rece) 
                            
                            // console.log(senders)
                            if(senders == username){                                                                                                        
                                sender_send.innerHTML = content                                                                    
                                chat_descs.appendChild(chats_sender);
                            }
                            else{
                                receiver_rece.innerHTML = content 
                                chat_descs.appendChild(chats_receiver);
                            }                            
                            chat_descs.scrollTop = chat_descs.scrollHeight;
                            // chatContainer.innerHTML += `<p>${message}</p>`;
                        };
                        
                        
                        
                        
                        
                        
                        const inputElement = document.getElementById("chat_input");
                        inputElement.addEventListener("keydown", function (event) {
                            if (event.key === 'Enter' && event.shiftKey) {
                                event.preventDefault();
                                inputElement.value += '\n';
                                // 쉬프트 + Enter를 눌렀을 때 줄바꿈 추가                                
                            } else if (event.key === 'Enter' && !event.shiftKey) {
                                // Enter 키를 눌렀고, 쉬프트 키가 눌리지 않았을 때만 메시지 전송
                                event.preventDefault(); // 기본 엔터 키 동작을 막음
                                if (inputElement.value != ''){
                                    const message = inputElement.value;
                                    // console.log(message)
                                    const messages = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
                                    // console.log(messages)
                                    socket.send(JSON.stringify({
                                        "type" : "send",
                                        message: messages,
                                        chat_room_id: chat_room_id,
                                        sender: username,
                                        receiver: chat_partner
                                    }));
                                    inputElement.value = '';
                                }
                                
                            }
                            
                        });

                        socket.onopen = function (event) {
                            // WebSocket 연결이 확립되면 메시지를 보낼 수 있음
                            socket.send(JSON.stringify({
                                "type": "page_visible",
                                sender: username,
                                "chatroom_id": chat_room_id
                            }));
                        };

                        
                        
                    });
                    section.appendChild(tagElement);
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
