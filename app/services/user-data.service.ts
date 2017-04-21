import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { BaseRequestOptions, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


import { AuthData }     from '../classes/auth-data';
import { User }         from '../classes/user';
import { PasswordObj }  from '../classes/passwordObj';
import { AvatarPics }   from '../classes/avatar-pics';
import { SubscriptionInfo } from '../classes/subscriptionInfo';
import { Md5 }          from 'ts-md5/dist/md5';
import errors           from '../classes/api-errors';

import { ConfigService }                 from './config.service';
import { ToasterModule, ToasterService } from 'angular2-toaster';
let toster:ToasterService;

@Injectable()
export class UserDataService {
  userinfo:User;
  userSubscr:SubscriptionInfo;
  usertransactions:any;
  avatar: AvatarPics = new AvatarPics();
  private userData: Subject<User> = new Subject<User>();

	constructor(
	 	private http: Http,
	 	private config: ConfigService,
		private toasterService: ToasterService) {
	    toster = toasterService;
	};

  public authDate:AuthData = {
      session: '',
      hash: '',
      username: ''
  };

  public getAuthDate(){
    if(localStorage.getItem('authDate')){
      let auth:any = JSON.parse(localStorage.getItem('authDate'));
      this.authDate = {
        session: auth.session,
        hash: auth.hash,
        username: auth.username
      };
    }
  };

  public getUserData(): Observable<User>{
     this.getUserDataServer().then((user:User)=>{
       this.userData.next(user);
     })
      return this.userData.asObservable();
  };

  private getUserDataServer(): Promise<any> {
    this.getAuthDate();
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let param = "extsessionid="+ ((this.authDate)?this.authDate.session:'');

    return new Promise((resolve, reject) => {
      if(!this.authDate || !this.authDate.session) reject(105);
      if(this.userinfo){
        return resolve(this.userinfo);
      }
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl('getUserData',this.authDate.session)
        })
        .then((url)=>{
          return this.http.post(url, param, options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            }
            this.userinfo = res.json();
            resolve(res.json());
          } else {
            throw new TypeError('auth fail');
          }
        });
      })
      .catch(this.handleError);
  };

  public  getUserImageUrl(user:User){
    let url:string = "/img/profile/ic_glasses.png";
     if(user.avatar){
       let pic = this.avatar.pics.find((item)=>{
          return item.val == user.avatar
        });
        if(pic){
          url = "/img/profile/"+pic.name;
        };
    };
    return url;
  };

  public changePassword( passwordObj:PasswordObj ):Promise<any>{
    let url:string = 'changePassword';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let extsessionid = (this.authDate)?this.authDate.session:null;

    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, passwordObj.newPassword )
        })
        .then((url)=>{
          let data = {
            portalid  : config.portalId,
            username  : this.authDate.username,
            password  : passwordObj.oldPassword,
            newpass   : passwordObj.newPassword
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            };
            resolve();
          } else {
            throw new TypeError('auth fail');
          }
        })
      })
      .catch(this.handleError);
  };

  public resetPass(username: string): Promise<any> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});

    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl('forgottenPassword',username)
        })
        .then((url)=>{
          let data = {username:username, portalid:config.portalId};
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            }
            resolve();
          } else {
            throw new TypeError('auth fail');
          }
        });
      })
      .catch(this.handleError);
  };

   public editUserDetails(user:User): Promise<any>{

    let url:string = 'editUserDetails';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let extsessionid = (this.authDate)?this.authDate.session:null;

    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, extsessionid)
        })
        .then((url)=>{
          let data = {
            extsessionid: extsessionid,
            avatar: user.avatar? user.avatar : '',
            email: user.email,
            firstName: user.firstName? user.firstName :'',
            lastName: user.lastName? user.lastName:'',
            phone: user.phone? user.phone : ''
      
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            };
            this.resetUserInfo();
            this.getUserData();
            resolve();
          } else {
            throw new TypeError('fail');
          }
        });
      })
      .catch(this.handleError);
  };

  public hpayGetSubscriptions(clear?:boolean): Promise<any>{ 
    if(clear){
      this.userSubscr = null;
    };
    let url:string = 'hpayGetSubscriptions'; 
    let config:any; 
    let options = new RequestOptions({ headers: this.headers}); 
    let extsessionid = (this.authDate)?this.authDate.session:null; 
 
    return new Promise((resolve, reject) => { 
      if (!extsessionid) return reject(105);
      if(this.userSubscr){
        return resolve(this.userSubscr);
      };
      this.getConfig() 
        .then(c=>{ 
          config = c; 
          return this.config.getUrl( url, extsessionid) 
        }) 
        .then((url)=>{ 
          let data = { 
            extsessionid: extsessionid, 
            channelId  : config.channelId 
          }; 
          return this.http.post(url, this.config.toQuery(data), options).toPromise(); 
        }) 
        .then(res=>{ 
          if (res.json()){ 
            if (res.json().errorcode != "0"){ 
              reject(res.json().errorcode); 
              return; 
            }; 
            this.userSubscr = res.json().hpayGetSubscriptions;
            resolve(res.json().hpayGetSubscriptions); 
          } else { 
            throw new TypeError('fail'); 
          } 
        }); 
      }) 
    .catch(this.handleError); 
  };

  public hpayGetPastTransactions(): Promise<any> {
    let url:string = 'hpayGetPastTransactions';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let extsessionid = (this.authDate)?this.authDate.session:null; 

    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);
      if(this.usertransactions){
        return resolve(this.usertransactions);
      };
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, extsessionid )
        })
        .then((url)=>{
          let data = {
            channelId:config.channelId,
            extsessionid: extsessionid
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            };
          this.usertransactions = res.json().hpayGetPastTransactions
          resolve(res.json().hpayGetPastTransactions)
          } else {
            throw new TypeError('fail');
          }
        });
      })
      .catch(this.handleError);
  };   
 
 public hpayUpdateCard(): Promise<any>{
    let url:string = 'hpayUpdateCard';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let extsessionid = (this.authDate)?this.authDate.session:null;

    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);

      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, extsessionid )
        })
        .then((url)=>{
          let data = {
            channelId:config.channelId,
            extsessionid: extsessionid
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            };
          resolve(res.json().hpayUpdateCard)
          } else {
            throw new TypeError('fail');
          }
        });
      })
      .catch(this.handleError);
 };

 public hpayUpdateCardPayment(cId:string): Promise<any>{
    let url:string = 'hpayUpdateCardPayment';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let extsessionid = (this.authDate)?this.authDate.session:null;

    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);

      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, cId )
        })
        .then((url)=>{
          let data = {
            cId: cId, 
            channelId:config.channelId,
            extsessionid: extsessionid
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            };
          resolve(res.json())
          } else {
            throw new TypeError('fail');
          }
        });
      })
      .catch(this.handleError);
 };

  public hpayUpdateAutoRenew(code:number): Promise<any>{
    let url:string = 'hpayUpdateAutoRenew';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let extsessionid = (this.authDate)?this.authDate.session:null;

    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);

      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, extsessionid )
        })
        .then((url)=>{
          let data = {
            autoRenew: code, 
            channelId:config.channelId,
            extsessionid: extsessionid
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            };
          resolve(res.json())
          } else {
            throw new TypeError('fail');
          }
        });
      })
      .catch(this.handleError);
 };

  public hpayCancelRecurringPayment(): Promise<any>{
    let url:string = 'hpayCancelRecurringPayment';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let extsessionid = (this.authDate)?this.authDate.session:null;

    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);

      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, extsessionid )
        })
        .then((url)=>{
          let data = {
            channelId:config.channelId,
            extsessionid: extsessionid
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            };
          resolve(res.json())
          } else {
            throw new TypeError('fail');
          }
        });
      })
      .catch(this.handleError);
 };

  public resetUserInfo(){
    this.userinfo = null;
    this.userSubscr = null;
    this.usertransactions = null;
  };

  getConfig(): Promise<any> {
    return this.config.getConfig();
  };

  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  public getUrl(name: string, digest: string): Promise<string>{
    let url:string;
    let self = this;

    return new Promise((resolve, reject) => {
      self.getConfig()
      .then((config)=>{
        url = config.apiUrl + config.apiTemplate + '/' + name + '?version=2&clientId=' + config.clientId + '&digest=';
        let token:string = Md5.hashStr(config.token+digest) as string;
        resolve(url+token);
      });
    })
    .catch(this.handleError);
  };

  private handleError(error: any):Promise<any>{
    console.error('An error occurred', errors[error]||error); // for demo purposes only
    if (error == 105){
      localStorage.removeItem('authDate');
      window.location.href = '/login';
    }
    toster.pop('error', 'Oops', 'Something went wrong!');
    return Promise.reject(error.message || error);
  };
  
};
