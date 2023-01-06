function find(){
	var searchTerm = document.getElementById("tbSearch");
	if(searchTerm.value === "Search..." || searchTerm.value === "Enter search term!" || searchTerm.value === ""){
		searchTerm.value = "Enter search term!";
		searchTerm.style.color = "#F03247";
	}
	else{
		window.localStorage.setItem("search", searchTerm.value);
		window.location.href = "search.html";
	}
}

window.addEventListener("load", function(){
	var regEmail = /^[a-z]+([\.-]?[a-z]+)*@[a-z]+([\.-]?[a-z]+)*(\.[a-z]+)+$/;

	document.getElementById("tbSearch").value = "Search...";
	document.getElementById("tbEmail").value = "Enter e-mail...";

	if(document.cookie !== ""){
		var cookies = document.cookie.split(";");
		var username;
		for(var i = 0; i < cookies.length; i++){
			if(cookies[i].split("=")[0].trim() === "username"){
				document.getElementById("login").innerHTML = "User: " + cookies[i].split("=")[1];
				document.getElementById("logout").style.visibility = "visible";
			}
			
		}
	}

	document.getElementById("btnSearch").addEventListener("click", function(){
		find();
	});

	document.getElementById("tbSearch").addEventListener("keyup", function(e){
		if(e.keyCode === 13)
			find();
		if(this.value === "Enter search term!"){
			this.value = "";
			this.style.color = "#000";
		}
	});

	document.getElementById("formSearch").addEventListener("submit", function(e){
		e.preventDefault();
	});

	document.getElementById("tbSearch").addEventListener("blur", function(){
		if(this.value === ""){
			this.value = "Search...";
			this.style.color = "#555";
		}
	});

	document.getElementById("tbSearch").addEventListener("focus", function(){
		if(this.value === "Search..." || this.value === "Enter search term!"){
			this.value = "";
			this.style.color = "#000";
		}
	});

	document.getElementById("tbEmail").addEventListener("blur", function(){
		if(this.value === ""){
			this.value = "Enter e-mail...";
			this.style.color = "#555";
		}
	});
	
	document.getElementById("tbEmail").addEventListener("focus", function(){
		if(this.value === "Enter e-mail..." || this.value === "You are subscribed!" || this.value === "Enter valid address!"){
			this.value = "";
			this.style.color = "#000";
		}
	});

	document.getElementById("btnEmail").addEventListener("click", function(){
		var email = document.getElementById("tbEmail");
		if(regEmail.test(email.value)){
			email.value = "You are subscribed!";
		}
		else{
			email.value = "Enter valid address!";
			email.style.color = "#F03247";
		}
	});

	document.getElementById("logout").addEventListener("click", function(){
		var date = new Date();
		date.setYear(1970);
		document.cookie = "username=;expires=" + date.toGMTString();
		location.reload();
	});

	console.log("  _____ __ __ ___  ________________  ____  ___    ____  ____   ____________  __\n  / ___// //_//   |/_  __/ ____/ __ )/ __ \\/   |  / __ \\/ __ \\ /  _/ ____/\\ \\/ /\n  \\__ \\/ ,<  / /| | / / / __/ / __  / / / / /| | / /_/ / / / / / // /_     \\  / \n ___/ / /| |/ ___ |/ / / /___/ /_/ / /_/ / ___ |/ _, _/ /_/ /_/ // __/     / /  \n/____/_/ |_/_/  |_/_/ /_____/_____/\\____/_/  |_/_/ |_/_____//___/_/       /_/   made by simon - 2016\n\nThis website would not be possible without:\nhttp://jquery.com/\nhttp://fancyapps.com/fancybox\nhttp://imagesloaded.desandro.com/\nhttp://fontawesome.io/\nAnd the makers of the internet!\n");

});