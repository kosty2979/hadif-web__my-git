import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User } from '../../classes/user';
 
@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'login.component.html'
})

export class LoginComponent {

	user:User = new User();
	error:boolean = false;
	errortext:string = '';

	constructor( private authService: AuthService,
							private router: Router
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
			this.router.navigate(['/live']);
		})
		.catch( error  => {
			this.errortext = error;
			this.error = true
		})
	};
}
