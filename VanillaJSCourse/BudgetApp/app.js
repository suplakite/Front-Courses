// BUDGET CONTROLER
var budgetController = (function () {})();

// UI CONTROLER
var UIController = (function () {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
  };

  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //value -> inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },
    getDomStrings: function () {
      return DOMStrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var DOM = UICtrl.getDomStrings();
  var ctrlAddItem = function () {
    // TO DO
    // Get field input data
    var input = UICtrl.getinput();

    // Add item to the bufget contoller
    // Add the new item to UI
    // Calculate Budget
    // Display Budget on UI
  };

  return {
    init: function () {
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();

function log(what) {
  console.log(what);
}
