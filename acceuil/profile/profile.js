(function($) { "use strict";
var id = localStorage.getItem("id");
console.log(id)
  var app = function () {
      var body = undefined;
      var menu = undefined;
      var menuItems = undefined;
      var init = function init() {
          body = document.querySelector('body');
          menu = document.querySelector('.menu-icon');
          menuItems = document.querySelectorAll('.nav__list-item');
          applyListeners();
      };
      var applyListeners = function applyListeners() {
          menu.addEventListener('click', function () {
              return toggleClass(body, 'nav-active');
          });
      };
      var toggleClass = function toggleClass(element, stringClass) {
          if (element.classList.contains(stringClass)) element.classList.remove(stringClass);else element.classList.add(stringClass);
      };
      init();
  }();        
            
})(jQuery); 

function changePassword() {
    const pseudo_i = document.querySelector('input[name="pseudo"]');
    pseudo = pseudo_i.value
    console.log(pseudo);

}

function changePseudo() {

    const password_i = document.querySelector('input[name="password"]');
    password = password_i.value
    console.log(password);

}