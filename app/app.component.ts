import { GlobalService, build } from "./global.service.ts";

var templates={
  selector: 'app-root',
  html:'./app/app.component.html',
  style:'./app/app.component.css'
}
export class AppRoot {
  public html;
  constructor(private global: GlobalService,private component_tag:string){
    this.html= build(templates,component_tag)
    console.log(this.html)
  }
}


