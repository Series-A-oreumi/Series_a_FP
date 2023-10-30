
        const notify = JSON.parse(localStorage.getItem('myNotify2'))
        const $notify_count = document.querySelector('.notify_count')
        if(notify && notify.length > 0) {
            $notify_count.style.display = 'flex'
            $notify_count.innerText = notify.length
        } else {
            $notify_count.style.display = 'none'
        }

        let notisocket;

        const accessToken = localStorage.getItem('access_token');
        console.log(typeof(accessToken))
        notisocket = new WebSocket(`ws://127.0.0.1:8000/alarm/${accessToken}`)
        notisocket.onmessage = (e) => {
            const receiveData = JSON.parse(e.data)
            localStorage.setItem('myNotify2', JSON.stringify(receiveData.message));
            const newNotify = JSON.parse(localStorage.getItem('myNotify2'))
            const $notify_count = document.querySelector('.notify_count')

            if(newNotify.length > 0) {
                $notify_count.style.display = 'flex'
                $notify_count.innerText = newNotify.length
            } else {
                $notify_count.style.display = 'none'
            }
        }