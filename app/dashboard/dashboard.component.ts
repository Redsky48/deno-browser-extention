import { GlobalService,build } from "./../global.service.ts";

var templates={
  selector: 'app-dashboard',
  html:'./app/dashboard/dashboard.component.html',
  style:'./app/dashboard/dashboard.component.css'
}
export class values{
  static myName='Eduards'
  static piens=3
  static udens=6


  static olas=[
    {
      title:'manas',
      value:4
    },
    {
      title:'tavas',
      value:8
    }
  ]
  static naudaMaka=100
}

export class Dashboard  {
  

  public html;
 constructor(private global: GlobalService,private component_tag:string){
  this.html= build(templates,component_tag,values)
 }


}


