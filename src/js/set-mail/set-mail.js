document.addEventListener('DOMContentLoaded', (e) => {
    const btn = document.querySelector('#btn');
    const mail = document.querySelector('#mail');
    let id = '';
    let mailValue = mail.value;

    const url = window.location.href;
    let accept = false;

    for (let i = 0; i < url.length; i++) {
        if (url[i] === '=' && !accept) {
            accept = true;
            continue;
        }
        if (!accept) continue;
        if (url[i] === '&') break;
        id += url[i];
    }

    mail.addEventListener('input', (e) => {
        mailValue = mail.value;
        if(mailValue && id.length > 0) {
            btn.removeAttribute('disabled');
        }

    })



    btn.addEventListener('click', (e) => {
        e.preventDefault()



        const socialId = url[url.length-1]
        console.log(socialId)

        if (socialId === 'k') {
            axios.post('http://localhost:8000/signUpWithSocials', {mail: mailValue, vkId: id, fbId: 'no_fb_id'})
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            axios.post('http://localhost:8000/signUpWithSocials', {mail: mailValue, vkId: 'no_vk_id', fbId: id})
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
        }


    })
})