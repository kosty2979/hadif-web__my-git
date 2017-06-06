import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { User } from '../../classes/user';
import { AvatarPics } from '../../classes/avatar-pics';

@Component({
  selector: 'content',
  templateUrl: 'setting.component.html'
})

export class SettingComponent implements OnInit, OnDestroy  {
	user: User = new User();
	avatar: AvatarPics = new AvatarPics();

	subscription: Subscription;

	constructor(private route: ActivatedRoute,
				private authService: AuthService,
				private userDataService: UserDataService,
				private router: Router
		){};

	ngOnInit(){
		if ( !this.authService.isAuthorized() ){
		this.router.navigate(['/register']);
		};
		this.getUserInfo()
	};

	public getUserInfo(){
	 this.subscription = this.userDataService.getUserData().subscribe((answer: User) => {
	       this.user = answer;
	   });
	};

	public  getImageUrl(){
		return this.userDataService.getUserImageUrl(this.user);
		
	};

	ngOnDestroy() {
	  this.subscription.unsubscribe();
	};

};
