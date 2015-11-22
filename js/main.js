window.onload = function(){

	setDateNow();
	setButtonActions();
	closeSolutions();
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
	var internetProgress = Array.prototype.slice.call(document.querySelectorAll('.continue'));
	for(var i = 0; i < internetProgress.length; i++){
		internetProgress[i].onclick = function(){
			//open next part of the questions
		}
	}
	//finishbuttons
	var finishbuttons =  Array.prototype.slice.call(document.querySelectorAll('.finishButton'));
	for(var i = 0; i < finishbuttons.length; i++){
		finishbuttons[i].onclick = function(){
			var finishIndex = this.dataset.finishindex; //gets the buttons finish index so it knows which finish screen to show
			openFinish(finishIndex);//opens the finishscreen with the given index
		}
	}
}

function optionSelected(object, value){
	var currentStatus = object.className;
	if(/\bbtn\b/.test(currentStatus)){//if currentStatus contains the word btn (\b makes it so it doesnt matter where the btn is)
		swapClasses(object, "btn", "btnPressed");
		var pairedButton;
		if(/\bja\b/.test(currentStatus)){
			pairedButton = object.nextElementSibling;
		} else {
			pairedButton = object.previousElementSibling;
		}
		swapClasses(pairedButton, "btnPressed", "btn");
	}else{
		swapClasses(object, "btnPressed", "btn");
	}
	object.parentElement.setAttribute("data", value);
}

function swapClasses(object, remove, add){
	if( object.getAttribute("class") ){
		object.classList.remove( remove );
		object.classList.add( add );
	}
}

var openFinish = function( index ){
	var solutions = ["finish", "finishInternet, finishInternetEnBellen"];
	var solution;
	closeSolutions(); //closes any solutions that are open before opening another solution
	switch( parseInt(index) ){
		case 0:
			solution = document.querySelectorAll('.'+solutions[0])[0];
			swapClasses(solution, "hidden", "show");
			break;
		case 1:
			solution = document.querySelectorAll('.'+solutions[1])[0];
			swapClasses(solution, "hidden", "show");
			break;
		case 2:
			solution = document.querySelectorAll('.'+solutions[2])[0];
			swapClasses(solution, "hidden", "show");
			break;
		default:
			console.log("You done goofed brah");
	}
}

function closeSolutions(){
	var solutions = Array.prototype.slice.call( document.querySelectorAll(".solution") );
	for(var i = 0; i < solutions.length; i++){
		swapClasses(solutions[i], "show", "hidden");
	}
}
