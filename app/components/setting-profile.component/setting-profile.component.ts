import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { PasswordObj } from '../../classes/passwordObj';
import { User } from '../../classes/user';
import { AvatarPics } from '../../classes/avatar-pics';
import { SubscriptionInfo } from '../../classes/subscriptionInfo';
 
@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'setting-profile.component.html',
	styleUrls: ["setting-profile.component.css"]
})

export class SettingProfileComponent implements OnInit, OnDestroy {
		edit:boolean = false;
		password:boolean = false;
		billing:boolean = false;
		card:boolean = false;
		imageEdit:boolean = false;
		subscript:boolean = false;

		subscriptUser: Subscription;

		passwordObj: PasswordObj = new PasswordObj();
		user: User = new User();
		avatar: AvatarPics = new AvatarPics();
		subscriptionInfo: SubscriptionInfo = new SubscriptionInfo();
		transactionInfo:any;

  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
		

	constructor(
		private authService: AuthService,
		private userDataService: UserDataService,
		private router: Router
	){};

	ngOnInit(){
		this.getUserInfo();
		this.getUserSubscription();
		this.getUserTransaction();
	};

	private getStatus():boolean{
		return !( this.edit || this.password || this.billing || this.card || this.subscript)
	};

	private changePass( form:any ){
	 this.userDataService.changePassword( this.passwordObj ).then(()=>{
	 			this.passwordObj.complite = true;
				this.passwordObj.errortext = '';
				this.passwordObj.error = false;
				setTimeout(()=>{
					this.password =  false;
					this.passwordObj = new PasswordObj();							
				}, 2000 );
			})
			.catch( error  => {
				// this.passwordObj = new PasswordObj();	
				this.passwordObj.complite = false;
				this.passwordObj.errortext = error;
				this.passwordObj.error = true;
				form.reset()
			});
	};

	private getUserInfo(){
	this.subscriptUser = this.userDataService.getUserData().subscribe((answer: User) => {
	     this.user = answer;
	 });
	};

	private getUserSubscription(){
   this.userDataService.hpayGetSubscriptions()
   .then((answer: SubscriptionInfo) => {
       this.subscriptionInfo = answer;
   });
	};

	private getUserTransaction(){
   this.userDataService.hpayGetPastTransactions()
   .then((answer:any) => {
       this.transactionInfo = answer;
   });
	};

	private getType(type: any){
		switch (type) {
			case '2':
				return 'Recurring';
			case '3':
				return 'One off	payment';
			default:
				return '';
		}
	};

	private  getImageUrl(){
		return this.userDataService.getUserImageUrl(this.user);
	};

	private onSubmitUserInfo(){
		this.userDataService.editUserDetails(this.user).then( () =>{
   	this.edit =!this.edit;
  	});
	};

	private updateCard(){
			this.router.navigate(['/setting/updateCard'])
	};

	private autoRenewUpdate(autoRenew:any){

		let code = autoRenew.srcElement.checked? 1:0;
		this.userDataService.hpayUpdateAutoRenew(code).then(()=>{
			this.subscriptionInfo.autoRenew = code;
				}
			)
		.catch(()=>{
			autoRenew.srcElement.checked = this.subscriptionInfo.autoRenew==1? true:false
			//this.subscript = !this.subscript
		})
	};

	private getFreePeriod(){
		let answer;
		if(this.subscriptionInfo.freePeriodEndDate){
			answer = new Date(this.subscriptionInfo.freePeriodEndDate) > new Date()
		};
		return answer			
	};

	private discardFreePeriod(){
		this.userDataService.hpayCancelRecurringPayment().then(()=>{
			this.subscript= false;
			this.authService.refreshSubscriptions();
			this.userDataService.hpayGetSubscriptions( true )
		   .then((answer: SubscriptionInfo) => {
		       this.subscriptionInfo = answer;
		   });
		})
	};

	ngOnDestroy() {
	  this.subscriptUser.unsubscribe();
	};
	
};
