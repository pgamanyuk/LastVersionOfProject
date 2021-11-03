window.addEventListener("DOMContentLoaded", () => {
    const mail = document.querySelector('#mail');
    const pass = document.querySelector('#pass');
    const confirm = document.querySelector('#confirmPass');
    const btnSend = document.querySelector('#btnSend');
    const mailError = document.querySelector('#mailError');
    const passError = document.querySelector('#passError');
    const passMatchError = document.querySelector('#passMatchError');
    const errorMessage = document.querySelector('#errorMessage');


    function singUpWithVk() {
        VK.init({
            apiId: 7982119
        });
        const errorMessage = document.querySelector('#errorMessageGoogle')
        const btn = document.querySelector('#vk_auth');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            VK.Auth.login(function(response) {
                if (response.session) {
                    axios.post('http://localhost:8000/checkSocialId', {id:response.session.user.id, social:'vk'})
                        .then(res => {
                            if(res.data.message) {
                                errorMessage.innerHTML = res.data.message;
                                errorMessage.classList.toggle('hide');
                                setTimeout(() => {
                                    errorMessage.classList.toggle('hide');
                                }, 4000)
                            } else {
                                location.href = `https://localhost:80/set-mail/index.html?id=${response.session.user.id}&social=vk`;
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                } else {
                    console.log(1)
                }
            });
        })
    }
    singUpWithVk()

    function signupWithGoogle() {
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
        axios.post('http://localhost:8000/decodejwtgoogleup', {
            token: response.credential
        }).then(res => {
            if(res.data.message) {
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
    signupWithGoogle();

    function signUnWithFB() {
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
                    axios.post('http://localhost:8000/checkSocialId', {id:response.authResponse.userID, social:'fb'})
                        .then(res => {
                            if(res.data.message) {
                                errorMessage.innerHTML = res.data.message;
                                errorMessage.classList.toggle('hide');
                                setTimeout(() => {
                                    errorMessage.classList.toggle('hide');
                                }, 4000)
                            } else {
                                location.href = `https://localhost:80/set-mail/index.html?id=${response.authResponse.userID}&social=fb`;
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })

                    l
                } else {
                    console.log(1)
                }
            });
        })

    }
    signUnWithFB()

    mail.addEventListener('blur', ()=> {
        if(!/\S+@\S+\.\S+/.test(mail.value)) {
            mailError.classList.remove('hide');
        }
    }, true)

    mail.addEventListener('focus', () => {
        mailError.classList.add('hide');
    }, true)
    mail.addEventListener('input', ()=> {
        if(mailError.classList.contains('hide') && passError.classList.contains('hide') && passMatchError.classList.contains('hide') && mail.value && pass.value &&  pass.value === confirm.value) {
            btnSend.removeAttribute('disabled');
        } else {
            btnSend.setAttribute('disabled', 'disabled')
        }
    })



    pass.addEventListener('blur', ()=> {
        if(!/(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g.test(pass.value)) {
            passError.classList.remove('hide');
        }
        
    }, true)

    pass.addEventListener('focus', () => {
        passError.classList.add('hide');
    }, true)
    pass.addEventListener('input', ()=> {
        if(mailError.classList.contains('hide') && passError.classList.contains('hide') && passMatchError.classList.contains('hide') && mail.value && pass.value && pass.value === confirm.value) {
            btnSend.removeAttribute('disabled');
        } else {
            btnSend.setAttribute('disabled', 'disabled')
        }
    })


    confirm.addEventListener('blur', ()=> {
        if(pass.value !== confirm.value) {
            passMatchError.classList.remove('hide');
        } 

    }, true)

    confirm.addEventListener('focus', () => {
        passMatchError.classList.add('hide');
    }, true)
    confirm.addEventListener('input', ()=> {
        if(mailError.classList.contains('hide') && passError.classList.contains('hide') && passMatchError.classList.contains('hide') && mail.value && pass.value  && pass.value === confirm.value) {
            btnSend.removeAttribute('disabled');
        } else {
            btnSend.setAttribute('disabled', 'disabled')
        }
    })
    
    
    const passIcons = document.querySelectorAll('.passwordIcon');
  
    passIcons.forEach((icon, index) => {
      icon.addEventListener('click', () => {
          icon.classList.toggle('icon-hide')
          if(index === 0) {
            passIcons[1].classList.toggle('icon-hide');
            pass.setAttribute('type', 'text');
            confirm.setAttribute('type', 'text');
          } else {
            passIcons[0].classList.toggle('icon-hide');
            pass.setAttribute('type', 'password');
            confirm.setAttribute('type', 'password');
          }
      })
    })

    btnSend.addEventListener('click', (e) => {
        e.preventDefault();
        errorMessage.classList.add('hide');
        const mailValue = mail.value;
        let login = '';
        const passValue = pass.value;
        const confirmValue = confirm.value;
        const loader = document.querySelector('#newLoader');

        for (let i = 0; i < mail.value.length; i++) {
            if(mailValue[i] === '@') break;
            else login += mailValue[i];
        }
        loader.classList.toggle('hide');
       
            axios.post('http://localhost:8000/signup', {
                mail: mailValue,
                password: passValue,
                login: login
              })
              .then(function (res) {
                  loader.classList.toggle('hide');
                if(res.data.message) {
                    errorMessage.innerHTML = res.data.message;
                    errorMessage.classList.toggle('hide');
                    setTimeout(() => {
                        errorMessage.classList.toggle('hide');
                    }, 4000)
                } else {
                    console.log('zaebumba')
                }
              })
              .catch(function (error) {
                console.log(error);
                loader.classList.toggle('hide');
              });
        
    })


  });
  