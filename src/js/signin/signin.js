window.addEventListener("DOMContentLoaded", () => {
  const mailOrLogin = document.querySelector("#mail");
  const pass = document.querySelector("#pass");
  const btnSend = document.querySelector("#btnSend");
  const passIcons = document.querySelectorAll("#passIcon");

  passIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        icon.classList.toggle('icon-hide')
        if(index === 0) {
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
    const loader = document.querySelector('#newLoader');
    const mailOrLoginValue = mailOrLogin.value;
    const passValue = pass.value;
    const errorMesage = document.querySelector('#errorMessage');
    const formItem = document.querySelectorAll('.signin__formItem');

    loader.classList.toggle('hide');

    axios
      .post("https://stark-lake-56522.herokuapp.com/signin", {
        mailOrLogin: mailOrLoginValue,
        password: passValue,
      })
      .then(function (res) {
        loader.classList.toggle('hide');
        localStorage.setItem('token', res.data.token);
       if(res.data.admin === 'yes') {
        location.href = '../adminBiba/adminBiba.html'
       } else {
        location.href = '../profile/index.html'
       }
        
      })
      .catch(function (error) {
        loader.classList.toggle('hide');
        errorMesage.classList.toggle('hide');
        formItem.forEach(item => {
          item.classList.toggle('signin__formItemError');
        })
        setTimeout(() => {
          errorMesage.classList.toggle('hide');
          formItem.forEach(item => {
            item.classList.toggle('signin__formItemError');
          })
        }, 4000)
      });
  });
});
