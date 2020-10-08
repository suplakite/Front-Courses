// var Person = function (name, birthday, job) {
//   this.name = name;
//   this.birthday = birthday;
//   this.job = job;
//   this.calculateAge = function () {
//     return 2000 - this.birthday;
//   };
// };

// var john = new Person("john", 1900, "teacher");
// console.log(john);

// console.log(john.calculateAge());

// //Object.create()

// var personProto = {
//   calculateAge: function () {
//     console.log(2020 - this.birthday);
//   },
// };

// var john = Object.create(personProto);
// john.name = "John";
// john.birthday = 1990;

// var jane = Object.create(personProto, {
//   name: { value: "Jane" },
//   year: { value: 1969 },
// });

// fun as arguments

// var years = [1, 2, 3, 4];

// function arrayCalc(arr, fn) {
//   var arrRes = [];
//   for (var i = 0; i < arr.length; i++) {
//     arrRes.push(fn(arr[i]));
//   }
//   return arrRes;
// }

// function calcAge(el) {
//   return 2016 - el;
// }

// console.log(arrayCalc(years, calcAge));

// function inQuest(job) {
//   if (job === "designer") {
//     return function (name) {
//       console.log("co ja robie tu " + name);
//     };
//   }
// }

// var fun = inQuest("designer");
// console.log(fun("tomek"));

// IIFE

// function game() {
//   var score = Math.random() * 10;
//   console.log(score >= 5);
// }

// game();

// (function () {
//   var score = Math.random() * 10;
//   console.log(score >= 5);
// })();

// Closures

function retirement(retirementAge) {
  var a = "years lft";
  return function (yearOfBirth) {
    var age = 2020 - yearOfBirth;
    console.log(age - retirementAge + " " + a);
  };
}

var fun = retirement(1920);

fun(1900);

retirement(66)(1920);
