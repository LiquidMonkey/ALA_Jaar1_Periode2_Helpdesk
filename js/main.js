window.onload = function(){

	setDateNow();
	setButtonActions();
};

function setDateNow(){
	var today = new Date();

	var day = today.getDate();
	var month = (today.getMonth() + 1); //January is 0!
	var year = today.getFullYear();

	if(day<10){
			day = "0" + day;
	}
	if(month<10){
			month = "0" + month;
	}

	var dateFormated = year + "-" + month + "-" + day;

	document.getElementById("datum").value = dateFormated;
}

function setButtonActions(){
	/*the following lines get the nodelists from the document to then make it into an array
	array calls the array object prototype takes all of the array functions and properties and slices a new array out of the object which we call*/
	var jaButtons = Array.prototype.slice.call(document.querySelectorAll('.ja'));
	var neeButtons = Array.prototype.slice.call(document.querySelectorAll('.nee'));

	//this combines the two arrays so we can loop over both arrays with one loop
	var jaEnNeeButtons = jaButtons.concat(neeButtons);

	//loops over all buttons that are called before and gives them an onclick function
  for(var i = 0; i < jaEnNeeButtons.length; i++){
		jaEnNeeButtons[i].onclick = function(){
			var value;
			if( /\bja\b/.test(this.getAttribute("class")) ){
				value = "ja";
			} else {
				value = "nee";
			}
			optionSelected(this, value);//calls the actual function that should happen when one of these butons is pressed the value is yes or no depending on which button was pressed
		}
	}
	//end of yes and no buttons js
	//progress buttons

}

function optionSelected(object, value){
	var currentStatus = object.className;
	if(/\bbtn\b/.test(currentStatus)){//if currentStatus contains the word btn (\b makes it so it doesnt matter where the btn is)
		object.classList.remove("btn");
		object.classList.add("btnPressed");
		var pairedButton;
		if(/\bja\b/.test(currentStatus)){
			pairedButton = object.nextElementSibling;
		} else {
			pairedButton = object.previousElementSibling;
		}
		pairedButton.classList.remove("btnPressed");
		pairedButton.classList.add("btn");
	}else{
		object.classList.remove("btnPressed");
		object.classList.add("btn");
	}
	object.parentElement.setAttribute("data", value);
}
