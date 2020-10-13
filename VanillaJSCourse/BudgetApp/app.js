// BUDGET CONTROLER
var budgetController = (function () {

  var Expence = function (id,description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expence.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
        this.percentage = -1;
    }
};


Expence.prototype.getPercentage = function() {
    return this.percentage;
};

  var Income = function (id,description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc:[],
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    procentage: -1,
  };

  var calculateTotal = function(type) {
    var sum = 0;

    data.allItems[type].forEach(function (item){
      sum = sum + item.value;
    });
    data.totals[type] = sum;

  }

  return {
    addItem: function(type, desc, val){
      var newItem;
      
      // New ID
      var lengtOfItems = data.allItems[type].length;
      
      if (lengtOfItems === 0){
        ID = 0;
      } else {
        ID = data.allItems[type][lengtOfItems - 1].id + 1;
      }
      // New Object
      if (type === 'exp'){
        newItem = new Expence(ID, desc, val);
      } else {
        newItem = new Income(ID, desc, val);
      }
      // Add item
      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;
      ids = data.allItems[type].map(function(item){
                  return item.id;
                });
      
      index = ids.indexOf(id);

      if (index !== -1){
        data.allItems[type].splice(index, 1);
      }
    
    },

    calculateBudget: function() {

      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // procentage calculate
      if(data.totals.inc > 0){ 
       data.procentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.procentage = -1;
      }
      // calculate the % of income that we spent

    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpenses: data.totals.exp,
        procentage: data.procentage,
      }
    },

    calculatePercentages: function() {
            
      data.allItems.exp.forEach(function(cur) {
         cur.calcPercentage(data.totals.inc);
      });
  },
  
  
  getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
          return cur.getPercentage();
      });
      return allPerc;
  },

    testing: function() {
      console.log(data)
    }
  };

})();

// UI CONTROLER
var UIController = (function () {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    monthLabel: ".budget__title--month"
  };


  
  var formatNumber =  function(number, type) {
    var int, dec;
    var num = Math.abs(number);
    num = num.toFixed(2);
    var numSplit = num.split('.');
    int = numSplit[0]
    dec = numSplit[1]
    if(int.length > 3) {
      int = int.substr(0, int.length - 3) + '.' + int.substr(int.length - 3, 3);
    }
    return (type === 'exp' ? '-' : '+' )+ ' ' + int + '.' + dec;
  };

  var nodeListForEach = function(list, callback){
    for (var i=0; i < list.length; i++){
      callback(list[i], i);
    }
  };

  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //value -> inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      
      if (type === 'inc') {
          element = DOMStrings.incomeContainer;
          
          html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
          element = DOMStrings.expensesContainer;
          
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      console.log(html)
      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      console.log(newHtml)
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
  },

  deleteListItem: function(selectorID){
    var selectedItem = document.getElementById(selectorID);
    selectedItem.parentNode.removeChild(selectedItem);
  },

  clearFields: function() {
    var fields, fieldsArr;
    fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

    fieldsArr = Array.prototype.slice.call(fields)  // Trick clice to change list 'fields' to arra7
    fieldsArr.forEach(function(current, index, array){
      current.value = "";
    });

    fieldsArr[0].focus();

  },

  displayBudget: function(obj) {
    var type;
    obj.budget >= 0 ? type = 'inc' : type = 'exp';

    document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
    document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
    document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp');

    if (obj.procentage > 0 && obj.totalIncome > obj.totalExpenses){
      document.querySelector(DOMStrings.percentageLabel).textContent = obj.procentage + '%';
    } else {
      document.querySelector(DOMStrings.percentageLabel).textContent = '---';
    }

  },

  displayPercentages: function(percentages){

    var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

    nodeListForEach(fields, function(current, index){
      if(percentages[index] > 0){
        current.textContent = percentages[index] + '%';
      } else {
        current.textContent = '---';
      }
    })
  },

  displayMonth: function(){
    var now = new Date();
    var month = now.getMonth();
    var year = now.getFullYear();
    document.querySelector(DOMStrings.monthLabel).textContent = month + "-" + year;
  },

  changedType: function(){
    document.querySelector(DOMStrings.inputType).classList.toggle('red-focus')
    document.querySelector(DOMStrings.inputDescription).classList.toggle('red-focus')
    document.querySelector(DOMStrings.inputValue).classList.toggle('red-focus')
    document.querySelector(DOMStrings.inputButton).classList.toggle('red')
  },

  getDomStrings: function () {
    return DOMStrings;
  },
  };

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var DOM = UICtrl.getDomStrings();
  var setupEventListeners = function () {
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };

  var updateBudget = function(){
    // Calculate Budget
    budgetCtrl.calculateBudget();
    //return the budget
    var budget = budgetCtrl.getBudget()
    // Display Budget on UI
    UICtrl.displayBudget(budget)
  };

  var updatePercentages = function(){
    // Calculate Percentages
    budgetCtrl.calculatePercentages();
    //Read % from budget controler
    var percentages = budgetCtrl.getPercentages();
    //update user interface
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function () {
    var input;
    var newItem;
    // TO DO
    // Get field input data
    input = UICtrl.getinput();
    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // Add item to the bufget contoller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      budgetCtrl.testing();
      // Add the new item to UI
      UICtrl.addListItem(newItem, input.type);
      // Clear the fields
      UICtrl.clearFields();

      // Calculate and update budget
      updateBudget();

      // Calculate and update %
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
      // inc-1

      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      
      // Delete Item from data structure
      budgetCtrl.deleteItem(type, ID);
      // delete from ui
      UICtrl.deleteListItem(itemID);
      // update total budgets and show it
      updateBudget();
      
      // Calculate and update %
      updatePercentages();
    }

  };

  return {
    init: function () {
      setupEventListeners();
      UICtrl.displayMonth();
      UICtrl.displayBudget(budgetCtrl.getBudget());
    },
  };
})(budgetController, UIController);

controller.init();

function log(what) {
  console.log(what);
}
