window.addEventListener("load", function(){
	var ids = ["tbCName", "tbCEmail", "tbCSubject", "taMessage"];
	var text = ["Your name", "Email", "Subject", "Message"];
	var regEmail = /^[a-z]+([\.-]?[a-z]+)*@[a-z]+([\.-]?[a-z]+)*(\.[a-z]+)+$/,
		regName = /^[A-Z][a-z]{2,20}(\s[A-Z][a-z]{2,20})*$/;
	var fillText = "Please fill out this field.";
	var random1 = Math.floor(Math.random() * 10 + 1),
		random2 = Math.floor(Math.random() * 10 + 1);
	document.getElementById("calculate").innerHTML = random1 + " + " + random2 + " = ";

	for(var i = 0; i < 4; i ++){
		document.getElementById(ids[i]).value = text[i];
		(function(i){
			document.getElementById(ids[i]).addEventListener("focus", function(){
				if(this.value === text[i]){
					this.style.color = "#333";
					this.value = "";
				}
			});
		})(i);
	}

	var fieldOK = [false, false, false, false, false];
	document.getElementById(ids[0]).addEventListener("blur", function(){
		if(this.value.length === 0 || this.value === text[0]){
			fieldOK[0] = false;
			this.value = text[0];
			this.style.color = "#888";
			document.getElementById("error1").innerHTML = fillText;
		}
		else if(!regName.test(this.value)){
			fieldOK[0] = false;
			this.value = text[0];
			this.style.color = "#888";
			document.getElementById("error1").innerHTML = "Invalid characters.";
		}
		else{
			fieldOK[0] = true;
			document.getElementById("error1").innerHTML = "";
		}
	});
	document.getElementById(ids[1]).addEventListener("blur", function(){
		if(this.value.length === 0){
			fieldOK[1] = false;
			this.value = text[1];
			this.style.color = "#888";
			document.getElementById("error2").innerHTML = fillText;
		}
		else if(!regEmail.test(this.value)){
			fieldOK[1] = false;
			this.value = text[1];
			this.style.color = "#888";
			document.getElementById("error2").innerHTML = "Invalid e-mail.";
		}
		else{
			fieldOK[1] = true;
			document.getElementById("error2").innerHTML = "";
		}
	});
	document.getElementById(ids[2]).addEventListener("blur", function(){
		if(this.value.length === 0 || this.value === text[2]){
			fieldOK[2] = false;
			this.value = text[2];
			this.style.color = "#888";
			document.getElementById("error3").innerHTML = fillText;
		}
		else{
			fieldOK[2] = true;
			document.getElementById("error3").innerHTML = "";
		}
	});
	document.getElementById(ids[3]).addEventListener("blur", function(){
		if(this.value.length === 0){
			fieldOK[3] = false;
			this.value = text[3];
			this.style.color = "#888";
			document.getElementById("error4").innerHTML = fillText;
		}
		else{
			fieldOK[3] = true;
			document.getElementById("error4").innerHTML = "";
		}
	});
	document.getElementById("tbCalc").addEventListener("blur", function(){
		if(tbCalc.value.length === 0){
			fieldOK[4] = false;
			document.getElementById("error5").innerHTML = fillText;
		}
		else if(parseInt(tbCalc.value) !== random1 + random2){
			fieldOK[4] = false;
			document.getElementById("error5").innerHTML = "Incorrect value."
		}
		else{
			fieldOK[4] = true;
			document.getElementById("error5").innerHTML = "";
		}
	});

	document.getElementById("contactSend").addEventListener("click", function(){
		document.getElementById("sent").innerHTML = "";

		if(fieldOK[0] && fieldOK[1] && fieldOK[2] && fieldOK[3] && fieldOK[4]){
			document.getElementById("sent").innerHTML = "Message sent!";
			for(var i = 0; i < ids.length; i++){
				document.getElementById(ids[i]).value = text[i];
				document.getElementById(ids[i]).style.color = "#888";
			}
			document.getElementById("tbCalc").value = "";
			document.getElementById("tbCalc").style.color = "#333";
			random1 = Math.floor(Math.random() * 10 + 1);
			random2 = Math.floor(Math.random() * 10 + 1);
			document.getElementById("calculate").innerHTML = random1 + " + " + random2 + " = ";
			fieldOK[0] = fieldOK[1] = fieldOK[2] = fieldOK[3] = fieldOK[4] = false;
		}
		else{
			for(var i = 0; i < fieldOK.length; i++){
				if(!fieldOK[i])
					document.getElementById("error" + (i + 1)).innerHTML = fillText;
			}
		}
	});
});