import { Component , Renderer} from '@angular/core';
import {Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './services/auth.service';


@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private lang:any;
  username:string;

  constructor(
    private translate: TranslateService,
    private renderer: Renderer,
    private router: Router,
    private authService: AuthService) {
        translate.addLangs(["en", "ar"]);
        translate.setDefaultLang('ar');
        localStorage.setItem('lang', 'ar')
        let lang = localStorage.getItem('lang');
        if (!lang) lang = 'en';
        // let browserLang = translate.getBrowserLang();
        // this.langChange(browserLang.match(/en|ar/) ? browserLang : lang);
        this.langChange(lang);
        this.lang = renderer.listenGlobal('document', 'click', (event:any) => {
          if(event.target.name=='lang' && ['en','ar'].indexOf(event.target.lang)>-1){
            this.langChange(event.target.lang);
            event.preventDefault();
          }
        });




    }
    ngOnDestroy() {
        if(this.lang) {
            this.lang();
        }
    }
    private isAuthorized():boolean{
      if(this.authService.isAuthorized()){
        this.username = this.authService.authDate.username;
        return true;
      } else {
        this.username = '';
        return false;
      }
    };
    private langChange(lang:string){
      this.translate.use(lang);
      localStorage.setItem('lang',lang);
      if (lang == 'en'){
        window['$']('#dinamic-css')[0].href = '/css/english-main.css';
        window['wpwlOptions'] = { locale:"", paymentTarget:"_top"}; console.log("set EN locale")
      } else {
        window['$']('#dinamic-css')[0].href ='/css/main.css';
        window['wpwlOptions'] = { locale:"ar", paymentTarget:"_top"}; console.log("set AR locale")
      }
    };
    
}
