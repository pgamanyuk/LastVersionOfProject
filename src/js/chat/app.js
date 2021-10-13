document.addEventListener("DOMContentLoaded", (e) => {

    const windowWidth = document.documentElement.clientWidth;
    let inputHeightCounter = 45;
    let inputStepsCounter = 0;
    let loginIO = "";
    let tempMessage = '';
    let tempCounter = 0;

    const hamburger = document.querySelector("#hamburger");
    const chatInput = document.querySelector("#chatInput");
    const chatArea = document.querySelector('#chatArea');
    const chatBtn = document.querySelectorAll("#chatBtn");
    const loaderGif = document.querySelector('#loader');
    const socket = io("https://stark-lake-56522.herokuapp.com/");
    


  
  
    const header = document.querySelector(".header");
    const sidebarContent = document.querySelector(".sidebar__items");
    const headerIcon = document.querySelectorAll(".header__icon-img");
    const sidebarItem = document.querySelectorAll(".sidebar__item-title");
    const sidebarIcon = document.querySelectorAll(".sidebar__item-icon");
    const fadePage = document.querySelector('.fade__page');
    const body = document.querySelector('body');
    const chatTabs = document.querySelector('.chat__tabs');

    function makeZero(num) {
      if(num < 10) {
          return `0${num}`;
      } else {
          return num;
      }
    }

    function renderTabs() {
        const counter = 5;

        for(let i = 0; i < counter; i++) {
          chatTabs.innerHTML += `
          
              <div class="chat__tabs-item">
                  <div class="chat__tabs-itemText">Шакал</div>
                  <img src="../img/chat/hashtag-2.png" class="chat__tabs-itemImg">
              </div>
          ` 
        }

        const allTabs = document.querySelectorAll('.chat__tabs-item');
        const allTabsImg = document.querySelectorAll('.chat__tabs-itemImg');
        allTabs.forEach((tab, index) => {
          if(index == 0){
            tab.classList.add('active__tab');
            allTabsImg[0].classList.add('active__tab-img');
          }
          tab.style.cssText = `
          margin-right: 10px;
          `
        })
    }
    
    function switchTab() {
      const allTabs = document.querySelectorAll('.chat__tabs-item');
      const allTabsImg = document.querySelectorAll('.chat__tabs-itemImg');
      allTabs.forEach((tab, index) =>{
        tab.addEventListener('click', () => {
          allTabs.forEach((oldTab)=>{
            oldTab.classList.remove('active__tab');
          });
          allTabsImg.forEach((oldTab)=>{
            oldTab.classList.remove('active__tab-img');
          });
          tab.classList.add('active__tab');
          allTabsImg[index].classList.add('active__tab-img');
        });
      });
    }
    
    function sendConnectMessage() {
        socket.emit("chat message", {
            message: 'systemConnectionCheckBIBA',
            login: loginIO
    
          });
    }
    
    function renderRecentMessages(login) {
        axios
        .post("https://stark-lake-56522.herokuapp.com/renderRecentMessages", {
          login: `${login}chats`
        })
        .then(function (res) {
            
            res.data.messages.reverse();
            let arrLength;
            if(res.data.messages.length >= 200) {
                arrLength = 200
            } else {
                arrLength = res.data.messages.length;
            }
          for(let i = arrLength - 1; i >= 0; i--) {
              const x = res.data.messages[i];
              const hours =  makeZero(new Date(x.date).getHours())
              const minutes = makeZero(new Date(x.date).getMinutes())
              const month = makeZero(new Date(x.date).getMonth() + 1)
              const day = makeZero(new Date(x.date).getDate())
              const dateDate = `${day}.${month}`;
              const dateHours = `${hours}:${minutes}`;          
    
              renderMessage(x.sender, dateDate, dateHours, x.message);
              
          }
          loaderGif.classList.toggle('hide');
          chatArea.scrollBy(0, chatArea.scrollHeight);
          
        })
        .catch(function (error) {
          alert(error);
        });
    }
    
    function decodeJwt() {
   
      axios
        .post("https://stark-lake-56522.herokuapp.com/decodejwt", {
          token: localStorage.getItem("token"),
        })
        .then(function (res) {
          
          loginIO = res.data.login;
          renderRecentMessages(res.data.login);
          socket.on('chat message', async function (data) {
           const hours =  makeZero(new Date(data.date).getHours())
           const minutes = makeZero(new Date(data.date).getMinutes())
           const month = makeZero(new Date(data.date).getMonth() + 1)
           const day = makeZero(new Date(data.date).getDate())
           const dateDate = `${day}.${month}`;
           const dateHours = `${hours}:${minutes}`;          
    
            await renderMessage(data.sender, dateDate, dateHours, data.message);
           
           
            chatArea.scrollBy(0, chatArea.scrollHeight);
          });
          sendConnectMessage();
        })
        .catch(function (error) {
          location.href = '../signup/index.html';
        });
    }
    
    async function renderMessage(name, dateDate, dateHours, message) {
      
      if(name === 'admin') {
        let messageItem = document.createElement("div");
     
      messageItem.setAttribute("class", "messageItem");
      messageItem.classList.add('adminItem');
      
    
      messageItem.innerHTML = `
        
        <div class="messageItem__container-admin">
            <div class="messageItem__avatar">
                <img class="messageItem__avatar-img admin__img" src="../img/chat/admin.svg" alt="">
            </div>
            <div class="messageItem__content">
                <div class="messageItem__info">
                    <div class="messageItem__name">${name}</div>
                    <div class="messageItem__date">${dateDate}</div>
                </div>
                <div class="messageItem__text">${message}</div>
            </div>
            <div class="messageItem__hours">${dateHours}</div>
        </div>
        `;
    
      chatArea.append(messageItem);
      messageItem = "";
      } else {
        let messageItem = document.createElement("div");
        messageItem.setAttribute("class", "messageItem");
      
    
      messageItem.innerHTML = `
        
        <div class="messageItem__container">
            <div class="messageItem__avatar">
                <img class="messageItem__avatar-img" src="../img/chat/profile.svg" alt="">
            </div>
            <div class="messageItem__content">
                <div class="messageItem__info">
                    <div class="messageItem__name">${name}</div>
                    <div class="messageItem__date">${dateDate}</div>
                </div>
                <div class="messageItem__text">${message}</div>
            </div>
            <div class="messageItem__hours">${dateHours}</div>
        </div>
        `;
    
      chatArea.append(messageItem);
      messageItem = "";
      }
    }


    function showActiveLink() {
      const items = document.querySelectorAll("#active__sidebar");
  
     items.forEach(item => {
      if (item.getAttribute("number") === "3") {
        item.innerHTML = "{ Чат }";
        item.style.fontWeight = "700";
        item.style.color = "#fff";
      } 
     })
    }
  
    function hideContent() {
      let pos = 260;
      
      fadePage.classList.remove('show__fadePage');
      fadePage.style.display = 'none';
      body.style.overflow = 'unset';
      sidebarItem.forEach((item) => {
        item.style.display = "none";
      });
  
      sidebarIcon.forEach((icon) => {
        icon.style.marginRight = "0";
      });
  
      const frameInterval = setInterval(() => {
        if (pos === 65) {
          clearInterval(frameInterval);
        } else {
          pos -= 15;
          sidebarContent.style.width = `${pos}px`;
        }
      }, 20);
    }
  
    function showContent() {
      let pos = 65;
          fadePage.style.display = 'block';
          
          if(window.screen.width <= 768) {
              body.style.overflow = 'hidden';
          }
          
      const frameInterval = setInterval(() => {
        if(pos == 80) {
          fadePage.classList.add('show__fadePage');
        }
  
        if (pos === 260) {
          clearInterval(frameInterval);
        } else {
          pos += 15;
          sidebarContent.style.width = `${pos}px`;
        }
  
        if (pos === 245) { 
          sidebarItem.forEach((item) => {
            item.style.display = "block";
          });
  
          sidebarIcon.forEach((icon) => {
            icon.style.marginRight = "20";
          });
        }
      }, 20);
    }

    axios
  .post("https://stark-lake-56522.herokuapp.com/checkjwt", {
    token: localStorage.getItem("token"),
  })
  .then(function (res) {
    if (res.data.message) {
      location.href = "../signin/index.html";
    } else {
      const bgOut = document.querySelector('#bgOut');
      bgOut.classList.add('hide');
      decodeJwt();
    }
  })
  .catch(function (error) {
    alert(error);
  });
  
    showActiveLink();
  
    hamburger.addEventListener("click", (e) => {
      hamburger.classList.toggle("open-menu");
      if (hamburger.classList.contains("open-menu")) {
        showContent();
      } else {
        hideContent();
      }
    });
  
    
    window.addEventListener("scroll", (e) => {
      if (pageYOffset >= 50) {
        header.classList.add("header__inmove");
        headerIcon.forEach((icon) => {
          icon.classList.add("header__inmoveicon");
         
        });
      } else {
        header.classList.remove("header__inmove");
        headerIcon.forEach((icon) => {
          icon.classList.remove("header__inmoveicon");
        
        });
      }
    });

    renderTabs();
    switchTab();

    autosize(chatInput);
    chatInput.addEventListener('input', (e) => {
         if(inputHeightCounter < +chatInput.style.height.slice(0, - 2) && inputStepsCounter <= 6) {
            inputStepsCounter += 1;
            inputHeightCounter = +chatInput.style.height.slice(0, - 2);
            chatArea.style.minHeight = chatArea.clientHeight - 23 + 15 + 'px';
            chatArea.style.height = chatArea.clientHeight - 23 + 15 + 'px';
         }

         if(inputHeightCounter > +chatInput.style.height.slice(0, - 2)) {
            inputHeightCounter -= 23; 
            inputStepsCounter -= 1;
            chatArea.style.minHeight = chatArea.clientHeight + 23 + 15 + 'px';
         }


         if(+chatInput.style.height.slice(0, - 2) === 45) {
           switch(windowWidth){
              case 375:
                chatArea.style.height = '55vh';
                chatArea.style.minHeight = '55vh';
               break;
              case 414:
                chatArea.style.height = '50vh';
                chatArea.style.minHeight = '50vh';
                break;
              default: 
                chatArea.style.height = '70vh';
                chatArea.style.minHeight = '70vh';
                break;
           }
           
           inputHeightCounter = 45;
           inputStepsCounter = 0;
         }
      
    }) 

    chatBtn.forEach(btn => {
      btn.addEventListener("click",  (e) => {
        if (chatInput.value) {
           socket.emit("chat message", {
            message: chatInput.value.replaceAll('\n', '<br>'),
            login: loginIO
       
          });
          console.log(chatInput.value)
          chatInput.value = "";
        
          chatInput.style.height = '45px';
          switch(windowWidth){
            case 375:
              chatArea.style.height = '55vh';
              chatArea.style.minHeight = '55vh';
             break;
            case 414:
              chatArea.style.height = '50vh';
              chatArea.style.minHeight = '50vh';
              break;
            default: 
              chatArea.style.height = '70vh';
              chatArea.style.minHeight = '70vh';
              break;
         }
        }
      });
    })
    
    
    document.addEventListener('keydown', (e) => {
      if(e.code === 'Enter' && !e.shiftKey) {
          e.preventDefault();
            
        if(chatInput.value) {
          
            socket.emit("chat message", {
                message: chatInput.value.replaceAll('\n', '<br>'),
                login: loginIO
              });
              
              chatInput.value = "";
              chatInput.style.height = '45px';
              chatArea.style.height = '70vh';

           
              e.preventDefault();
             
        }
      } else if(e.code === 'Enter' && e.shiftKey) {
        // chatInput.value += '\n';
      }
    })


  
  });
  