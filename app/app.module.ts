import { AppRoot} from "./app.component.ts";
import { GlobalService } from "./global.service.ts";
import { Dashboard } from "./dashboard/dashboard.component.ts";




export class AppModule {
 static componenets=[
   {
     selector:'app-root',
     component:AppRoot
   },
   {
    selector:'app-dashboard',
    component:Dashboard
  } 
  ]
  static services=[
    GlobalService
  ]


 }
export async  function runApp(){
  console.log('do SomethingHere')
  for(let comp of AppModule.componenets){
    await new comp.component(new GlobalService,comp.selector)
  }
}
