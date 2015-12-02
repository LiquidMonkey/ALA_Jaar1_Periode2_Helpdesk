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
	//problem pickers
	var problemButtons = Array.prototype.slice.call(document.querySelectorAll('.beginButton'));
	for(var i = 0; i < problemButtons.length; i++){
		problemButtons[i].onclick = function(){
			//Need to do the stuff
			if( /\bbtn\b/.test(this.getAttribute("class")) ){
				swapClasses(this, "btn", "btnPressed");
			} else {
				swapClasses(this, "btnPressed", "btn");
			}
		}
	}
	//progress buttons
	var continuebuttons = Array.prototype.slice.call(document.querySelectorAll('.continue'));
	for(var i = 0; i < continuebuttons.length; i++){
		continuebuttons[i].onclick = function(){
			closeSolutions();//closes the solution in case it was wrong so it doesnt distract

			var panel = this.parentElement
			while(panel.localName != "article"){
				panel = panel.parentElement;
			}
			openQuestion( panel, this.dataset.next );//open next part of the questions
		}
	}
	var askNext = Array.prototype.slice.call( document.querySelectorAll(".nextQuestion") );
	askNext[0].onclick = function(){
		swapClasses(this.nextElementSibling, "hidden", "show");
	}
	//finishbuttons
	var finishbuttons =  Array.prototype.slice.call(document.querySelectorAll('.finishButton'));
	for(var i = 0; i < finishbuttons.length; i++){
		finishbuttons[i].onclick = function(){
			var finishIndex = this.dataset.finishindex; //gets the buttons finish index so it knows which finish screen to show
			var valid = getAndSetFinishData(finishIndex);//gets and sets all the data needed inside the finish screen
			if(valid){
				openFinish(finishIndex);//opens the finishscreen with the given index
			} else {
				fireWarning( document.getElementById("modalPanel"), valid );
			}
		}
	}

	//modalClose
	document.getElementById("modalClose").onclick = function(){
		swapClasses(document.getElementById("modalPanel"), "show", "hidden");
	};

}
function fireWarning( modal, error ){
	var target = Array.prototype.slice.call( document.querySelectorAll('#warning') )[0] ;
	fillModal(target, error);
	swapClasses(modal, "hidden", "show");
}
function fillModal( target, errorMessage ) {
	target.innerHTML = errorMessage;
}
function optionSelected(object, value){
	var currentStatus = object.className;
	if(/\bbtn\b/.test(currentStatus)){//if currentStatus contains the word btn (\b makes it so it doesnt matter where the btn is)
		swapClasses(object, "btn", "btnPressed");
		var pairedButton; // should become the other button that isnt pressed
		if(/\bja\b/.test(currentStatus)){
			pairedButton = object.nextElementSibling;
		} else {
			pairedButton = object.previousElementSibling;
		}
		swapClasses(pairedButton, "btnPressed", "btn");// makes sure that the oposite button is not pressed when one is so that there is only ever 1 button pressed at a time
	}else{
		swapClasses(object, "btnPressed", "btn");//makes the button pressed
	}
	object.parentElement.setAttribute("data-answer", value);//updates the value of the question (aka yes or no)
}

/*
	a basic and primitive function to remove and add a class from and too a given object.

	var object is the object of which the classes should be swapped.
	var remove is a string that represents the class that should be removed (note: this has to be exactly like the class that is in the object)
	var add		 is a string that represents the class that should be added
*/
function swapClasses(object, remove, add){
	if( object.getAttribute("class") ){// here can come some extra checks if nessesary but for now it only checks if var object is not empty.
		object.classList.remove( remove );//removes the given class in var remove from the classList of var object.
		object.classList.add( add );//adds the given class in var add from the classList of var object.
	}
}

/*
	openFinish closes all currently opened solutions with the function closeSolutions and then compares the given index to a case so it can open the correct end panel

	var index: the index where the wanted solution is in within the solutions array
*/
var openFinish = function( index ){
	var solutions = document.querySelectorAll('.solution');
	var solution;
	closeSolutions(); //closes any solutions that are open before opening another solution
	for(var i = 0; i < solutions.length; i++){
		if( /\bfinish\b/.test(solutions[i].classList) ){
			solution = solutions[i];
		}
	}
	swapClasses(solution, "hidden", "show");
}

/*
	gets all the solution divs from the document to then put them on hidden (there should only be one solution be open at anytime this is why we hide all solutions before opening the next)
*/
function closeSolutions(){
	var solutions = Array.prototype.slice.call( document.querySelectorAll(".solution") );
	for(var i = 0; i < solutions.length; i++){
		swapClasses(solutions[i], "show", "hidden");
	}
}

/*
	this function opens the next question list when prompted

	var currentWindow: the question window/panel/div that is currently opened
	var next: the panel that should be opened next
*/
function openQuestion(currentWindow, next){
	swapClasses(currentWindow, "show", "hidden");
	swapClasses(document.getElementById(next), "hidden", "show");
}

