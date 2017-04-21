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
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
 
};
