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


function table_conversation(array) {
    const table = document.querySelector('.table-conversation');
  
    array.forEach(item => {
        console.log(item)
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      const td3 = document.createElement('td');
      const td4 = document.createElement('td');
    
      td1.textContent = item.user;
      td2.textContent = item.email;
      td3.textContent = item.lastMessage;
      td4.innerHTML = `<a onclick="href_conv(${item.idConv})" class="noir petit arrondi">Voir</a>`

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      table.appendChild(tr);
    });
  }

async function verification_conversation(){
    var id = localStorage.getItem("id");
    var table = document.getElementById('haut');
    fetch("http://45.145.166.47:5000/api/v1/conversations/", {
		method: 'GET',
		headers: {
			id:id,
		}
	  }).then(res => res.json()).then(data =>{
        if (data.message == ' '){
            console.log("test")
            table.style.display = "block",
            table_conversation(data.data)
        }
        else{
            var message = document.getElementById("message");
            message.style.display = "block";
            message.innerHTML = data.message;
        }
    })
}


verification_conversation()
function href_conv(id_conv){
    window.location.assign('./chat/index.html?id=' + id_conv);

}

function logout(){
    localStorage.setItem("code", " ");
    localStorage.setItem("id", " ")
    localStorage.setItem("token", " ")
    localStorage.setItem("username", " ")
    window.location.href = '../index.html'
}
function check_page(){
    id = localStorage.getItem("id")
    if (id == " "){
        window.location.href = '../index.html'
    }
}
check_page()