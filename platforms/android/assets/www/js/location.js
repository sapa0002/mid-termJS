var errorDiv;
var currentContact;
//var marker;
var locationJS = {

	getLocation: function (contact) {

		currentContact = contact;
		document.querySelector(".titleMap").innerHTML="Location of "+contact.name;

		//if browser does not support geolocation API
		if (!navigator.geolocation) {
			//Error message pop up
			__errorMsg("Sorry, but your browser does not support location based awesomeness.");
			return;
		}

		console.log(contact);

		if (contact.latitude && contact.lognitude) 
		{
			document.querySelector("#Done").style.display = "none";
			
			var latitude = contact.latitude;
			var longitude = contact.lognitude;
			document.querySelector("#locating").innerHTML = "";

			var center = new google.maps.LatLng(latitude, longitude);
			//console.log(center);

			//set map option
			var mapOptions = {
				zoom: 14,
				center: center,
				disableDoubleClickZoom: true
			};
			var map = new google.maps.Map(document.getElementById('map_canvas'),
				mapOptions);
			locationJS.placeMarker(center, map);
			map.panTo(center);

		} else {

//			alert("Double tap anywhere on the map to set your position.");
			document.querySelector("#Done").style.display = "block";

			var params = {
					enableHighAccuracy: true,
					timeout: 5000
				}
			//get current position
			navigator.geolocation.getCurrentPosition(locationJS.success, locationJS.error, params);
		}
	},
	success: function (position) {
		
		//alert("sucess")
		document.querySelector("#locating").innerHTML = "Double tap anywhere on the map to set position.";
		
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		

		var center = new google.maps.LatLng(latitude, longitude);
		console.log(center);

		//set map option
		var mapOptions = {
			zoom: 14,
			center: center,
			disableDoubleClickZoom: true
		};
		var map = new google.maps.Map(document.getElementById('map_canvas'),
			mapOptions);

		//set ONLY ONE marker on double click
		google.maps.event.addListenerOnce(map, 'dblclick', function (e) {
			//console.log(e);
			locationJS.placeMarker(e.latLng, map);
		});
	},
	error: function (err) {
		alert('ERROR(' + err.code + '): ' + err.message);
		document.querySelector("#locating").innerHTML = "";
		__errorMsg("Unable to retrieve your location. Error code : " + err.code);
	},
	placeMarker: function (position, map) {
		
		document.querySelector("#locating").innerHTML = "";
		
		var marker = new google.maps.Marker({
			position: position,
			animation: google.maps.Animation.DROP,
			map: map
		});
		map.panTo(position);
		
		var markerLat=marker.getPosition().lat();
		var markerLong=marker.getPosition().lng();
		
		currentContact.latitude=markerLat;
		currentContact.lognitude=markerLong;
		//console.log(currentContact);
		
		//Update local storage
		var id=currentContact.id;
		contactList[id]=currentContact;
		//console.log(contactList);
		
		// add contact to local storage
		localStorage.setItem('contactListPate0359', JSON.stringify(contactList));
		
		//Get contacts from storage
		var jsonObject = localStorage.getItem('contactListPate0359');	
		contactList=JSON.parse(jsonObject);
		
//		console.log("position : "+marker.getPosition());
//		console.log("lat : "+marker.getPosition().lat());
//		console.log("logn : "+marker.getPosition().lng());

	}
}
var contactJS = {
	getContacts: function () {
		var options = new ContactFindOptions();
		//	options.filter = "";
		//	var fields = ["displayName", "name"];
		options.multiple = true;
		var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.phoneNumber];
		navigator.contacts.find(fields, contactJS.onSuccess, contactJS.onError, options);
	},
	onSuccess: function (contacts) {
		document.querySelector("#contactLoading").innerHTML = "";
		if (contacts.length == 0) {
			__errorMsg("No contacts available.");
		}
		else {
		var array=[];
		
		//Display only 12 contacts
		var contactLength=(contacts.length>=12)?12:contacts.length;
		
		for (var i = 0; i < contactLength; i++) {
			if(contacts[i].displayName)
			{
				var name = contacts[i].displayName;
				var number = contacts[i].phoneNumbers;
				var contact = {
					'id': i,
					'name': name,
					'phonenumber': number,
					'latitude': null,
					'lognitude': null
				};

				array.push(contact);
			}			
		}
		// add contact to local storage
		localStorage.setItem('contactListPate0359', JSON.stringify(array));
		//Get contacts from storage
		var jsonObject = localStorage.getItem('contactListPate0359');	
		contactList=JSON.parse(jsonObject);
		app.addContactListElement(contactList);
	 }
	},
	onError: function (contactError) {
		document.querySelector("#contactLoading").innerHTML = "";
		__errorMsg("Error while fetching contacts.");
	}
}

/*
	@Description : This function is used to show error 
*/
function __errorMsg(errorMsg){
		errorDiv = document.querySelector("#err_dialog");
		if (!errorDiv) {
			errorDiv = document.createElement("div");
			errorDiv.setAttribute("id", "err_dialog");
			document.body.appendChild(errorDiv);
		}
		errorDiv.style.display = 'block';
		errorDiv.innerHTML = errorMsg;

		//set timeout for error msg
		setTimeout(function () {
			errorDiv.style.display = 'none';
		}, 3000); //3secs
		
}