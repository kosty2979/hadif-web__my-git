import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { TransmiteService } from '../../services/transmite.service';

import { User } from '../../classes/user';

 
@Component({
	selector: 'content',
	templateUrl: 'logout.component.html'
})

export class LogoutComponent {
	subscriptUser: Subscription;
	user: User = new User();
	constructor( 
		private authService: AuthService,
		private userDataService: UserDataService,
		private transmiteService: TransmiteService,
		private router: Router
	 ){};

	ngOnInit(){
		this.getUserInfo();
	};

	public exit(){
		this.transmiteService.getUrl()
		if ( this.authService.isAuthorized()){
		 		return	this.authService.logout().then(()=>{
				this.router.navigate(['/login']);
			});
		};
	this.router.navigate(['/login']);
	};

	public  getImageUrl(){
		return this.userDataService.getUserImageUrl(this.user);
	};

	private getUserInfo(){
	this.subscriptUser = this.userDataService.getUserData().subscribe((answer: User) => {
	     this.user = answer;
	 });
	};
};
