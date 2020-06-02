// part one: module patterns
// step one: add event handler
// step two: get input values
// step three: add the new item to our data structure
// step four: add the new item to the UI
// step five: calculate budget
// step six: update UI 
// part two: event delegation
// event bubbling --> target element --> event delegation
// step 1: add event handler
// step 2: delete the item from our data structure
// step 3: delete the item to the UI
// step 4: re-calculate the budget
// step 5: update the UI
// references
// https://developer.mozilla.org/en-US/docs/Web/Events
// http://keycodes.atjayjo.com
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode


// data encapsulation: to hide the implementation's details (API)
// we use module patterns in JS
// BUDGET CONTROLLER
// step three: add the new item to our data structure
let budgetController = (function() { // highly related to closures

    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // question: why the lecturer didn't return it?
    let calculateTotal = function(type) { // list of the keywords
        let sum = 0;
        data.allItems[type].forEach(function(cur) { // it works in a loop
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    let data = { // a global data structure
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0, 
            inc: 0
        },
        budget: 0,
        percentage: -1 // indicating an non-existence value
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;

            // [2 3 4], nextID = 4
            // ID = lastID + 1

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            } else {
                ID = 0; // in case of the undefined
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id) {

            let ids, index;

            // data.allItems[type][id] only work for array like [1 2 3 4]
            ids = data.allItems[type].map(function(current) { // put the ids in an array
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {

                data.allItems[type].splice(index, 1); // the splice method helps remove the 

            }
        },

        calculateBudget: function() {

            // a. calculate total incomes and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // b. calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // c. calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1; // representing non-existence
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
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
// step four: add the new item to the UI
// step six: update UI 
let UIController = (function() {

    let DOMstrings = { // create a central place to store the class 
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    } // don't let the class names float around

    return {

        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // + or -
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // convert a string to a number
            };
        },

        addListItem: function(obj, type) {

            let html;

            // a. create HTML strings with placeholder texts
            if (type === 'inc') {

                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

            } else if (type === 'exp') {

                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';

            }

            // b. replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // c. insert the HTML into a DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
        },

        clearFields: function() {
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields); // a shallow copy
                                                            // from list to array

            fieldsArr.forEach(function(current, index, array) {// execute once for each array element
                current.value = "";
            });

            fieldsArr[0].focus(); // focus on a specified element
        }, 

        displayBudget: function(obj) { // the content comes from the getBudget method
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;  
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) { // below 0 (included) is not meaningful
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        getDOMstrings: function() { // expose the input value to the public
            return DOMstrings;
        }
    };
})();

// GLOBAL APP CONTROLLER
// step one: add event handler
// step five: calculate budget
let controller = (function(budgetCtrl, UICtrl) {

    // looking at the HTML file and think about how to attach the event listener
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };
    
    let updateBudget = function() {
        
        // move from the ctrlAddItem
        // a. calculate the budget
        budgetCtrl.calculateBudget();

        // b. return the budget
        let budget = budgetCtrl.getBudget();

        // c. display the budget on the UI
        // it's important to call the method
        // console.log(budget);
        UICtrl.displayBudget(budget);

    };

    let ctrlAddItem = function() {

        let input, newItem;

        // a. get the input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // b. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            // c. add the item to the UI
             UICtrl.addListItem(newItem, input.type);

            // d. clear the fields
            UICtrl.clearFields();

            // e. clear the fields
            updateBudget();

            // console.log('It works.')
        }
        // console.log(input);
    }

    let ctrlDeleteItem = function(event) { 

        let itemID, splitID, type, ID;     
        // we are actually click on the i button when clicking the icon
        // in fact, we need the parent node of the target
        // question: why four .parentNode?
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // inc-1
            splitID = itemID.split('-'); // return type: array
            type = splitID[0];
            ID = parseInt(splitID[1]); // covert the string to number

            // a. delete the node from the data structure
            budgetCtrl.deleteItem(type, ID);

            // b. delete the item from the UI

            // c. update and show the new budget

        }
        
    };

    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0             
            });

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