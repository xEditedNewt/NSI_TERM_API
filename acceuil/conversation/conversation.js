(function($) { "use strict";
var id = localStorage.getItem("id");
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

async function suggestion_table(array){
    const table = document.querySelector('.table-conversation');
    email = localStorage.getItem("email")
    array.forEach(item => {
    if(email != item.email){
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
    
      td1.textContent = item.name;
      td2.textContent = item.email;
    
      tr.appendChild(td1);
      tr.appendChild(td2);
      table.appendChild(tr);
    }
    });
}

async function suggestion_conversation(){
    var id = localStorage.getItem("id");
    fetch("http://45.145.166.47:5000/api/v1/compte/")
    .then(res => res.json()).then(data =>{
        if (data.length == 0){
            var message = document.getElementById("message");
            message.style.display = "block";
            message.innerHTML = "Il y a aucun compte pour le moment sur l'application";
        }
        else{
            suggestion_table(data.data)
        }
    })
}

suggestion_conversation()


function contact() {
    fetch('http://45.145.166.47:5000/api/v1/compte/')
    .then(res => res.json())
    .then(data => {
        array = data.data
        const table = document.querySelector('.table tbody');
        tablee = document.getElementById("table")
        tablee.style.display = "block"
        array.forEach(item => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
          
            td1.textContent = item.email;
            td2.textContent = item.name;
          
            tr.appendChild(td1);
            tr.appendChild(td2);
            table.appendChild(tr);
          });
    })
    .catch(err => {
      console.error(err);
    });
  }

function openConversation() {
    var id = localStorage.getItem("id");
    var message = document.getElementById("message");
    var contact = document.getElementById("contact").value;
    fetch('http://45.145.166.47:5000/api/v1/email/'+contact)
    .then(res => res.json())
    .then(data => {
        if(data.message == ' '){
            message.style.display = "block";
            message.innerHTML = "Aucun compte s'est enregistré sur What'sUpp avec cette email.";
        }
        else{
            fetch("http://45.145.166.47:5000/api/v1/new-conv/", {
                method: 'POST',
                headers: {
                    id:id,
                    emailR:contact
                }
              })
              .then(res => res.json())
              .then(data => {
                if(data.message == ' '){
                    window.open('../chat/index.html?id='+data.id)
                }
                else{
                    message.style.display = "block";
                    message.innerHTML = data.message;
                }
              })
        }
    })
}

function logout(){
    localStorage.setItem("code", " ");
    localStorage.setItem("id", " ")
    localStorage.setItem("token", " ")
    localStorage.setItem("username", " ")
    window.location.href = '../../index.html'
}
function check_page(){
    id = localStorage.getItem("id")
    if (id == " "){
        window.location.href = '../../index.html'
    }
}
check_page()