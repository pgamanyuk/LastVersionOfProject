window.addEventListener("DOMContentLoaded", () => {
    const mail = document.querySelector('#mail');
    const login = document.querySelector('#login');
    const pass = document.querySelector('#pass');
    const confirm = document.querySelector('#confirmPass');
    const btnSend = document.querySelector('#btnSend');
    const mailError = document.querySelector('#mailError');
    const passError = document.querySelector('#passError');
    const passMatchError = document.querySelector('#passMatchError');
    const errorMessage = document.querySelector('#errorMessage');



    

    mail.addEventListener('blur', ()=> {
        if(!/\S+@\S+\.\S+/.test(mail.value)) {
            mailError.classList.remove('hide');
        }
    }, true)

    mail.addEventListener('focus', () => {
        mailError.classList.add('hide');
    }, true)
    mail.addEventListener('input', ()=> {
        if(mailError.classList.contains('hide') && passError.classList.contains('hide') && passMatchError.classList.contains('hide') && mail.value && pass.value && login.value && pass.value === confirm.value) {
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
        if(mailError.classList.contains('hide') && passError.classList.contains('hide') && passMatchError.classList.contains('hide') && mail.value && pass.value && login.value && pass.value === confirm.value) {
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
        if(mailError.classList.contains('hide') && passError.classList.contains('hide') && passMatchError.classList.contains('hide') && mail.value && pass.value && login.value && pass.value === confirm.value) {
            btnSend.removeAttribute('disabled');
        } else {
            btnSend.setAttribute('disabled', 'disabled')
        }
    })
    
    
    const passIcons = document.querySelectorAll('.passwordIcon');
  
    console.log(passIcons)
  
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
        const loginValue = login.value;
        const passValue = pass.value;
        const confirmValue = confirm.value;
        const loader = document.querySelector('#newLoader');
        loader.classList.toggle('hide');
       
            axios.post('https://stark-lake-56522.herokuapp.com/signup', {
                mail: mailValue,
                password: passValue,
                login: loginValue
              })
              .then(function (res) {
                loader.classList.toggle('hide');
                
                if(typeof res.data != 'string') {
                    localStorage.setItem('token', res.data.token);
                     location.href = '../profile/index.html';
                } else {
                    errorMessage.innerHTML = res.data;
                    errorMessage.classList.remove('hide');
                }
              })
              .catch(function (error) {
                console.log(error);
                loader.classList.toggle('hide');
                alert('Pizdariki')
              });
        
    })

    //old
  

  });
  