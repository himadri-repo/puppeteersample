//jshint esversion: 6
//jshint ignore:start
// async function f() {

//     let promise = new Promise((resolve, reject) => {
//       setTimeout(() => {
//         console.log('method called');
//         resolve("done!")
//       }, 1000);
//     });
//     console.log('calling promise');
//     let result = await promise; // wait till the promise resolves (*)
  
//     console.log(result); // "done!"
//   }
  
//   f();

let data = {};

data['name'] = 'Himadri Majumdar';
data['age'] = 46;
data['dob'] = '1973-10-20';
data.getName = function() {
  return this['name'];
}

function dataMirror() {
  return this['age'];
}

//console.log(typeof(Object.entries(data)[3][1]) === 'function');

console.log(Object.getOwnPropertyNames(data));
let firstKeyName = Object.getOwnPropertyNames(data)[3];
console.log(data[firstKeyName]());
data[firstKeyName] = dataMirror;

console.log(dataMirror());
console.log(data[firstKeyName]());
  //jshint ignore:end