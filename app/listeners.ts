var document = window['document']
export class twowayBinds{
     static binded=[
         eventName:''
     ]
     static listeners=[]
}

export function InitEventListener() {
document.addEventListener('changeMoveText', e => {
    //console.log('changing text',e)
    let details=e.detail
   
    
    let text=e.srcElement.activeElement.innerText
    let i =details.i
    if(text && i){
      GlobalVars.autoMoves[location.hostname][i].text=text
    }
    
  
  });
}

function addEventToBind(){
    twowayBinds.binded.push()
}