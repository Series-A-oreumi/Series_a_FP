const create_notify = (data) => {
    const notify = document.createElement('a')
    // // 게시물 상세 페이지로 이동하는 링크 생성
    // const postLink = document.createElement('a');
    if (data.check_alarm.story) {
        notify.href = `../html/feedDetail.html?id=${data.check_alarm.story}`;
    } else {
        notify.href = `../html/studyDetail.html?id=${data.check_alarm.study}`;
    }
    const sender_img_div = document.createElement('div')
    const sender_img = document.createElement('img')
    const sender_info = document.createElement('div')
    const sender_info_p = document.createElement('p')
    const accept_div = document.createElement('div')
    const accept_btn = document.createElement('button')


    notify.className = 'notify'
    sender_img_div.className = 'sender_img'

    sender_img.src = "../imgs/common/profile.png";
    // if (data.sender.profileImage){
    //     sender_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ data.sender.profileImage
    // } else {
    //     sender_img.src = '/src/assets/img/profile_temp.png'
    // }
    
    sender_img_div.append(sender_img)

    sender_info.className = 'sender_info'
    sender_info_p.innerText = `${data.check_alarm.content}`
    sender_info.append(sender_info_p)
    
    // accept_div.className = 'accept_div'
    // accept_btn.innerText = '읽음'
    // accept_btn.id = data.check_alarm.id

    
    accept_div.append(accept_btn)

    notify.append(sender_img_div,sender_info,accept_div)

    // // 알림 박스에 링크를 추가
    // notify.appendChild(postLink);

    return notify
}

