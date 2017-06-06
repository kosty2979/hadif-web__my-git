import { Component } from '@angular/core';
import { Router } from '@angular/router';


import { UserDataService } from '../../services/user-data.service';
import { User } from '../../classes/user';
 
@Component({
	selector: 'content',
	templateUrl: 'lost-pass.component.html'
})

export class LostPassComponent {
	user:User = new User();
	error:boolean = false;
	complite:boolean = false;
	errortext:string ='';

	constructor( private userDataService: UserDataService,
							private router: Router
	){};

	onSubmit(){
		this.userDataService.resetPass( this.user.username)
  	.then(()=>{
			this.error = false;
			this.complite = true;
			setTimeout(()=>{
				this.router.navigate(['/login']);
			}, 3000)
  	})
  	.catch( string  => {
  		this.errortext = string;
  		this.error = true
  	})
	};

	}