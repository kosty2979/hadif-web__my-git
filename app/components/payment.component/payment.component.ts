import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';

@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'payment.component.html'
})

export class PaymentComponent {
    hpay:any;
    url:string;
    price:string;
    freeDays:string;
    lang: boolean= true;



    constructor(
		private authService: AuthService,
		private router: Router,
        private config: ConfigService
	){};

    @ViewChild('wrapForPayment') forScript:ElementRef;
    
	ngOnInit(){
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/register']);
            return;
        };
        if (!sessionStorage.getItem('hpayDetails')) {
            this.router.navigate(['/price']);
            return;
        };
        this.isEnglish()
        this.price = sessionStorage.getItem("price");
    	this.freeDays = sessionStorage.getItem("freeDays");
    	let site = new URL(window.location.href);
        this.url = site.origin + '/comfirm-payment';
        
        this.config.getConfig()
        .then(config=>{
    		if ( !this.authService.isAuthorized() ){
    		    this.router.navigate(['/register']);
    		};
            this.hpay = JSON.parse(sessionStorage.getItem('hpayDetails'));
            setTimeout(()=>{
              this.loadScript( config.hpay +'/v1/paymentWidgets.js?checkoutId=' + this.hpay.checkoutId);
            },0);
        })

	};

    ngDoCheck() {
      if( (this.lang != this.isEnglish())  ){
            this.router.navigate(['/price']); 
          }
      };

  public loadScript(url:string) {
    console.log('preparing to load...')

    let oldStyle =  document.getElementById('wpwl-style')
    if( oldStyle ){
          document.getElementsByTagName('head')[0].removeChild(oldStyle ); 
    }
   
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    this.forScript.nativeElement.appendChild(node);
  };
     
     private isEnglish():boolean{
        let lang = localStorage.getItem('lang');
        this.lang = lang == 'en';
         return ( lang == 'en' ) ;
    };
};
