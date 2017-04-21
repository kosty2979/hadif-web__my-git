import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


 
@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'setting-config.component.html'
})

export class SettingConfigComponent {
	support: boolean =false;
  language:string;

	constructor(private translate: TranslateService){
    this.language = localStorage.getItem('lang') == 'en'? "English" : "Arabic";
  };

  private langChange(lang:string){
    this.translate.use(lang);
    this.language = lang == 'en'? "English" : "Arabic";
    localStorage.setItem('lang',lang);
    if (lang == 'en'){
      window['$']('#dinamic-css')[0].href = '/css/english-main.css';
    } else {
      window['$']('#dinamic-css')[0].href ='/css/main.css';
    }
  };
}