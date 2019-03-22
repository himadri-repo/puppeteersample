//jshint esversion: 6
//jshint ignore:start
async function f() {

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('method called');
        resolve("done!")
      }, 1000);
    });
    console.log('calling promise');
    let result = await promise; // wait till the promise resolves (*)
  
    console.log(result); // "done!"
  }
  
  f();

  //jshint ignore:end