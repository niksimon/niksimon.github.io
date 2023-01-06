function changeImage(){
	var $currentImg = $(".slideshow .image-change .active");
	var $nextImg = $currentImg.next().is(".slide-background") ? $currentImg.next() : $(".slideshow .image-change .slide-background:first");
	$nextImg.css("z-index", 2);
	$currentImg.fadeOut(3000, function(){
		$currentImg.css("z-index", 1).show().removeClass("active");
		$nextImg.css("z-index", 3).addClass("active");
	});
	setTimeout("changeImage()", 6000);
}

function changeReview($currentReview, $nextReview, direction){
	$currentReview.animate({opacity: 0, left: direction === "right" ? "100%" : "0%"}, 250, function(){
		$currentReview.css("left", "50%").removeClass("review-active");
	});
	$nextReview.animate({opacity: 1, left: "50%"}, 250).addClass("review-active");
}

var mouseClicked = false;
function prepareChangeReview($currentReview, $nextReview, percent, direction){
	$nextReview.css("left", percent);
	changeReview($currentReview, $nextReview, direction);
	mouseClicked = true;
	setTimeout(function(){
		mouseClicked = false;
	}, 350);
}

$(document).ready(function(){
	setTimeout(function(){
		$(".overlay img").fadeIn(4000);
	}, 500);

	$(".image-change .active").imagesLoaded({background: true}, function(){
		$(".image-change .overlay").fadeOut(1500);
		setTimeout("changeImage()", 6000);
	});

	$(".scroll-down").click(function(){
		$("html, body").stop(true).animate({scrollTop: $(".middle-wrap").offset().top}, 1000);
		return false;
	});

	$(".reviews-wrap .reviews-background").imagesLoaded({background: true}, function(){
		var scroll = Math.floor($(window).scrollTop() * 0.3 - 400);
		$(".reviews-background").css("-webkit-transform", "translate3d(0, " + scroll + "px, 0");
		$(".reviews-background").css("-moz-transform", "translate3d(0, " + scroll + "px, 0");
		$(".reviews-background").css("-ms-transform", "translate3d(0, " + scroll + "px, 0");
		$(".reviews-background").css("-o-transform", "translate3d(0, " + scroll + "px, 0");	
		$(".reviews-background").css("transform", "translate3d(0, " + scroll + "px, 0");
		$(".reviews-wrap .overlay").fadeOut(1000);
	});

	$(".change-review .review-next").click(function(){
		var $currentReview = $(".reviews .review-active");
		var $nextReview = $currentReview.next().is("div") ? $currentReview.next() : $(".reviews .review:first");

		if(!mouseClicked){
			prepareChangeReview($currentReview, $nextReview, "0%", "right");
		}
	});

	$(".change-review .review-previous").click(function(){
		var $currentReview = $(".reviews .review-active");
		var $nextReview = $currentReview.prev().is("div") ? $currentReview.prev() : $(".reviews .review:last");

		if(!mouseClicked){
			prepareChangeReview($currentReview, $nextReview, "100%", "left");
		}
	});

	var middleVisible = false;
	if($(window).scrollTop() > 100){
		middleVisible = true;
		$(".middle").animate({left: 0, opacity: 1}, 1000);
	}

	$(window).scroll(function(){
		var scroll = Math.floor($(window).scrollTop() * 0.3 - 400);
		$(".reviews-background").css("-webkit-transform", "translate3d(0, " + scroll + "px, 0");
		$(".reviews-background").css("-moz-transform", "translate3d(0, " + scroll + "px, 0");
		$(".reviews-background").css("-ms-transform", "translate3d(0, " + scroll + "px, 0");
		$(".reviews-background").css("-o-transform", "translate3d(0, " + scroll + "px, 0");	
		$(".reviews-background").css("transform", "translate3d(0, " + scroll + "px, 0");

		if(!middleVisible && $(window).scrollTop() > 100){
			middleVisible = true;
			$(".middle").animate({left: 0, opacity: 1}, 1000);
		}
	});

});