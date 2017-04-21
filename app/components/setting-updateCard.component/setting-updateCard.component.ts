import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { ConfigService } from '../../services/config.service';

@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'setting-updateCard.component.html'
})

export class SettingUpdateCardComponent {
	cId:string;
	url:string;


constructor(
    private authService: AuthService,
	private userDataService: UserDataService,
	private router: Router,
    private config: ConfigService
	){};

	ngOnInit(){
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/register']);
            return;
        };
        
        this.userDataService.hpayUpdateCard().then((answer:any)=>{
            sessionStorage.setItem('updateCardCid', answer.hpayDetails.cId)
        	let site = new URL(window.location.href);
            this.url = site.origin + '/setting/confirmCard';
            
            this.config.getConfig()
            .then(config=>{
                setTimeout(()=>{
                  this.cId = answer.hpayDetails.cId;
                  this.loadScript( config.hpay +'/v1/paymentWidgets.js?checkoutId=' + this.cId);
                },0);
            })
        });
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