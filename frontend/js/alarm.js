const create_notify = (data) => {
    const notify = document.createElement('div')
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
    
    accept_div.className = 'accept_div'
    accept_btn.innerText = '읽음'
    accept_btn.id = data.check_alarm.id

    
    accept_div.append(accept_btn)

    notify.append(sender_img_div,sender_info,accept_div)

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
            
            const notifications = data.alarm;
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
                $notify_none.remove()
                $notify_count.style.display = 'flex'
                $notify_count.innerText = newNotify.length
            } else {
                $notify_count.style.display = 'none'
            }
        } else {
            console.error('Failed to fetch notifications');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

CheckhNotifications()
UnCheckhNotifications()
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