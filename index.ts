var requestIdleCallback = window['requestIdleCallback']
var document = window['document']
console.log('EXTENTION INITIALIZED')
requestIdleCallback(checkForDOM);


import { AppModule, runApp } from "./app/app.module.ts";

 //startup loop check////////////////////////////////////////

 function checkForDOM() {
  if (document.body && document.head) {
    setTimeout(() => {
      loopRendered()
    }, 1000)
  } else {
    requestIdleCallback(checkForDOM);
  }
 }
/////////////////////////////////////////////////////


function loopRendered() {
  AppModule
  runApp()
  //updateAditionalElements()
  // setTimeout(() => {
  //   loopRendered()
  // }, 300)
}















