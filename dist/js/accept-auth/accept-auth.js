document.addEventListener('DOMContentLoaded', (e) => {
    const btn = document.querySelector('#btn');

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let token = '';
        const url =  window.location.href;
        let accept = false;

        for (let i = 0; i < url.length; i++) {
            if(url[i] === '=' && !accept) {
                accept = true;
                continue;
            }
            if(!accept) continue;
            token += url[i];

        }


        const newUrl = 'http://localhost:8000/authentication';
        if(token) {
            axios.post('http://localhost:8000/authentication', {token: token})
                .then(res => {
                    localStorage.setItem('token', res.data.token)
                    location.href = '../profile/index.html';

                })
                .catch(err => {
                    console.log(err)
                })
        }
    })
})