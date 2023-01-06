$(document).ready(function(){
	$(".loginForm").append($("<div>Please fill the required fields.</div>").addClass("login-error"));

	$("body").click(function(e){
		if(e.target.className !== "loginForm" && $(".loginForm").find(e.target).length === 0){
			$(".loginForm").fadeOut(250);
			$(".login-error").fadeOut(250);
		}
		if(e.target.className !== "searchForm" && $(".searchForm").find(e.target).length === 0)
			$(".searchForm").fadeOut(250);
	});

	$(".search").click(function(){
		$(".loginForm").fadeOut(250);
		$(".login-error").fadeOut(250);
		$(".searchForm").stop(true).fadeToggle(250);
		$("#tbSearch").focus();
		return false;
	});

	$("#login").click(function(){
		if($(this).text() === "Log in"){
			$(".searchForm").fadeOut(250);
			$(".loginForm").stop(true).fadeToggle(250);
			$(".login-error").fadeOut(250);
			$(".loginForm #lbUsername").html("Username:");
			$(".loginForm #lbPassword").html("Password:");
			$(".loginForm #tbUsername").focus();
		}
		return false;
	});

	var showLoginError;
	$("#btnLogin").click(function(){
		var loginOK = true,
			username = $("#tbUsername").val();
		loginOK = username.length !== 0;
		loginOK = !loginOK ? false : $("#tbPassword").val().length !== 0;

		if(loginOK){
			var d = new Date();
			d.setMonth(d.getMonth() + 6);
			document.cookie = "username=" + username + ";expires=" + d.toGMTString();
			location.reload();
		}
		else{
			clearTimeout(showLoginError);
			$(".login-error").fadeIn(300, function(){
				showLoginError = setTimeout(function(){
					$(".login-error").fadeOut(300);
				}, 2000);
			});
		}
	});

	$(".nav li ul li a").hover(function(){
		$(this).stop(true).animate({textIndent: 10}, 100);
	}, function(){
		$(this).stop(true).animate({textIndent: 0}, 100);
	});
	
	$(".nav > li").hover(function(){
		$(this).find("ul").stop(true).slideDown(300);
	}, function(){
		$(this).find("ul").stop(true).slideUp(300);
	});

	$(".gototop").click(function(){
		$("html, body").stop(true).animate({scrollTop: 0}, 1000);
		return false;
	});

	$(".gotologin").click(function(){
		$("html, body").stop(true).animate({scrollTop: "0px"}, 1000, function(){
			$(".loginForm #tbUsername").focus();
		});
		if($("#login").text() === "Log in"){
			$(".searchForm").hide();
			$(".loginForm:hidden").stop(true).fadeToggle(250);
			$(".loginForm #lbUsername").html("Username:");
			$(".loginForm #lbPassword").html("Password:");
		}
		return false;
	});	

	var footerVisible = false;
	if($(window).scrollTop() > $(document).height() - $(window).height() - 300){
		$(".footer").animate({top: 0, opacity: 1}, 2000);
		footerVisible = true;
	}

	$(window).scroll(function(){
		if(!footerVisible && $(window).scrollTop() > $(document).height() - $(window).height() - 300){
			footerVisible = true;
			$(".footer").animate({top: 0, opacity: 1}, 1000);
		}
	});

	/*var showSurvey = true, showError, votes = 0;
	if(document.cookie !== ""){
		var cookies = document.cookie.split(";");
		for(var i = 0; i < cookies.length; i++){
			if(cookies[i].split("=")[0].trim() === "rate"){
				showSurvey = false;
			}
			else if(cookies[i].split("=")[0].trim() === "votes"){
				votes = parseInt(cookies[i].split("=")[1]);
			}
		}
	}

	if(showSurvey)
		setTimeout(function(){
			$("#survey-wrap").fadeIn(1200);
	}, 5000);

	$("#surveyBtn").click(function(){
		var choice = null, rbSurvey;
		rbSurvey = $("[name='rbSurvey']");
		rbSurvey.each(function(){
			if($(this).is(":checked"))
				choice = $(this).val();
		});
		if(choice !== null){
			votes++;
			$("#survey").fadeOut(300);
			$("#rateOver").html("<div style='margin-left:10px;font-weight:300'><p>Thanks for rating!</p><p>Your choice:</p><p style='margin-top:30px'>" + choice + "</p><p style='margin-top:30px'>Votes: " + votes + "</p></div>");
			$("#rateOver").fadeIn(300);
			var d = new Date();
			d.setDate(d.getDate() + 1);
			document.cookie = "rate=" + choice + ";expires=" + d.toGMTString();
			d.setMonth(d.getMonth() + 6);
			document.cookie = "votes=" + votes + ";expires=" + d.toGMTString();
			setTimeout(function(){
				$("#survey-wrap").fadeOut(600);
			}, 3000);
		}
		else{
			clearTimeout(showError);
			$(".survey-error").fadeIn(300, function(){
				showError = setTimeout(function(){
					$(".survey-error").stop(true).fadeOut(300);
				}, 2000);
			});
		}
	});

	$(".survey-close").click(function(){
		$("#survey-wrap").stop(true).fadeOut(600);
		return false;
	});*/
});