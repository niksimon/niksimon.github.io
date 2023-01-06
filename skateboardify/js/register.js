window.addEventListener("load", function(){
	var ids = ["tbRUserName", "tbRName", "tbRegisterEmail", "tbPass1", "tbPass2"];
	var tbRUserName = document.getElementById("tbRUserName"),
		tbRName = document.getElementById("tbRName"),
		tbRegisterEmail = document.getElementById("tbRegisterEmail"),
		tbPass1 = document.getElementById("tbPass1"),
		tbPass2 = document.getElementById("tbPass2"),
		ddlCountry = document.getElementById("ddlCountry"),
		showError = document.getElementById("showError");

	var regEmail = /^[a-z]+([\.-]?[a-z]+)*@[a-z]+([\.-]?[a-z]+)*(\.[a-z]+)+$/,
		regName = /^[A-Z][a-z]{2,20}(\s[A-Z][a-z]{2,20})*$/,
		regUsername = /^[A-z][A-z\d]{2,20}$/,
		regPassword = /^[A-z\d]{5,15}$/;

	document.getElementById("tbSignup").addEventListener("click", function(){
		var error = false;
		for(var i = 0; i < ids.length; i++)
			document.getElementById(ids[i]).style.boxShadow = "none";
		
		ddlCountry.style.boxShadow = "none";
		if(!regUsername.test(tbRUserName.value)){
			tbRUserName.style.boxShadow = "inset 0 0 4px #F03247";
			error = true;
		}
		if(!regName.test(tbRName.value)){
			if(!error){
				error = true;
			}
			tbRName.style.boxShadow = "inset 0 0 4px #F03247";
		}
		if(!regEmail.test(tbRegisterEmail.value)){
			if(!error){
				error = true;
			}
			tbRegisterEmail.style.boxShadow = "inset 0 0 4px #F03247";
		}
		if(!regPassword.test(tbPass1.value)){
			if(!error){
				error = true;
			}
			tbPass1.style.boxShadow = "inset 0 0 4px #F03247";
			tbPass2.style.boxShadow = "inset 0 0 4px #F03247";
		}
		if(tbPass1.value !== tbPass2.value){
			if(!error){
				error = true;
			}
			tbPass2.style.boxShadow = "inset 0 0 4px #F03247";
		}
		if(ddlCountry.selectedIndex === 0){
			if(!error){
				error = true;
			}
			ddlCountry.style.boxShadow = "inset 0 0 4px #F03247";
		}

		if(!error){
			showError.innerHTML = "SUCCESSFULLY REGISTERED!";
			var date = new Date();
			date.setDate(date.getDate() + 5);
			document.cookie = "username=" + tbRUserName.value + ";expires=" + date.toGMTString();
		}
	});

	document.getElementById("tbReset").addEventListener("click", function(){
		for(var i = 0; i < ids.length; i++){
			document.getElementById(ids[i]).value = "";
			document.getElementById(ids[i]).style.boxShadow = "none";
		}
		ddlCountry.style.boxShadow = "none";
		ddlCountry.selectedIndex = 0;
	});
});