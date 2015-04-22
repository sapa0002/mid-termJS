var contactList;
var app = {
	init: function () {
		
		document.querySelector("[data-role=modal]").style.display = "none";
		document.querySelector("[data-role=overlay]").style.display = "none";
		document.querySelector("#contactPage").style.display = "block";
		document.querySelector("#mapPage").style.display = "none";
		
		
		
		document.getElementById("Done").style.display = "none"; 
		document.getElementById("btnOk").addEventListener("click", app.Ok);
		document.getElementById("Done").addEventListener("click", app.init);
		//locationJS.getLocation();
		var jsonObject = localStorage.getItem('contactListPate0359');
		contactList = JSON.parse(jsonObject);
		if (!contactList) {
			contactJS.getContacts();
		} else {
			document.querySelector("#contactLoading").innerHTML = "";
			app.addContactListElement(contactList);
		}
	},
	Ok: function (ev) {
		document.querySelector("[data-role=modal]").style.display = "none";
		document.querySelector("[data-role=overlay]").style.display = "none";
	},
	openDialog: function (contact) {

		document.querySelector("[data-role=modal]").style.display = "block";
		document.querySelector("[data-role=overlay]").style.display = "block";
		document.querySelector(".contactName").innerHTML = contact.name;
		document.querySelector("#phonenumbers").innerHTML="";
		//console.log(contact);
		// chenge this line save few seconds because every time loop run for check for phoneNumberLength so we assgin length one time save some time
		var phoneNumberLength = contact.phonenumber.length
		for(var i=0;i<phoneNumberLength;i++)
		{
			//console.log(contact.phonenumber[i].type);
			//console.log(contact.phonenumber[i].value);
			var li = document.createElement("li");
			li.innerHTML = contact.phonenumber[i].type + " : " + contact.phonenumber[i].value;
			document.querySelector("#phonenumbers").appendChild(li);
		}
	},
	addContactListElement: function (contacts) {
		document.querySelector("#MyContacts").innerHTML = "";
		var contactsLength  = contacts.length; // some region as given above
		for (var i = 0; i < contactsLength; i++) 
		{
			var li = document.createElement("li");
			li.innerHTML = contacts[i].name;
			li.setAttribute("id", contacts[i].id);
			app.addHammerGestures(li);
			document.querySelector('#MyContacts').appendChild(li);
		}
	},
	openMapPage: function (contact) {
			locationJS.getLocation(contact);
		   	app.navigate( location.href, true );
			document.querySelector("#contactPage").style.display = "none";
			document.querySelector("#mapPage").style.display = "block";
		
	},
	navigate: function (url, addToHistory) {
				
		//call ajax function to load the proper content for our url
		  //potentially use ajax to load the url itself, if it were an html page
		  //add handler for the ajax response
		  if( addToHistory ){
			history.pushState({"data":123}, null, url );  //add the url to the history array
		  }
	},
	addHammerGestures: function (element) {
		// Add Hammer double tap event
		var mc = new Hammer.Manager(element);
		// Tap recognizer with minimal 2 taps
		mc.add(new Hammer.Tap({
			event: 'doubletap',
			taps: 2
		}));
		// Single tap recognizer
		mc.add(new Hammer.Tap({
			event: 'singletap'
		}));
		// we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
		mc.get('doubletap').recognizeWith('singletap');
		// we only want to trigger a tap, when we don't have detected a doubletap
		mc.get('singletap').requireFailure('doubletap');

		mc.on("singletap doubletap", function (ev) {

			if (ev.type == "singletap") 
			{
				app.openDialog(contactList[ev.target.id]);
				
			} else if (ev.type == "doubletap") {

				//alert(ev.target.innerHTML);
				app.openMapPage(contactList[ev.target.id]);
			}
		});
	}
}

//History API Pop
window.addEventListener("popstate", function( ev ){
  //this will handle the back button and forward button if clicked.  
//  console.log( ev.state );
//  console.log( location.href );
//  navigate( location.href, false );
//	history.back( );
//	history.go( -1);
	app.init();
  //don't add this call to the history... it is already there.
});

//DOMContent Loaded - Device ready
document.addEventListener("DOMContentLoaded", app.init);
document.addEventListener("deviceready", app.init);