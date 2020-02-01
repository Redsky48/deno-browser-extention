var document = window['document']
export class twowayBinds{
     static binded=[]
     static listeners={}
}

export function InitEventListener() {
   
    for(let events of twowayBinds.binded){

        if(!twowayBinds.listeners[events.eventName]){
            console.log('adding ',events.eventName)
            document.addEventListener(events.eventName, e => {
                let details=e.detail
                console.log('eventRunned', e.srcElement.activeElement.value,details)
                // for textarea let text=e.srcElement.activeElement.innerText
                 // console.log(text)
              });
              twowayBinds.listeners[events.eventName]=true
        }
    }
    console.log(twowayBinds.listeners)

}

export function addEventToBind(eventName,value){
    twowayBinds.binded.push(
        {
            eventName,
            value
        }
    )
    InitEventListener()
    // document.addEventListener('naudaMaka', e => {
    //     console.log('eventRunned')
    //     let details=e.detail
    //     let text=e.srcElement.activeElement.innerText
    //      console.log(details,text)
    //   });
    console.log(twowayBinds.binded)
}

