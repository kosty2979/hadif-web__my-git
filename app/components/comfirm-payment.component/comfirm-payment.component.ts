import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { PaymentService } from '../../services/payment.service';
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
				this.success = true;
				localStorage.removeItem('voucherCode');
				localStorage.removeItem('voucherPrice');
				this.authService.refreshSubscriptions();
				setTimeout(()=>{
					this.router.navigate(['/live']);
				}, 3000)
	};

};
