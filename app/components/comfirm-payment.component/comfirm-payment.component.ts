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

		this.paymentService.hpayMakePayment(hpay.checkoutId)
		.then(()=>{
				sessionStorage.removeItem('hpayDetails');
				sessionStorage.removeItem('price');
				this.success = true;
				localStorage.removeItem('voucherCode');
				localStorage.removeItem('voucherPrice');
				this.authService.refreshSubscriptions();
				setTimeout(()=>{
					this.router.navigate(['/live']);
				}, 3000)
		})
		.catch(()=>{
			this.error = true;
		})

	};

};
