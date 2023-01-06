$(document).ready(function(){
	$(".main").animate({opacity: 1, top: 0}, 1000);
	
	$(".tabs li").click(function(){
		$(".tab-current").stop(true).fadeOut(300);
		var activeTab = "#" + $(this).find("a").attr("href");
		
		$(".main-wrap").stop(true).animate({height: Math.max($(activeTab).height() + 50, 450)}, "fast");
		$(activeTab).stop(true).fadeIn(300);
		$(activeTab).addClass("tab-current");

		$(".tabs li").removeClass("tab-active");
		$(this).addClass("tab-active");

		return false;
	});

	$(".tab-content a").click(function(){
		var mainHeight = $(".main-wrap").height();
		if($(this).hasClass("open")){
			$(".main-wrap").stop(true).animate({height: Math.max(mainHeight - 70, 450)}, "fast");
			$(this).next().stop(true).slideUp("fast");
			$(this).removeClass("open");
		}
		else{
			$(".main-wrap").stop(true).animate({height: Math.max(mainHeight + 70, 450)}, "fast");
			$(this).next().stop(true).slideDown("fast");
			$(this).addClass("open");
		}

		return false;
	});
});