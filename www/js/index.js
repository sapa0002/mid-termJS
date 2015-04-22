var listing;
var errorMessage;
var fetchContacts;

var midterm = {
	start: function () {

		document.querySelector("[data-role=modal]").style.display = "none";
		document.querySelector("[data-role=overlay]").style.display = "none";

		document.querySelector("#page1").style.display = "block";
		document.querySelector("#page2").style.display = "none";

		document.getElementById("btn1").addEventListener("click", midterm.done);

		document.getElementById("Close").style.display = "none";
		document.getElementById("Close").addEventListener("click", midterm.start);

		var getObj = localStorage.getItem('contactLists');
		listing = JSON.parse(getObj);

		if (!listing) {fetchContact.fetchingContacts();} 
		else 
		{
			document.querySelector("#diplayingContacts").innerHTML = "";
			midterm.addToList(listing);
		}
		
	},
	
	addToList: function (contacts) {
		document.querySelector("#contactsView").innerHTML = "";

		for (var v = 0; v < contacts.length; v++)
		{
			var createList = document.createElement("li");
			createList.innerHTML = contacts[v].name;
			createList.setAttribute("id", contacts[v].id);
			midterm.hammerTapping(createList);
			document.querySelector('#contactsView').appendChild(createList);
		}
	},
	
	done: function (ev) {
		document.querySelector("[data-role=modal]").style.display = "none";
		document.querySelector("[data-role=overlay]").style.display = "none";
	},
	mapping: function (contact) {

		createLocations(contact);

		document.querySelector("#page1").style.display = "none";
		document.querySelector("#page2").style.display = "block";

	},
	
	hammerTapping: function (element) {
	
		var hmr = new Hammer.Manager(element);
		hmr.add(new Hammer.Tap({
			event: 'singletap',
			taps: 1
		}));
		hmr.add(new Hammer.Tap({
			event: 'doubletap',
			taps: 2
		}));
		
		hmr.get('singletap').requireFailure('doubletap');
        hmr.get('doubletap').recognizeWith('singletap');
		hmr.on("singletap doubletap", function (tap) {

			if (tap.type == 'singletap')
			{
				midterm.dialogBox(listing[tap.target.id]);

			} 
			else if (tap.type == 'doubletap') 
			{

				midterm.mapping(listing[tap.target.id]);
			}
		});
	}
}

//contacts
var fetchContact = {
	fetchingContacts: function () {
		var options = new ContactFindOptions();
		options.multiple = true;
		var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
		navigator.contacts.find(fields, successFunc, errFunc, options);
},

	successFunc: function (contacts) {
        
	document.querySelector("#diplayingContacts").innerHTML="";
	for (var i = 0; i < contacts.length; i++) {
		
		if(contacts[i].displayName)
		{
			var li = document.createElement("li");
			li.innerHTML=contacts[i].displayName;
			document.querySelector("#diplayingContacts").appendChild(li);
		}
	}

		var contactsHolder=[];

		var contactsNum=(contacts.length>=12)?12:contacts.length;

		for (var v = 0; v < contactsNum; v++) 
        {
			if(contacts[v].displayName)
			{
                
			var getName = contacts[v].displayName;
            
            var phoneNum = contacts[i].displayNums;
			
			var profile = {'id': v, 'name': getName,'phonenumber':phoneNum, 'longitude': null, 'latitude': null
						  };
				
			contactsHolder.push(contact);
			}
		}
		var jsonArray =JSON.stringify(contactsHolder);
		localStorage.setItem('contactLists', jsonArray);

		var getObj = localStorage.getItem('contactLists');
		listing=JSON.parse(getObj);
		midterm.addToList(listing);
	},
        
        errFunc: function (contactsError) {
	alert('Error!');
	}
}


/*Fetching the location of the user*/

	function createLocations (contact) {

		fetchContacts = contact;
		document.querySelector(".location1").innerHTML="belongs to "+contact.name;
		
      if (contact.latitude && contact.longitude) 
		  {
			document.querySelector("#Close").style.display = "none";
			
			var ltd = contact.latitude;
			var lgt = contact.longitude;
			document.querySelector("#yourlocation").innerHTML = "";

			var selectPos = new google.maps.LatLng(latitude, longitude);
		
			var mapOptions = {zoom: 14, center: selectPos,
							   disableDoubleClickZoom: true
			                 };
				
				
			var gettingMap = new google.maps.Map(document.getElementById('id1'),
				mapOptions);
			varLocations.makingMapMarker(selectPos, gettingMap);
			gettingMap.panTo(selectPos);

		} else {
			document.querySelector("#Close").style.display = "block";

			var params = { enableHighAccuracy: true,
					      timeout: 5000
						}
		
	       navigator.geolocation.getCurrentPosition(yesLocation, noLocation, parameters);	
		}	
        
			
	}
	

    function yesLocation(position){
	document.querySelector("#yourlocation").innerHTML = "Tapping twice will dynamically show your location";
	var lngt = position.coords.longitude;
	var ltd = position.coords.latitude;
	document.querySelector("#yourLocation").innerHTML = "";
	
	var selectPos = new google.maps.LatLng(latitude, longitude);
		
		var mapOptions = {
			zoom: 14,
			center: selectPos,
			disableDoubleClickZoom: true
		};
		var  gettingMap  = new google.maps.Map(document.getElementById('id1'),
			mapOptions);

		google.maps.event.addListenerOnce( gettingMap , 'dblclick', function (e) {
		
			varLocations.makingMap(e.latLng,  gettingMap );
		});
	
};

function noLocation() {
	
		document.querySelector("#yourLocation").innerHTML = "";
		errorMessage = document.createElement("div");
		errorMessage.setAttribute("id", "errorContainer");
		document.body.appendChild(errorMessage);
		errorMessage.innerHTML="Your location is uknown";	

}
    
  
		
	makingMapMarker: function (position, map) {
		
		document.querySelector("#yourlocation").innerHTML = "";
		
		var mapMarker = new google.maps.Marker({position: position, animation: google.maps.Animation.DROP, map: map});
		
        map.panTo(position);
        
		
		var mapMarkerLongitude=mapMarker.getPosition().lng();
		
        var mapMarkerLatitude=mapMarker.getPosition().lat();
		
		currentContact.lognitude=mapMarkerLongitude;
		
        currentContact.latitude=mapMarkerLatitude;
	
		var x=currentContact.x;
		
        appContacts[x]=currentContact;
		
        localStorage.setItem('contactLists', JSON.stringify(listing));
		
        var getObj = localStorage.getItem('contactLists');	
		
        listing=JSON.parse(getObj);
	}
	
	  container.innerHTML = "<p id = 'yourLocation' style='text-align: center'>Your location is </p>";
		parameters = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0	
		}
    
	
	
//DOMContent Loaded - Device ready
document.addEventListener("DOMContentLoaded", midterm.start);
document.addEventListener("deviceready", midterm.start);
/*End*/
