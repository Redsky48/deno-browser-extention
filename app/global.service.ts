import { values } from "./dashboard/dashboard.component.ts";

var document = window["document"];
var chrome = window["chrome"];
export class GlobalService {
  public document = window["document"];
  public chrome = window["chrome"];
  public api = "localhost";
  public local = "localhost";
  constructor() {}

  static builtCompnents={

  }
 
}
export async function build(templates, component_tag,values?) {
  console.log('getting files',templates);
   asingFileToObject(templates.html, templates.style).then(html => {
     let Component=GlobalService.builtCompnents[component_tag]
     if(Component){
      Component.innerHTML=html
      return Component
     }
    let child = document.createElement(component_tag);
    if(values){
      child.innerHTML = generateObjectHTML(html,values);
    }else{
      child.innerHTML = html;
    }
    
    return GlobalService.builtCompnents[component_tag] = document.body.appendChild(child);
  });
}
async function asingFileToObject(html, style) {
  let fechedHtml = await fetch(chrome.runtime.getURL(html))
    .then(response => response.text())
    .then(text => {
      return text;
    });
  let fechedstyle = await fetch(chrome.runtime.getURL(style))
    .then(response => response.text())
    .then(text => {
      return text;
    });
  return "<style>" + fechedstyle + "</style>" + fechedHtml;
}



  function generateObjectHTML(HTMLString,values){
  let loopRegex= new RegExp(/([{]{1}[REPEAT^}][^}]*[}]{1})/g)
  let splitByREAPET=HTMLString.split(loopRegex)
  let getfuntion=HTMLString.match(loopRegex)
 // console.log(getfuntion,splitByREAPET)
 
  let html=''
       if(splitByREAPET.length>1){
         let repeatStarted=false
         let repietObject=[]
         let eventKey=''
        for(let HTMLPeace of splitByREAPET){
          let match=HTMLPeace.match(loopRegex)

          //console.log('what regex found',match)
          if(!match){
           // console.log('not function')
           if(repeatStarted){
              let countKeys=0
            for(let event of repietObject){  ///repietObject=[{value:{x:0,y:0,...data}}]
             // console.log('itkā ok....',event,HTMLPeace)
              html +=  HTMLRegex(event,HTMLPeace,countKeys); 
            //  console.log('done successfull',html)
            countKeys++
            }
            continue
           }
            html +=  HTMLRegex(values,HTMLPeace); 
            continue
          }
          ///// {REAPEAT;let value of values} -> nogriez {} malas
          let params=match[0].substr(1,match[0].length-2)



          if(params.match(';')){ 
            ///// sadala REAPEAT;let value of values -> ['REAPEAT','let value of values']
          console.log()
          repeatStarted=true
            //console.log('Params')
            let spliKeys=params.split(';')[1].split(' ') //// ['let','value','of','values']


             eventKey=spliKeys[1]  ///'value'
             params=spliKeys[3].split('.') /// ['values']

             for(let obj of params.reduce(index, values)){
              repietObject.push(JSON.parse(JSON.stringify({[eventKey]:obj})))
             }
                ///repietObject = [{value:{x:0,y:0,...data}}]
              
              //console.log(repietObject,params)
            continue
          }

          if(params=="REPEAT"){
            repeatStarted=false
            repietObject=[]
            eventKey=''
          }
         // console.log('none shownde')
        }
       }else{
        html +=  HTMLRegex(values,HTMLString); 
       }

   
  return html
}


function HTMLRegex(JSONObject: any,HTML:any,i?:number): Promise<any>{
  //reggex prieks {{ ....  }}
  var regex = new RegExp(/([{]{2})([^}]*)([}]{2})/g);
  let dats= HTML.replace(regex, ((match, capture)=> { 
   // //console.log('p1',match)
    

    let needToCalculate=false
    let id2=(match.substr(2,match.length-4))

    let dateFormat
    if(id2.split('|').length>1){

      dateFormat= id2.split('|')[1]
      id2=id2.split('|')[0]
     // //console.log('dateFormat',dateFormat)

      let res=id2.split('.')
      let time= res.reduce(index, JSONObject)
     // //console.log('time',time)
     
      return this.dateReturner(dateFormat,time)
    }

     let stringValue='';


     //nogriež {{ sakumā un beigās  }}
     let fullString=(match.substr(2,match.length-4))


     //atrod matemātiskos simbolus
       let variables=fullString.split(/([*+\-\/]{1})/g)
       
    
     for(let variable of variables){
         variable=variable.replace(',','.')
         if(!isNaN(variable)){
     //     //console.log('Ir Cipars',variable)
          stringValue += variable
          continue
         }
      if(variable=='index'){
          stringValue += (i)
          continue
          }
          
      if(['*','+','-','/'].indexOf(variable)!=-1){
          stringValue += variable
       //   //console.log('Matematikas zīme',variable)
          needToCalculate=true
          continue
      }

      let sqareBrackets=new RegExp(/\[([^\]]+)]/g)
      let squaretext=variable.match(sqareBrackets)
      variable=variable.replace(sqareBrackets,'.valueReserved')
      //console.log(squaretext)
      //console.log(variable)
      variable=variable.split('.')
      //console.log(variable)
      let newVariable=[]
      
      for(let vv of variable){
        if(vv=="" || vv.length<1){
          continue
        }
        
        if(vv=='valueReserved'){
          newVariable.push(squaretext[0].substr(1,squaretext[0].length-2))
          continue
          }
        newVariable.push(vv)
       
      }
   
      //console.log(newVariable,element)
      variable= newVariable.reduce(index, JSONObject)
      stringValue += variable
     }

     if(needToCalculate){
      return eval(stringValue)
  }
  return stringValue
// //console.log(stringValue)
  
 })); 
  
  return dats
}

function index(obj,i) {
  return obj[i]
}