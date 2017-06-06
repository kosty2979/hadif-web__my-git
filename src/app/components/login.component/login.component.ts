import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { TransmiteService } from '../../services/transmite.service';
import { User } from '../../classes/user';
 
@Component({
	selector: 'content',
	templateUrl: 'login.component.html'
})

export class LoginComponent {

	user:User = new User();
	error:boolean = false;
	errortext:string = '';

	constructor( private authService: AuthService,
							private router: Router,
							private transmiteService:TransmiteService
	){};

	ngOnInit() { 
	 	if (this.authService.isAuthorized()){
	 		this.router.navigate(['/live']);
	 	}
	};

	onSubmit(){
		this.authService.login( this.user.username, this.user.password )
		.then(()=>{
			this.error = false;
			let url = this.transmiteService.getUrl()
			if(url){
				this.router.navigate([url]);
			} else {
			this.router.navigate(['/live']);
			}
		})
		.catch( error  => {
			this.errortext = error;
			this.error = true
		})
	};
}
