window.addEventListener("DOMContentLoaded", () => {
    const mailOrLogin = document.querySelector("#mail");
    const pass = document.querySelector("#pass");
    const btnSend = document.querySelector("#btnSend");
    const passIcons = document.querySelectorAll("#passIcon");



    function signinWithGoogle() {
        google.accounts.id.initialize({
            client_id: "341269728044-13kn13rnm4k57nvj2n7mi73q9od4docv",
            callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { type: 'icon'}
        );
    }

    function handleCredentialResponse(response) {
        const errorMessage = document.querySelector('#errorMessageGoogle')
        axios.post('http://localhost:8000/decodejwtgooglein', {
            token: response.credential
        }).then(res => {
            if(!res.data.token) {
                errorMessage.innerHTML = res.data.message;
                errorMessage.classList.toggle('hide');
                setTimeout(() => {
                    errorMessage.classList.toggle('hide');
                }, 4000)
            } else {
                localStorage.setItem('token', res.data.token);
                location.href = '../chat/index.html';
            }
        }).catch(err => {
            console.log(err);
        })
    }
    function singInWithVk() {
        VK.init({
            apiId: 7982119
        });
        const errorMessage = document.querySelector('#errorMessageGoogle')
        const btn = document.querySelector('#vk_auth');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            VK.Auth.login(function(response) {
                if (response.session) {
                    axios.post('http://localhost:8000/signinVK', {
                        id: response.session.user.id
                    }).then(res => {
                        if(!res.data.token) {
                            errorMessage.innerHTML = res.data.message;
                            errorMessage.classList.toggle('hide');
                            setTimeout(() => {
                                errorMessage.classList.toggle('hide');
                            }, 4000)
                            VK.Auth.logout();

                        } else {
                            localStorage.setItem('token', res.data.token);
                            location.href = '../chat/index.html';
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log(1)
                }
            });
        })
    }
    function signInWithFB() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '394717829027741',
                cookie: true,
                xfbml: true,
                version: 'v1.0'
            });

            FB.AppEvents.logPageView();

        }

        const btn = document.querySelector('#fb_auth');
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            FB.login(function(response){
                if (response.authResponse.userID) {
                    axios.post('http://localhost:8000/signinFB', {
                        id: response.authResponse.userID
                    }).then(res => {
                        if(!res.data.token) {
                            errorMessage.innerHTML = res.data.message;
                            errorMessage.classList.toggle('hide');
                            setTimeout(() => {
                                errorMessage.classList.toggle('hide');
                            }, 4000)
                            FB.logout();


                        } else {
                            localStorage.setItem('token', res.data.token);
                            location.href = '../chat/index.html';
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log(1)
                }
            });
        })

    }


    singInWithVk();
    signInWithFB();
    signinWithGoogle();

    pass.addEventListener('input', () => {
        if(pass.value.length > 0 && mailOrLogin.value.length > 0) {
            btnSend.removeAttribute('disabled');
        } else {
            btnSend.setAttribute('disabled', 'disabled');
        }
    })

    mailOrLogin.addEventListener('input', () => {
        if(pass.value.length > 0 && mailOrLogin.value.length > 0) {
            btnSend.removeAttribute('disabled');
        } else {
            btnSend.setAttribute('disabled', 'disabled');
        }
    })


    passIcons.forEach((icon, index) => {
        icon.addEventListener('click', () => {
            icon.classList.toggle('icon-hide')
            if (index === 0) {
                passIcons[1].classList.toggle('icon-hide');
                pass.setAttribute('type', 'text')
            } else {
                passIcons[0].classList.toggle('icon-hide');
                pass.setAttribute('type', 'password')
            }
        })
    })


    btnSend.addEventListener("click", (e) => {
        e.preventDefault();
        btnSend.setAttribute('disabled', 'disabled');
        const loader = document.querySelector('#newLoader');
        const mailOrLoginValue = mailOrLogin.value;
        const passValue = pass.value;
        const errorMessage = document.querySelector('#errorMessage');
        const formItem = document.querySelectorAll('.signin__formItem');

        loader.classList.toggle('hide');

        axios
            .post("http://localhost:8000/signin", {
                mailOrLogin: mailOrLoginValue,
                password: passValue,
            })
            .then(function (res) {

                btnSend.removeAttribute('disabled');
                loader.classList.toggle('hide');
                if(!res.data.token) {
                    errorMessage.innerHTML = res.data.message;
                    errorMessage.classList.toggle('hide');
                    setTimeout(() => {
                        errorMessage.classList.toggle('hide');
                    }, 4000)
                } else {
                    localStorage.setItem('token', res.data.token);
                    location.href = '../chat/index.html';
                }

            })
            .catch(function (error) {
                console.log(error)
            });
    });
});
