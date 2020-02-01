var document = window['document']
export class twowayBinds{
     static binded=[
        {
            eventName:'naudaMaka',
            value:444
        }
     ]
     static listeners={}
}

export function InitEventListener() {
   
    for(let events of twowayBinds.binded){

        if(!twowayBinds.listeners[events.eventName]){
            twowayBinds.listeners[events.eventName]=true
            document.addEventListener(events, e => {
                let details=e.detail
                let text=e.srcElement.activeElement.innerText
                 console.log(details,text)
              });
        }
    }

}

function addEventToBind(eventName,value){
    twowayBinds.binded.push(
        {
            eventName,
            value
        }
    )
}