import { Component } from '@angular/core';
import { About } from '../../classes/about';



 
@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'setting-about.component.html'
})

export class SettingAboutComponent {
lang: boolean= true;
about:About = new About();


constructor(){};

 private getAboutText(){
	 	let text = this.isEnglish()? this.about.en : this.about.ar;
	 	return text
	 }

	 private isEnglish():boolean{
			let lang = localStorage.getItem('lang');
			this.lang = lang == 'en';
		     return ( lang == 'en' ) ;
		};

}