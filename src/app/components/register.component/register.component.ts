import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User } from '../../classes/user';
 
@Component({
	selector: 'content',
	templateUrl: 'register.component.html'
})


export class RegisterComponent {
	user:User = new User();
	error:boolean = false;
	complite:boolean = false;
	errortext:string ='';

 constructor( private authService: AuthService,
							private router: Router
  ){};

 ngOnInit() { 
	 	if (this.authService.isAuthorized()){
	 		this.router.navigate(['/logout']);
	 	}
	};
 
 onSubmit(){
  	this.authService.register( this.user)
  	.then(()=>{
			this.error = false;
			this.complite = true;
			this.authService.login( this.user.username, this.user.password ).then(()=>{
				setTimeout(()=>{
					this.router.navigate(['/live']);
				}, 3000)
			})
			.catch( error  => {
				this.errortext = error;
				this.error = true
			})
  	})
  	.catch( error  => {
  		this.errortext = error;
  		this.error = true
  	})
	};

}
