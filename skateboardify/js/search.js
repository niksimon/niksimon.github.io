function showsearch(xmlDoc, searchTerm){
	var items = xmlDoc.getElementsByTagName("item"),
		results = document.getElementById("results"),
		resNum = 0;
	var notFound = document.createElement("span");
	notFound.className = "not-found";
	searchTerm = searchTerm.toLowerCase().trim();
	results.innerHTML = "";

	if(searchTerm !== ""){
		for(var i = 0; i < items.length; i++){
			var txt = {itemName:"name", price:"price", folder:"folder", image:"image", url:"url"};
			for(var t in txt){
				txt[t] = items[i].getElementsByTagName(txt[t])[0].childNodes[0].nodeValue;
			}
			if(txt.itemName.toLowerCase().indexOf(searchTerm) > -1 || txt.price.toLowerCase().indexOf(searchTerm) > -1
				|| txt.folder.split("/")[1].indexOf(searchTerm) > - 1 || txt.image.split(".")[0].indexOf(searchTerm) > -1){
				var result = document.createElement("div"),
					itemImage = document.createElement("div"),
					lightboxLink = document.createElement("a"),
					img = document.createElement("img"),
					zoomIn = document.createElement("img"),
					name = document.createElement("p"),
					price = document.createElement("p"),
					url = document.createElement("a"),
					overlay = document.createElement("div"),
					overlayImage = document.createElement("img");
				result.className = "result";
				itemImage.className = "item-image";
				lightboxLink.className = "fancybox";
				img.className = "product";
				zoomIn.className = "zoomin";
				name.className = "item-description";
				price.className = "item-price";
				url.className = "item-url";
				overlay.className = "item-overlay";
				setAttr(overlayImage, {"src": "images/icons/loader2.gif", "alt": "Loading..."});
				overlay.appendChild(overlayImage);
				setAttr(lightboxLink, {"href": txt.folder + "/large/" + txt.image, "data-fancybox-group": "group", "title": txt.itemName});
				setAttr(img, {"src": txt.folder + "/" + txt.image, "alt": txt.image.split(".")[0]});
				setAttr(zoomIn, {"src": "images/icons/zoom.png", "alt": "Zoom"});
				url.setAttribute("href", txt.url);

				appendChilds(lightboxLink, [img, zoomIn]);
				appendChilds(itemImage, [overlay, lightboxLink]);
				name.appendChild(document.createTextNode(txt.itemName));
				price.appendChild(document.createTextNode("\u0024" + txt.price));
				url.appendChild(document.createTextNode("GO TO PAGE"));
				appendChilds(result, [itemImage, name, price, url]);
				results.appendChild(result);

				resNum++;
			}
		}
		if(resNum === 0){
			notFound.appendChild(document.createTextNode("Sorry, we can't find that..."));
			var notFoundImage = document.createElement("img");
			setAttr(notFoundImage, {"src": "images/icons/sadface.png", "alt": "Sad face", "title": "Sad face"});
			notFoundImage.className = "not-found-image";
			notFound.appendChild(notFoundImage);
			results.appendChild(notFound);
		}
		else{
			var foundNum = document.createElement("h3");
			foundNum.className = "found-num";
			foundNum.appendChild(document.createTextNode("Found " + resNum + (resNum === 1 ? " item" : " items")));
			results.insertBefore(foundNum, results.childNodes[0]);
			$(results).find(".product").each(function(){
				var $this = $(this);
				$this.imagesLoaded(function(){
					$this.parent().prev().fadeOut(500);
				});
			});
		}
	}
	else{
		notFound.appendChild(document.createTextNode("Enter a search term..."));
		results.appendChild(notFound);
	}
}

function appendChilds(parent, childs){
	for(var i = 0; i < childs.length; i++)
		parent.appendChild(childs[i]);
}

function setAttr(element, attributes){
	for(var a in attributes){
		element.setAttribute(a, attributes[a]);
	}
}

window.addEventListener("load", function(){
	var xhttp, xmlDoc;
	var instant = document.getElementById("instantSearch");
	if(window.XMLHttpRequest)
		xhttp = new XMLHttpRequest();
	else if(window.ActiveXObject)
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	else{
		alert("No AJAX support!");
		xhttp = null;
	}
	if(xhttp !== null){
		xhttp.addEventListener("readystatechange", function(){
			if(xhttp.readyState === 4 && xhttp.status === 200){
				xmlDoc = xhttp.responseXML;
				if(window.localStorage.getItem("search") === null)
					window.localStorage.setItem("search", "");
				showsearch(xmlDoc, window.localStorage.getItem("search"));
				instant.addEventListener("keyup", function(){
					showsearch(xmlDoc, this.value);
				});
			}
		});
		xhttp.open("GET", "xml/items.xml", true);
		xhttp.send();
	}
	instant.focus();
	instant.value = window.localStorage.getItem("search");
	instant.selectionStart = instant.value.length;
});