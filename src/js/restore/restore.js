document.addEventListener('DOMContentLoaded', (e) => {
    const mail = document.querySelector('#mail');
    const btn = document.querySelector('#restoreBtn');
    const restorePasswordBlock = document.querySelector('#restorePasswordBlock');
    const confirmPasswordBlock = document.querySelector('#confirmPasswordBlock');
    const createNewPasswordBlock = document.querySelector('#createNewPasswordBlock');
    const confirmPasswordInput = document.querySelector('#confirmPasswordInput');
    const restoreText = document.querySelector('#restoreText');
    const errorConfirmMessage = document.querySelector('#errorConfirmMessage');
    const pass = document.querySelector('#pass');
    const confirm = document.querySelector('#confirmPass');
    const passError = document.querySelector('#passError');
    const passMatchError = document.querySelector('#passMatchError');
    const btnSend = document.querySelector('#btnSend');
    const sendCounter = document.querySelector('#sendCounter');
    const btnCounter__send = document.querySelector('#btnCounter__send');
    const passIcons = document.querySelectorAll('#passIcon');
    let restoreCode = '';
    let mailValue = mail.value;


    function makeZero(num) {
        if(num < 10) {
            return `0${num}`
        } else {
            return num
        }
    }

    function counter() {
        let seconds = 10;
        sendCounter.innerHTML = `Отправить повторно через ${makeZero(seconds)} секунд`
        const interval = setInterval(() => {
            if(seconds === 0) {
                clearInterval(interval);
                sendCounter.classList.toggle('hide')
                btnCounter__send.classList.toggle('hide')
            }
            seconds -= 1;
            sendCounter.innerHTML = `Отправить повторно через ${makeZero(seconds)} секунд`

        }, 1000)

    }

   function inputListener () {

        if(confirmPasswordInput.value.length < 6) {
            errorConfirmMessage.classList.add('hide')
        }
        if(confirmPasswordInput.value.length === 6) {
            if(confirmPasswordInput.value === restoreCode) {
                confirmPasswordBlock.classList.toggle('hide');
                createNewPasswordBlock.classList.toggle('hide');
                createNewPassword(mailValue)
            } else {
                errorConfirmMessage.classList.remove('hide');
            }
        }

    }

    btnCounter__send.addEventListener('click', (e) => {
        e.preventDefault();
        btnCounter__send.classList.toggle('hide');
        sendCounter.classList.toggle('hide');
        confirmPasswordInput.removeEventListener('input', inputListener)

        counter();
        axios.post('http://localhost:8000/restorePassword', {mail:mailValue})
            .then(res => {
                restoreCode = res.data.restoreCode;
                confirmPasswordInput.addEventListener('input', inputListener);
            })
    })


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


    function createNewPassword(mail) {
        btnSend.addEventListener('click', (e) => {
            e.preventDefault();
            const password = pass.value;
            axios.post('http://localhost:8000/createNewPassword', {mail: mail, password:password})
                .then(res => {
                    location.href = '../signin/index.html'
                })

        })

    }


    function checkPasswords() {
        pass.addEventListener('blur', ()=> {
            if(!/(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g.test(pass.value)) {
                passError.classList.remove('hide');
            }

        }, true)

        pass.addEventListener('focus', () => {
            passError.classList.add('hide');
        }, true)
        pass.addEventListener('input', ()=> {
            if(passError.classList.contains('hide') && passMatchError.classList.contains('hide') && pass.value && pass.value === confirm.value) {
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
            if(passError.classList.contains('hide') && passMatchError.classList.contains('hide') && pass.value && pass.value === confirm.value) {
                btnSend.removeAttribute('disabled');
            } else {
                btnSend.setAttribute('disabled', 'disabled')
            }
        })
    }
    checkPasswords()

    mail.addEventListener('input', (e) => {
        if(mail.value.length > 0) {
            btn.removeAttribute('disabled')
        } else {
            btn.setAttribute('disabled', 'disabled')
        }
    })

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        mailValue = mail.value;
        axios.post('http://localhost:8000/restorePassword', {mail:mailValue})
            .then(res => {
                if(res.data.message) {
                    errorMessage.innerHTML = res.data.message;
                    errorMessage.classList.toggle('hide');
                    setTimeout(() => {
                        errorMessage.classList.toggle('hide');
                    }, 4000)
                } else {
                    let detected = false;
                    let finalMail = [];
                    let halfString;
                    for (let i = mailValue.length-1; i >= 0 ; i--) {
                        if(mailValue[i] === '@') {
                            finalMail.push(mailValue[i]);
                            detected = true;
                            halfString = Math.floor(i / 2);
                            continue;
                        }
                        if(detected && halfString > 0) {
                            halfString -= 1;
                            finalMail.push('*');
                        } else {
                            finalMail.push(mailValue[i]);
                        }
                    }
                    restorePasswordBlock.classList.toggle('hide');
                    restoreText.innerHTML = `Мы отправили письмо с кодом на почту ${finalMail.reverse().join('')}  Введи его:`
                    confirmPasswordBlock.classList.toggle('hide');
                    counter();
                    restoreCode = res.data.restoreCode;

                    confirmPasswordInput.addEventListener('input', inputListener)
                }
            })
            .catch(err => {
                console.log(err)
            })
    })
})