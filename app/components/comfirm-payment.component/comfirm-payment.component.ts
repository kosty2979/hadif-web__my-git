import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PaymentService } from '../../services/payment.service';
import { TransmiteService } from '../../services/transmite.service';
import { AuthService } from '../../services/auth.service';


@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'comfirm-payment.component.html'
})

export class ComfirmPaymentComponent {
	hpay:any;
	success: boolean = false;
	error: boolean  = false;

constructor(
		private paymentService: PaymentService,
		private authService: AuthService,
		private transmiteService: TransmiteService,
		private router: Router
	){};



	ngOnInit(){
		let hpay = JSON.parse(sessionStorage.getItem('hpayDetails'));
		let price = sessionStorage.getItem('price');

	 if(parseInt(price) != 0){
			this.paymentService.hpayMakePayment(hpay.checkoutId)
			.then(()=>{
					this.endPayment();
			})
			.catch(()=>{
				this.error = true;
			})
		} else {
			this.endPayment();
		}

	};
	private endPayment(){
				sessionStorage.removeItem('hpayDetails');
				sessionStorage.removeItem('price');
				sessionStorage.removeItem('freeDays');
				this.success = true;
				localStorage.removeItem('voucherCode');
				localStorage.removeItem('voucherPrice');
				this.authService.refreshSubscriptions();
				setTimeout(()=>{
					let url = this.transmiteService.getUrl()
					if(url){
						this.router.navigate([url]);
					} else {
					this.router.navigate(['/live']);
					}
				}, 3000)
	};

};