/* !Old version of this function! new one is below
	gets all values that have been filled in so far and inserts them into the solution page. (this function should be called everytime a finish window is opened)
*//*
function getAndSetFinishData(index){
	var valueContainers = document.querySelectorAll(".question input");
	var optionValueContainers = document.querySelectorAll(".questionOption");

	var valueSet = new Array();
	for(var i = 0; i < valueContainers.length; i++){
		valueSet.push({name: valueContainers[i].name, value: valueContainers[i].value});
	}
	var solutionDiv = document.querySelectorAll(".solution div")[index];

	solutionDiv.innerHTML = "";//empty solution

	for(var j = 0; j < valueContainers.length; j++){//fil solution with all of the filled in values
		solutionDiv.innerHTML = solutionDiv.innerHTML + "<span class=\"liner\"> <span class=\"icon " + getIcon(j) + "\"></span> <span class=\"valueName\"> " + valueSet[j].name + "</span> <span class=\"valueValue\">" + valueSet[j].value + "</span> </span><br />";
	}

	//optionValues
	var valueSet2 = new Array();
	var Value;
	for(var i = 0; i < optionValueContainers.length; i++){
		if( optionValueContainers[i].lastElementChild.dataset.answer == undefined ){
			Value = "";
		}else{
			Value = optionValueContainers[i].lastElementChild.dataset.answer;
		}
		valueSet2.push({ name: optionValueContainers[i].lastElementChild.previousElementSibling.innerText, value: Value });
	}
	var solutionDiv2 = document.querySelectorAll(".solution div")[index];

	for(var j = 0; j < optionValueContainers.length; j++){//fil solution with all of the filled in values
		solutionDiv2.innerHTML = solutionDiv2.innerHTML + "<span class=\"liner\"> <span class=\"icon " + getIcon(j) + "\"></span> <span class=\"valueName\"> " + valueSet2[j].name + "</span> <span class=\"valueValue\">" + valueSet2[j].value + "</span> </span><br />";
	}
}*/

function getAndSetFinishData(type){
	var valueContainers = Array.prototype.slice.call( document.querySelectorAll(".question input, .questionOption") );
	//Switch shortens the array to the amount of answers that should be printed and checked if they contain content
		switch( parseInt(type) ){
			case 0://quick test case will likely not be used in final product
				valueContainers = valueContainers.slice(0);
				break;
			case 1:
				valueContainers = valueContainers.slice(0, 5);
				break;
			case 2:
				valueContainers = valueContainers.slice(0, 8);
				break;
			case 3:
				valueContainers = valueContainers.slice(0, -1);
				break;
			default:
				console.log("");
		}

	var valid = true;

	var valueSet = new Array();
	for(var i = 0; i < valueContainers.length; i++){
		if( /\bquestionOption\b/.test(valueContainers[i].classList) ){
			if( valueContainers[i].lastElementChild.dataset.answer == undefined ){
				Value = "";
				valid = false;
			}else{
				Value = valueContainers[i].lastElementChild.dataset.answer;
			}
			valueSet.push({ name: valueContainers[i].lastElementChild.previousElementSibling.innerText, value: Value });
		} else {
			valueSet.push({name: valueContainers[i].name, value: valueContainers[i].value});
		}
	}
	var solutionDiv = document.querySelectorAll(".solution .solutionContainer")[0];

	solutionDiv.innerHTML = "";//empty solution

	for(var j = 0; j < valueContainers.length; j++){//fil solution with all of the filled in values
		if(type == "0" || type == "2" || type == "3"){
			//switch separates the different sections
			switch(j){
				case 0:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br /> <h4>Klant informatie</h4>";
					break;
				case 3:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br /> <h4>Internet</h4>";
					break;
				case 5:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br /> <h4>Bellen</h4>";
					break;
				case 8:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br /> <h4>Televisie</h4>";
					break;
				default:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br />";
			}
		} else if(type == "1" || type == "4") {
			switch(j){
				case 0:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br /> <h4>Klant informatie</h4>";
					break;
				case 3:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br /> <h4>Internet</h4>";
					break;
				case 5:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br /> <h4>Televisie</h4>";
					break;
				default:
					solutionDiv.innerHTML = solutionDiv.innerHTML + "<br />";
			}
		}
		solutionDiv.innerHTML = solutionDiv.innerHTML + "<span class=\"liner\"> <span class=\"icon " + getIcon(j) + "\"></span> <span class=\"valueName\"> " + valueSet[j].name + "</span> <span class=\"valueValue\">" + valueSet[j].value + "</span> </span>";
	}
	return valid;
}

var iconList = ["name", "date", "modem", "question"];
function getIcon( type ){
	var cssClass;

	if(type < 3){
		cssClass = iconList[type];
	} else {
		cssClass = iconList[3];
	}

	return cssClass;
}
