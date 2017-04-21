import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

 
@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'voucher.component.html'
})

export class VoucherComponent {
	vouchNumber:string;
	error:boolean = false;
	errorVoucher:boolean = false;
	complite:boolean = false;
	errortext:string ='';
	errortextVoucher:string ='';


	constructor( private authService: AuthService,
							private router: Router
	){};

	ngOnInit(){
		if ( !this.authService.isAuthorized() ){
		this.router.navigate(['/register']);
		};
	};

	onSubmit(){
	this.authService.getVoucher( this.vouchNumber, true )
		.then(()=>{
				this.error=false;
				this.complite =true;
				this.errorVoucher = false;
				setTimeout(()=>{
				this.router.navigate(['/price']);
			}, 2500)
		})
		.catch( error  => {
			this.errortextVoucher = error;
			this.errorVoucher = true;
		})
	}
}
