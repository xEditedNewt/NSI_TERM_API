
async function creation_compte(){
	var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("password").value;
	var name = document.getElementById("name").value;
	fetch('http://hms12432.hostmyservers.me/api/v1/creation/', {
		method: 'POST',
		headers: {
			email:email,
			mdp:password,
			name:name
		}
	  })
		.then(res => res.json())
		.then(data => {
		document.getElementById("error").style.display = "block";
        document.getElementById("error").innerHTML = data.message;
        localStorage.setItem("id", data.id);
        localStorage.setItem("username", data.name);
        localStorage.setItem("email", email);
        window.location.href = 'acceuil/index.html'
		  console.log(data);
		})
		.catch(err => {
		  console.error(err);
		});
}
async function connection(){
	var email = document.getElementById("inputEmail1").value;
    var password = document.getElementById("password1").value;
	fetch('http://hms12432.hostmyservers.me/api/v1/verification/', {
		method: 'GET',
		headers: {
			email:email,
			mdp:password
		}
	  })
		.then(res => res.json())
		.then(data => {
		  console.log(data);
		  document.getElementById("error1").style.display = "block";
		  document.getElementById("error1").innerHTML = data.message;
		  if(data.message == ' '){
			localStorage.setItem("token", data.token);
			localStorage.setItem("username", data.name);
            localStorage.setItem("email", email);
			document.getElementById("error1").innerHTML = "Vous êtes connecté";
            localStorage.setItem("id", data.id);
            window.location.href = 'acceuil/index.html'
		  }
		})
		.catch(err => {
		  console.error(err);
		});
}


function checkInputs_CreationCompte() {
	var name = document.getElementById("name").value;
	var email = document.getElementById("inputEmail").value;
	var password = document.getElementById("password").value;
	var errorDiv = document.getElementById("error");
	var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
	if (name && emailRegex.test(email) && password) {
		console.log("test2")
	  errorDiv.style.display = "none";
	  verificationmail(email);
	} else {
	  errorDiv.style.display = "block";
	  errorDiv.innerHTML = "Veuillez remplir tous les champs correctement";
	}
  }


function checkInputs_Connection() {
	var email = document.getElementById("inputEmail1").value;
	var password = document.getElementById("password1").value;
	var errorDiv = document.getElementById("error1");
	var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
	if (emailRegex.test(email) && password) {
	  errorDiv.style.display = "none";
	  connection();
	} else {
		if (!emailRegex.test(email)){
			errorDiv.style.display = "block";
			errorDiv.innerHTML = "Veuillez entrer une adresse mail valide";
		}
		else {
			errorDiv.style.display = "block";
			errorDiv.innerHTML = "Veuillez remplir tous les champs";
		}
	}
  }

async function verificationcode(){
	var boutonverification = document.getElementById("boutonverification")
	var boutonCreation = document.getElementById("boutonCreation")
	boutonCreation.style.display = "none"
	boutonverification.style.display = "block"
	var mail = document.getElementById("inputEmail").value;
	var name = document.getElementById("name");
	var email = document.getElementById("inputEmail");
	var password = document.getElementById("password");
	var codeEnter = document.getElementById("code1")
	codeEnter.style.display = "block"
	name.style.display = "none"
	email.style.display = "none"
	password.style.display = "none"
	code = [...Array(6)].map(()=>Math.floor(Math.random()*10)).join('')
    console.log(code)
	localStorage.setItem("code", code);
   Email.send({
      SecureToken : "7a520917-fffb-441a-9ad4-625da6b2319c",
      To : mail.toString(),
      From : "azute.noie@gmail.com",
      Subject : "Code vérification",
      Body : code
   }).then(
   message => alert("Le code de vérification vous a été envoyé par mail (verifiez vos spam)")
   );
}
async function checkCode(){
	var errorDiv = document.getElementById("error");
	var codeEnter = document.getElementById("code1").value
	var code = localStorage.getItem("code");
	if(code == codeEnter){
		creation_compte()
	}
	else{
		errorDiv.style.display = "block";
		errorDiv.innerHTML = "Mauvais code, veuillez re tenter";
	}
}

async function verificationmail(email){
	fetch('http://hms12432.hostmyservers.me/api/v1/email/' + email)
		.then(res => res.json())
		.then(data => {
		  console.log(data);
		  if(data.message == ' '){
			verificationcode();
		  }
		  else{
			var errorDiv = document.getElementById("error");
			errorDiv.style.display = "block";
			errorDiv.innerHTML = data.message;
		  }
		})
		.catch(err => {
		  console.error(err);
		});
}