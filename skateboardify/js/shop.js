$(document).ready(function(){
	var offsetY = $(".left-inner").offset().top;

	$(".item-overlay").each(function(){
		var $this = $(this);
		setTimeout(function(){
			$this.find("img").fadeIn(1000);
		}, 500);
	})

	$(".item-image .product").each(function(){
		var $this = $(this);
		$(this).imagesLoaded(function(){
			$this.parent().prev(".item-overlay").fadeOut(1000);
		});
	});

	$(".left-shop").css("height", (parseInt($(".right-shop").css("height")) - 6) + "px");

	$("body").css("background-position", "right " + ($(document).height() - 720) + "px");

	if($(window).scrollTop() > offsetY){
		$(".left-inner").css("top", ($(window).scrollTop() - offsetY) + "px");
	}

	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();
		if(scrollTop > offsetY && scrollTop < $(document).height() - 700){
			$(".left-inner").css("top", (scrollTop - offsetY) + "px");
		}
		else if(scrollTop <= offsetY)
			$(".left-inner").css("top", "0px");
	});

	var cartItemsBox = $("<div id='cart-items'></div>");
	$(".wrapper").append(cartItemsBox);
	$("#view-cart").attr("href", "#cart-items");

	var cartItemsCookie = "";
	if(document.cookie !== ""){
		var cookies = document.cookie.split(";");
		for(var i = 0; i < cookies.length; i++){
			if(cookies[i].split("=")[0].trim() === "cart-price"){
				$("#cart-price").html("&#36; " + cookies[i].split("=")[1]);
			}
			else if(cookies[i].split("=")[0].trim() === "cart-items"){
				cartItemsCookie = cookies[i].split("=")[1];
			}
		}
	}

	var items = [];
	var cartItems = [];
	var cartItem = function(id, name, quantity, price, image){
		this.id = id;
		this.name = name;
		this.quantity = parseInt(quantity);
		this.singlePrice = parseFloat(price).toFixed(2);
		this.price = parseFloat(quantity * price).toFixed(2);
		this.image = image;
		this.update = function(){
			this.quantity++;
			this.price = parseFloat(this.quantity * this.singlePrice).toFixed(2);
		}
	};

	function findItem(id){
		for(var i = 0; i < items.length; i++){
			if(items[i].id === id){
				return items[i];
			}
		}
	}

	function totalPrice(){
		var totalPrice = 0.0;
		for(var i = 0; i < cartItems.length; i++)
			totalPrice += parseFloat(cartItems[i].price);
		return totalPrice.toFixed(2);
	}

	function fillCart(){
		cartItemsBox.empty();
		var cartItemsHTML = "<h2>Your shopping cart:</h2>";
		cartItemsHTML += "<table><thead><th>ITEM DESCRIPTION</th><th>QUANTITY</th><th>PRICE</th></thead><tbody>";
		for(var i = 0; i < cartItems.length; i++){
			cartItemsHTML += "<tr><td><img src='" + cartItems[i].image + "' alt='Cart item'/><p><span>" + cartItems[i].name + "</span><a href='#' id='remove" + cartItems[i].id + "-" + cartItems[i].quantity + "'>REMOVE</a></p></td><td>" + cartItems[i].quantity + "</td><td>\u0024 " + cartItems[i].price + "</td></tr>";
		}
		cartItemsHTML += "<tr class='total-price'><td></td><td>Total cost:</td><td>\u0024 " + totalPrice() + "</td></tr>";
		cartItemsHTML += "<tr class='cart-pay'><td></td><td></td><td><a href='#' class='cart-pay'>PAY NOW</a></td></tr>";
		cartItemsHTML += "</tbody></table>";
		cartItemsBox.append(cartItemsHTML);
		for(var i = 0; i < cartItems.length; i++){
			(function(i){
				$("#remove" + cartItems[i].id + "-" + cartItems[i].quantity).click(function(event){
					var sepPos = event.target.id.indexOf("-");
					var cartItemID = event.target.id.substring(6, sepPos);
					var cartItemQ = event.target.id.substring(sepPos + 1, event.target.id.length);
					$(this).parent().parent().parent().remove();
					cartItemsCookie = cartItemsCookie.replace(cartItemID + "%" + cartItemQ + "$", "");
					cartItemsCookie = cartItemsCookie.replace(cartItemID + "%" + cartItemQ, "");
					cartItemsCookie = cartItemsCookie.replace(/\$+/g, "$");
					cartItems.splice(i, 1);
					var d = new Date();
					d.setDate(d.getDate() + 1);
					$(".total-price td:eq(2)").text("\u0024 " + totalPrice());
					$("#cart-price").text("\u0024 " + totalPrice());
					document.cookie = "cart-price=" + totalPrice() + ";expires=" + d.toGMTString();
					document.cookie = "cart-items=" + cartItemsCookie + ";expires=" + d.toGMTString();
					return false;
				});
			})(i);
		}
	}

	$.get("xml/items.xml", function(data){
		$(data).find("item").each(function(i){
			items.push({id: $(this).find("id").text(), name: $(this).find("name").text(), price: $(this).find("price").text(), image: $(this).find("folder").text() + "/" + $(this).find("image").text()});
		});

		var cartItemsSplit;
		if(cartItemsCookie !== ""){
			if(cartItemsCookie.charAt(cartItemsCookie.length - 1) === "$")
				cartItemsCookie = cartItemsCookie.substring(0, cartItemsCookie.length - 1);
			cartItemsSplit = cartItemsCookie.split("$");
			for(var i = 0; i < cartItemsSplit.length; i++){
				var cartItemID = cartItemsSplit[i].split("%")[0];
				var cartItemOBJ = findItem(cartItemID);
				if(cartItemOBJ !== undefined)
					cartItems.push(new cartItem(cartItemID, cartItemOBJ.name, cartItemsSplit[i].split("%")[1], cartItemOBJ.price, cartItemOBJ.image));
			}
		}

		fillCart();
	});

	var totalCost;
	$(".btn-cart").click(function(){
		var itemID = $(this).attr("id");
		var cookies = document.cookie.split(";");
		var itemOBJ = null;
		for(var i = 0; i < items.length; i++){
			if(itemID === items[i].id){
				itemOBJ = items[i];
				break;
			}
		}
		
		if(cartItemsCookie === ""){
			for(var i = 0; i < cookies.length; i++){
				if(cookies[i].split("=")[0].trim() === "cart-items"){
					cartItemsCookie = cookies[i].split("=")[1];
				}
			}
		}

		var quantity, foundItem = false;
		for(var i = 0; i < cartItems.length; i++){
			if(itemID === cartItems[i].id){
				quantity = cartItems[i].quantity;
				cartItemsCookie = cartItemsCookie.replace(itemID + "%" + quantity, itemID + "%" + (quantity + 1));
				cartItems[i].update();
				foundItem = true;
				break;
			}
		}
		if(!foundItem){
			if(cartItemsCookie === "")
				cartItemsCookie += itemID + "%1";
			else{
				cartItemsCookie += "$" + itemID + "%1";
			}
			var cartItemOBJ = findItem(itemID);
			cartItems.push(new cartItem(itemID, cartItemOBJ.name, 1, cartItemOBJ.price, cartItemOBJ.image));
		}

		fillCart();

		var d = new Date();
		d.setDate(d.getDate() + 1);

		$("#cart-price").text("\u0024 " + totalPrice());
		document.cookie = "cart-price=" + totalPrice() + ";expires=" + d.toGMTString();

		document.cookie = "cart-items=" + cartItemsCookie + ";expires=" + d.toGMTString();

		return false;
	});

});