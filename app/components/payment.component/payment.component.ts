import { Component } from '@angular/core';
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
    price:string
    freeDays:string


    constructor(
		private authService: AuthService,
		private router: Router,
        private config: ConfigService
	){};


	ngOnInit(){
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/register']);
            return;
        };
        if (!sessionStorage.getItem('hpayDetails')) {
            this.router.navigate(['/price']);
            return;
        };

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

  public loadScript(url:string) {
    console.log('preparing to load...')
   if(!this.isEnglish()) {
    let node2 = document.createElement('script');
    node2.type = 'text/javascript';
    node2.charset = 'utf-8';
    node2.text='var wpwlOptions = { locale:"ar", paymentTarget:"_top"}; console.log("set AR locale")'
    document.getElementsByTagName('head')[0].appendChild(node2);    
   };

    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  };
     
     private isEnglish():boolean{
        let lang = localStorage.getItem('lang');
         return ( lang == 'en' ) ;
    };
};
