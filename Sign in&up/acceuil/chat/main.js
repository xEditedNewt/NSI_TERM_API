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



function setpage(){
    var id = localStorage.getItem("id");
    var username = localStorage.getItem("username")
    let urlParams = new URLSearchParams(window.location.search);
    let id_page = urlParams.get('id');
    console.log(id_page)
    fetch("http://hms12432.hostmyservers.me/api/v1/conversation/", {
		method: 'GET',
		headers: {
			id:id,
            id_conv:id_page
		}
	  }).then(res => res.json()).then(data =>{
        var message = document.getElementById("titre");
        message.style.display = "block";
        message.innerHTML = data.message;
    })
    fetch("http://hms12432.hostmyservers.me/api/v1/messages/", {
		method: 'GET',
		headers: {
            id_conv:id_page
		}
	  }).then(res => res.json()).then(data =>{
        console.log(data)
        const messageContainer = document.querySelector('#message-container');
        const newMessage = document.createElement('div');
        data.data.forEach(async (element) => {
            if(element.user == username){
                const newMessage = document.createElement('div');
                newMessage.innerHTML = `<div class="bubbleWrapper">
                <div class="inlineContainer own">
                    <div class="ownBubble own">
                        ${element.message}
                    </div>
                </div><span class="own">${element.createdDate}</span>
            </div>`
                await messageContainer.appendChild(newMessage);
            }
            else{
                const newMessage = document.createElement('div');
                newMessage.innerHTML = `<div class="bubbleWrapper">
                <div class="inlineContainer">
                    <div class="otherBubble other">
                        ${element.message}
                    </div>
                </div><span class="other">${element.createdDate}</span>
            </div>`
                await messageContainer.appendChild(newMessage);
            }
        });

    })
}
setpage()


async function addMessage() {
    const message_i = document.querySelector('input[name="message"]');
    message = message_i.value 
    message_i.value = ''
    message_i.placeholder= "Ecrivez un message..."
    const messageContainer = document.querySelector('#message-container');
    const newMessage = document.createElement('div');

    var id = localStorage.getItem("id");
    var username = localStorage.getItem("username")
    let urlParams = new URLSearchParams(window.location.search);
    let id_page = urlParams.get('id');
    fetch("http://hms12432.hostmyservers.me/api/v1/new-message/", {
        method: 'POST',
        headers: {
            id:id,
            id_conv:id_page,
            message:message.toString()
        }
      }).then(res => res.json()).then(async (data) =>{
        console.log(data.message)
    })
    let date = new Date();
    let formattedDate = date.getHours() + 'h-' + date.getMinutes() + 'm-' + date.getSeconds() + "s";
    newMessage.innerHTML = `<div class="bubbleWrapper">
    <div class="inlineContainer own">
        <div class="ownBubble own">
            ${message}
        </div>
    </div><span class="own">${formattedDate}</span>
</div>`
    await messageContainer.appendChild(newMessage);
}

function getEmailR() {
    console.log("test")
    var params = window.location.search;
    var regex = /langue=(\w+)/;
    var match = regex.exec(params);

    if (match != "Null") {
        var contact = match[1];
    }

    return contact;

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