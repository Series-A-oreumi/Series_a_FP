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
    sender_info_p.innerText = `${data.alarm.content}`
    sender_info.append(sender_info_p)
    
    accept_div.className = 'accept_div'
    accept_btn.innerText = '읽음'
    accept_btn.id = data.alarm.id

    
    accept_div.append(accept_btn)

    notify.append(sender_img_div,sender_info,accept_div)

    return notify
}

const myNotification = async () => {
    const $notify_list = document.querySelector('.notify_list')

    const url = 'http://localhost:8000/api/alarm/'
    const accessToken = localStorage.getItem('access_token');

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.alarm){

            const $notify_none = document.querySelector('.notify_none')

            const notifications = data.notify
            notifications.forEach(notification => {
                const element = create_notify(notification)
                $notify_list.append(element)
            });

            localStorage.setItem('myNotify', JSON.stringify(notifications));
            const newNotify = JSON.parse(localStorage.getItem('myNotify'))
            const $notify_count = document.querySelector('.notify_count')

            if(newNotify.length > 0) {
                $notify_none.remove()
                $notify_count.style.display = 'flex'
                $notify_count.innerText = newNotify.length
            } else {
                $notify_count.style.display = 'none'
            }
        }
    })
    .catch((err) => {
        console.log(err);
    });

    
}

myNotification()