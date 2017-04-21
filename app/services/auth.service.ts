import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { BaseRequestOptions, RequestOptions } from '@angular/http';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import 'rxjs/add/observable/of';

import { Md5 } from 'ts-md5/dist/md5';
import { ConfigService }          from '../services/config.service';
import { UserDataService }          from '../services/user-data.service';
import { AuthData } from '../classes/auth-data';
import { User } from '../classes/user';
import { PasswordObj } from '../classes/passwordObj';
import errors from '../classes/api-errors';
let toster:ToasterService;
@Injectable()
export class AuthService {
  subscription:any;
  constructor(
    private http: Http,
    private config: ConfigService,
    private router: Router,
    private toasterService: ToasterService,
    private userDataService: UserDataService,
    ) {
    toster = toasterService;
    if(localStorage.getItem('authDate')){
      let auth:any = JSON.parse(localStorage.getItem('authDate'));
      this.authDate = {
        session: auth.session,
        hash: auth.hash,
        username: auth.username
      };
    }

  }

  public authDate:AuthData = {
        session: '',
        hash: '',
        username: ''
      };

  public isAuthorized(){
    if(localStorage.getItem('authDate')){
      let auth:any = JSON.parse(localStorage.getItem('authDate'));
      this.authDate = {
        session: auth.session,
        hash: auth.hash,
        username: auth.username
        };
      if(!this.subscription) {
        this.refreshSubscriptions();
      }
    }
    return this.authDate && this.authDate.session && this.authDate.session.length>0;
  };

  hasAccess(item:any){

    if(!item || item.subscription == "Free"){
      return true;
    }
    let access = false;
    let conf:any = this.config.getCashed();
    this.subscription.forEach((el:any)=>{
      if(conf.channelId == el.channelid && conf.portalId == el.portalid){
        access = true;
      }
    })
    return access;
  }
public refreshSubscriptions(){
   this.subscription = [];
   this.getSubscriptions().then(s=>this.subscription=s);
};
  

public getSubscriptions(): Promise<any> {
  let url:string = 'getSubscriptions';
  let extsessionid = (this.authDate)?this.authDate.session:null;
  let config:any;
  let options = new RequestOptions({ headers: this.headers});

  return new Promise((resolve, reject) => {
    if (!extsessionid) return reject(105);
    this.getConfig()
      .then(c=>{
        config = c;
        return this.config.getUrl(url, extsessionid.toString())
      })
      .then((url)=>{
        let data = {extsessionid:extsessionid};
        return this.http.get(url+'&'+this.config.toQuery(data)).toPromise();
      })
      .then(res=>{
        if (res.json().errorCode !== "0"){
          return reject(res.json().errorCode);
        }
        resolve(res.json().subscriptions);
      });
    })
    .catch(this.handleError);
};

  public getVoucher( voucher:string, price:boolean ): Promise<any> {
    let url:string = price ? 'voucherGetPrices' : 'voucherClaim';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let extsessionid = (this.authDate)?this.authDate.session:null;

    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, voucher)
        })
        .then((url)=>{
          let data = {
            voucher: voucher,
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
            if( res.json().voucherGetPrices && res.json().errorcode == "0" ){
              localStorage.setItem('voucherPrice', JSON.stringify( res.json().voucherGetPrices ));
              localStorage.setItem('voucherCode', voucher );
            };
            resolve();
          } else {
            throw new TypeError('auth fail');
          }
        });
      })
      .catch(this.handleError);
  };


  public getUserRatingSeries( seriesId:number): Promise<any> {
    let url:string = 'getUserRatingSeries';
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
            seriesId:seriesId,
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
            resolve(res.json().userRating);
          } else {
            throw new TypeError('auth fail');
          }
        });
      })
      .catch(this.handleError);
  };



  public getPrice(): Promise<any> {
    let url:string = 'hpayGetSubscriptionPrices';
    let config:any;
    let options = new RequestOptions({ headers: this.headers});

    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, config.channelId )
        })
        .then((url)=>{
          let data = {
            channelId:config.channelId,
            portalId: config.portalId
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json()){
            if (res.json().errorcode != "0"){
              reject(res.json().errorcode);
              return;
            };
          resolve(res.json().hpGetSubscriptionPrices)
          } else {
            throw new TypeError('auth fail');
          }
        });
      })
      .catch(this.handleError);
  };



  getConfig(): Promise<any> {
    return this.config.getConfig();
  };

  public logout(){
    localStorage.removeItem('authDate');
    this.userDataService.resetUserInfo();
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    let param = "extsessionid="+ ((this.authDate)?this.authDate.session:'');

    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl('logout',this.authDate.session)
        })
        .then((url)=>{
          return this.http.post(url, param, options).toPromise();
        })
        .then(()=>{
          this.subscription = [];
          this.authDate  = {};
          resolve( true );
        });
      })
      .catch(this.handleError);
  };

  public login(user: string, password: string): Promise<any> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});

    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl('login',user)
        })
        .then((url)=>{
          let data = {username:user, password:password,portalid:config.portalId};

          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().login && res.json().login.length>0){
            if (res.json().login[0].errorcode != "0"){
              reject(res.json().login[0].errorcode);
              return;
            }
            this.authDate = {
              session: res.json().login[0].session,
              hash: res.json().login[0].hash,
              username: user
            };
            localStorage.setItem('authDate', JSON.stringify(this.authDate));
            this.subscription = [];
            this.getSubscriptions().then(s=>this.subscription=s);
            resolve(null);
          } else {
            throw new TypeError('auth fail');
          }
        });
      })
      .catch(this.handleError);
  };

  public register(user: any): Promise<any> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});

    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl('createUser',user.email)
        })
        .then((url)=>{
          user.portalid = config.portalId;
          return this.http.post(url, this.config.toQuery(user), options).toPromise();
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

  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });


  public getUrl(name: string, digest: string): Promise<string>{
    let url:string;
    let self = this;

    return new Promise((resolve, reject) => {
      self.getConfig()
      .then((config)=>{
        console.log(config);
        url = config.apiUrl + config.apiTemplate + '/' + name + '?version=2&clientId=' + config.clientId + '&digest=';
        let token:string = Md5.hashStr(config.token+digest) as string;
        resolve(url+token);
      });
    })
    .catch(this.handleError);
  }

  private handleError(error: any):Promise<any>{
    console.error('An error occurred', errors[error]||error); // for demo purposes only
    if (error == 105){
      localStorage.removeItem('authDate');
      window.location.href = '/login';
    }
    toster.pop('error', 'Oops', 'Something went wrong!');
    return Promise.reject(error.message || error);
  }
}