const CheckhNotifications = async () => {
    const notifyList2 = document.querySelector('.notify_list2'); // 이전 알림을 표시할 요소

    const accessToken = localStorage.getItem('access_token');
    const url = 'http://localhost:8000/api/alarm/check/'

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            
            const notifications = data.alarm.slice(0, 10);
            notifications.forEach(notification => {
                const element = create_notify(notification);
                notifyList2.append(element);
            });

            localStorage.setItem('myNotify', JSON.stringify(notifications));

        } else {
            console.error('Failed to fetch notifications');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const UnCheckhNotifications = async () => {
    const notifyList = document.querySelector('.notify_list'); // 이전 알림을 표시할 요소

    const accessToken = localStorage.getItem('access_token');
    const url = 'http://localhost:8000/api/alarm/uncheck/'

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            
            const $notify_none = document.querySelector('.notify_none')
            
            const notifications = data.alarm;
            notifications.forEach(notification => {
                const element = create_notify(notification);
                notifyList.append(element);
            });

            localStorage.setItem('myNotify2', JSON.stringify(notifications));

            const newNotify = JSON.parse(localStorage.getItem('myNotify2'))
            const $notify_count = document.querySelector('.notify_count')

            if(newNotify.length > 0) {
                $notify_none.remove();
                $notify_count.style.display = 'flex';
                $notify_count.innerText = newNotify.length;
            } else {
                $notify_count.style.display = 'none';
            }
        } else {
            console.error('Failed to fetch notifications');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

CheckhNotifications();
UnCheckhNotifications();

// ---------------------------------------------------------------------- //
// const create_notify = (data) => {
//     const notify = document.createElement('a')
//     // // 게시물 상세 페이지로 이동하는 링크 생성
//     // const postLink = document.createElement('a');
//     if (data.check_alarm.story) {
//         notify.href = `../html/feedDetail.html?id=${data.check_alarm.story}`;
//     } else {
//         notify.href = `../html/studyDetail.html?id=${data.check_alarm.study}`;
//     }
//     const sender_img_div = document.createElement('div')
//     const sender_img = document.createElement('img')
//     const sender_info = document.createElement('div')
//     const sender_info_p = document.createElement('p')
//     const accept_div = document.createElement('div')
//     const accept_btn = document.createElement('button')


//     notify.className = 'notify'
//     sender_img_div.className = 'sender_img'

//     sender_img.src = "../imgs/common/profile.png";
//     // if (data.sender.profileImage){
//     //     sender_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ data.sender.profileImage
//     // } else {
//     //     sender_img.src = '/src/assets/img/profile_temp.png'
//     // }
    
//     sender_img_div.append(sender_img)

//     sender_info.className = 'sender_info'
//     sender_info_p.innerText = `${data.check_alarm.content}`
//     sender_info.append(sender_info_p)
    
//     // accept_div.className = 'accept_div'
//     // accept_btn.innerText = '읽음'
//     // accept_btn.id = data.check_alarm.id

    
//     accept_div.append(accept_btn)

//     notify.append(sender_img_div,sender_info,accept_div)

//     // // 알림 박스에 링크를 추가
//     // notify.appendChild(postLink);

//     return notify
// }

// const LoadNotifications = async () => {
//     const notifyList = document.querySelector('.notify_list');
//     const notifyList2 = document.querySelector('.notify_list2');
//     const accessToken = localStorage.getItem('access_token');

//     try {
//         const response1 = await fetch('http://localhost:8000/api/alarm/uncheck/', {
//             method: "GET",
//             headers: {
//                 "Authorization": `Bearer ${accessToken}`,
//             },
//         });

//         if (response1.ok) {
//             const data1 = await response1.json();
//             const notifications1 = data1.alarm;

//             // Remove any existing notifications
//             notifyList.innerHTML = '';

//             notifications1.forEach(notification => {
//                 const element = create_notify(notification);
//                 notifyList.append(element);
//             });

//             localStorage.setItem('myNotify2', JSON.stringify(notifications1));

//             const newNotify = JSON.parse(localStorage.getItem('myNotify2'));
//             const $notify_count = document.querySelector('.notify_count');

//             if (newNotify.length > 0) {
//                 $notify_none.remove();
//                 $notify_count.style.display = 'flex';
//                 $notify_count.innerText = newNotify.length;
//             } else {
//                 $notify_count.style.display = 'none';
//             }
//         } else {
//             console.error('Failed to fetch notifications (uncheck)');
//         }

//         const response2 = await fetch('http://localhost:8000/api/alarm/check/', {
//             method: "GET",
//             headers: {
//                 "Authorization": `Bearer ${accessToken}`,
//             },
//         });

//         if (response2.ok) {
//             const data2 = await response2.json();
//             const notifications2 = data2.alarm.slice(0, 10);

//             // Remove any existing notifications
//             notifyList2.innerHTML = '';

//             notifications2.forEach(notification => {
//                 const element = create_notify(notification);
//                 notifyList2.append(element);
//             });

//             localStorage.setItem('myNotify', JSON.stringify(notifications2));
//         } else {
//             console.error('Failed to fetch notifications (check)');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

// const openNotificationModal = async () => {
//     const modal = document.getElementById("notification-modal");
//     modal.style.display = "block";
//     document.body.style.overflowY = "hidden";

//     // 알림 모달을 열 때마다 새로운 알림을 불러옴
//     await LoadNotifications();
// };

// const closeNotificationModal = () => {
//     const modal = document.getElementById("notification-modal");
//     modal.style.display = "none";
//     document.body.style.overflowY = "auto";
// };

// document.addEventListener('DOMContentLoaded', () => {
//     const notificationButton = document.getElementById('notification-trigger');
//     notificationButton.addEventListener('click', openNotificationModal);

//     const closeModalButton = document.getElementById('close-modal-button');
//     closeModalButton.addEventListener('click', closeNotificationModal);
// });
// -------------------------------------------------------------------------------- //


// const myNotification = async () => {
//     const $notifyList = document.querySelector('.notify_list');
//     const $notifyList2 = document.querySelector('.notify_list2'); // 이전 알림을 표시할 요소

//      // 이전 알람 목록 가져오기
//      const readUrl = 'http://localhost:8000/api/alarm/check/';
//      await fetchNotifications(readUrl, $notifyList2);

//     // 읽지 않은 알람 목록 가져오기
//     const unreadUrl = 'http://localhost:8000/api/alarm/uncheck/';
//     await fetchNotifications(unreadUrl, $notifyList);

// }

// myNotification();

// const myNotification = async () => {
//     const $notifyList = document.querySelector('.notify_list')
//     const $notifyList2 = document.querySelector('.notify_list2'); // 이전 알림을 표시할 요소

//     const url = 'http://localhost:8000/api/alarm/'
//     const accessToken = localStorage.getItem('access_token');

//     await fetch(url, {
//         method: "GET",
//         headers: {
//             "Authorization": `Bearer ${accessToken}`,
//         },
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         if (data.alarm){
//             console.log(data)
//             const $notify_none = document.querySelector('.notify_none')

//             const notifications = data.alarm
//             notifications.forEach(notification => {
//                 const element = create_notify(notification)
//                 if (notification.check_alarm.is_check) {
//                     // 이전 알림인 경우
//                     $notifyList2.append(element); // 이전 알림 목록에 추가
//                 } else {
//                     // 읽지 않은 알림인 경우
//                     $notifyList.append(element); // 읽지 않은 알림 목록에 추가
//                 }
//             });

//             localStorage.setItem('myNotify', JSON.stringify(notifications));
//             const newNotify = JSON.parse(localStorage.getItem('myNotify'))
//             const $notify_count = document.querySelector('.notify_count')

//             if(newNotify.length > 0) {
//                 $notify_none.remove()
//                 $notify_count.style.display = 'flex'
//                 $notify_count.innerText = newNotify.length
//             } else {
//                 $notify_count.style.display = 'none'
//             }
//         }
//     })
//     .catch((err) => {
//         console.log(err);
//     });

    
// }

// myNotification()




// const myNotification = async () => {
//     const $notifyList = document.querySelector('.notify_list');
//     const $notifyList2 = document.querySelector('.notify_list2'); // 이전 알림을 표시할 요소

//      // 이전 알람 목록 가져오기
//      const readUrl = 'http://localhost:8000/api/alarm/check/';
//      await fetchNotifications(readUrl, $notifyList2);

//     // 읽지 않은 알람 목록 가져오기
//     const unreadUrl = 'http://localhost:8000/api/alarm/uncheck/';
//     await fetchNotifications(unreadUrl, $notifyList);

// }

// myNotification();

// const myNotification = async () => {
//     const $notifyList = document.querySelector('.notify_list')
//     const $notifyList2 = document.querySelector('.notify_list2'); // 이전 알림을 표시할 요소

//     const url = 'http://localhost:8000/api/alarm/'
//     const accessToken = localStorage.getItem('access_token');

//     await fetch(url, {
//         method: "GET",
//         headers: {
//             "Authorization": `Bearer ${accessToken}`,
//         },
//     })
//     .then((res) => res.json())
//     .then((data) => {
//         if (data.alarm){
//             console.log(data)
//             const $notify_none = document.querySelector('.notify_none')

//             const notifications = data.alarm
//             notifications.forEach(notification => {
//                 const element = create_notify(notification)
//                 if (notification.check_alarm.is_check) {
//                     // 이전 알림인 경우
//                     $notifyList2.append(element); // 이전 알림 목록에 추가
//                 } else {
//                     // 읽지 않은 알림인 경우
//                     $notifyList.append(element); // 읽지 않은 알림 목록에 추가
//                 }
//             });

//             localStorage.setItem('myNotify', JSON.stringify(notifications));
//             const newNotify = JSON.parse(localStorage.getItem('myNotify'))
//             const $notify_count = document.querySelector('.notify_count')

//             if(newNotify.length > 0) {
//                 $notify_none.remove()
//                 $notify_count.style.display = 'flex'
//                 $notify_count.innerText = newNotify.length
//             } else {
//                 $notify_count.style.display = 'none'
//             }
//         }
//     })
//     .catch((err) => {
//         console.log(err);
//     });

    
// }

// myNotification()