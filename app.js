//budgetcontroller module
//module pattern with IIFE - Immediately Invoked Function Expression
var budgetController = (function(){
    //capital E as its a function constructor
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this. value = value;
    }
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this. value = value;
    }
    
})();

//UIcontroller module
var UIController = (function(){
    //we create this in order to fix the classes, in case in the future we change the classes from html
    //we only will have to change this variables
    var DOMstrings = {
        inputType:".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    }
    //public methods
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        //make DOMstrings available to the public
        getDOMstrings: function() {
            return DOMstrings;
        }
    }
})();

//controller module
//this controller now controlls the other 2 modules, and can use their code
//it is good practice to change the arguments name, just in case in the future we want to change other module names
//in this module we will call other methods of the other modules
var controller = (function(budgetCtrl, UICtrl) {
    //this function has to be called at first, to eventlisteners to run
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
	    //add event listener to global object. When keypressed 'enter'.
	    document.addEventListener('keypress', function(event) {
		  //event.which is for other browsers
		  if(event.keyCode === 13 || event.which === 13) {
			 ctrlAddItem();
		  }
	   })
    }
    
    var ctrlAddItem = function() {
        //1. Get the field input data
        var input = UICtrl.getInput();
		//2. Add the item to the budget controller

		//3. Add the item to the UI

		//4. Calculate the budget

		//5. Display the budget on the UI
    };
    
    //create init function and make it public by returning it
    return {
        init: function() {
            console.log("app initialized");
            setupEventListeners();
        }
    }

})(budgetController, UIController);

//init the controller
controller.init()