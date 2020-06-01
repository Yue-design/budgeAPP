// step one: add event handler
// step two: get input values
// step three: add the new item to our data structure
// add the new item to the UI
// calculate budget
// update UI 
// https://developer.mozilla.org/en-US/docs/Web/Events
// http://keycodes.atjayjo.com
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode

// data encapsulation: to hide the implementation's details (API)
// we use module patterns in JS
// BUDGET CONTROLLER
let budgetController = (function() { // highly related to closures

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0, 
            inc: 0
        }
    };
    // let x = 23; // private variable
    // let add = function(a) { // private function
    //     return x + a;
    // }
    // return {
    //     publicTest: function(b) {
    //         return (add(b)); // return VS console.log()
    //     }
    // }
})();


// var Expense = function(id, description, value) {
//     this.id = id;
//     this.description = description;
//     this.value = value;
// };

// UI CONTROLLER
// step two: get input values
let UIController = (function() {

    let DOMstrings = { // create a central place to store the class 
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // + or -
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMstrings: function() { // expose the input value to the public
            return DOMstrings;
        }
    };
})();

// GLOBAL APP CONTROLLER
// step one: add event handler
let controller = (function(budgetCrtl, UICtrl) {

    let setupEventListeners = function() {
        
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);// function(){
            // no () call operator to avoid call back
            // the event handler will help us to call it
            // we don't need the anonymous function so far
            // console.log('Button was clicked.'
        // })
        // keyBoard event
        document.addEventListener('keypress', function(event){ // e
            // console.log(event); // to get the keycode
            if (event.keycode === 13 || event.which === 13) {
                // console.log('ENTER was pressed.');
                ctrlAddItem();
            }
        });
    };

    let ctrlAddItem = function() {
        // a. get the input data
        let input = UICtrl.getInput();
        console.log(input);
        // b. add the item to the budget controller
        // c. add the item to the UI
        // d. calculate the budget
        // e. display the budget on the UI

        // console.log('It works.')
    }

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners(); // let it be callable
        }
    }

    // let y = budgetCrtl.publicTest(5);
    // return {
    //     anotherPublic: function() {
    //         console.log(y);
    //     }
    // }
})(budgetController, UIController);

controller.init();