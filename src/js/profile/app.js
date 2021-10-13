document.addEventListener("DOMContentLoaded", (e) => {

  

  const hamburger = document.querySelector("#hamburger");

  const header = document.querySelector(".header");
  const sidebarContent = document.querySelector(".sidebar__items");
  const headerIcon = document.querySelectorAll(".header__icon-img");
  const sidebarItem = document.querySelectorAll(".sidebar__item-title");
  const sidebarIcon = document.querySelectorAll(".sidebar__item-icon");
  const fadePage = document.querySelector('.fade__page');
  const body = document.querySelector('body');



  function showActiveLink() {
    const item = document.querySelector("#active__sidebar");

    if (item.getAttribute("number") === "1") {
      item.innerHTML = "{ Главная }";
      item.style.fontWeight = "700";
      item.style.color = "#fff";
    } 
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

});
