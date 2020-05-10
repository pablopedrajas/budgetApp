//budgetcontroller module
//module pattern with IIFE - Immediately Invoked Function Expression
var budgetController = (function(){
    //capital E as its a function constructor
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this. value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this. value = value;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        //sum values of the array
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        //export sum to the totals array
        data.totals[type] = sum;
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            //create new ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on if its expense or income
            if(type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if(type === "inc") {
                newItem = new Income(ID, des, val);
            }
            //add new item created to the type array
            data.allItems[type].push(newItem);
            //return new item so other modules can access it
            return newItem;
        },
        
        calculateBudget: function() {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the % of income spent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);  
            } else {
                //if set to -1, doesn't exist
                data.percentage = -1;
            }
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        
        testing: function() {
            console.log(data);
        }
    };
    
})();

//UIcontroller module
var UIController = (function(){
    //we create this in order to fix the classes, in case in the future we change the classes from html
    //we only will have to change this variables
    var DOMstrings = {
        inputType:".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    }
    //public methods
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                //parseFloat converts string to number
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create html string with placeholder text
            if(type === "inc") {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
            } else if(type === "exp") {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            };
            
            //replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //insert html to the DOM, beforeend is the last one of the list in html
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            //we select as if it was css, with commas and spaces
            //the query selector all returns a list, not an array, so we have to convert it to array
            //as we have various methods for arrays, not for lists
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            //make fields an array
            fieldsArr = Array.prototype.slice.call(fields);
            
            //loop through each value and set it to empty
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            //set focus to first element, description
            fieldsArr[0].focus();
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
    };
    
    var updateBudget = function() {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        //2. Return the budget
        var budget = budgetCtrl.getBudget();
		//3. Display the budget on the UI
        console.log(budget);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        //1. Get the field input data
        input = UICtrl.getInput();
        //if data is not empty, then run
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            //4. Clear the fields
            UICtrl.clearFields();
            //5. Calculate and update budget
            updateBudget();
        };
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