import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { BaseRequestOptions, RequestOptions } from '@angular/http';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ConfigService }          from './config.service';
import { AuthService } from './auth.service';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
let toster:ToasterService;

export enum Types {
   Free = 1,
   Recurring = 2,
   OneOffPayment = 3
}

@Injectable()
export class PaymentService {

 constructor(
	 	private http: Http,
	 	private config: ConfigService,
	 	private authService: AuthService,
    private toasterService: ToasterService,
    private translate: TranslateService
    ) {
      toster = toasterService;
    };


  public getCards	(): Promise<any> {
  	let url:string = 'getCards';
    let config:any;
    let extsessionid = this.authService.authDate.session;
    let options = new RequestOptions({ headers: this.headers});

    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, extsessionid )
        })
        .then((url)=>{
          let data = {
          	extsessionid: extsessionid,
          	excludeExpired: 1
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().errorcode !== "0"){
            return reject(res.json().errorcode);
          }
          resolve(res.json());
        });
    })
    .catch(e => this.handleError(e));
  };
/**
*  period:
*  recurring 1 month =>r1m
*  recurring 3 months =>r3m
*  recurring 6 months =>r6m
*  recurring 1 year =>r1y
*  recurring 2 years =>r2y
*  one off 1 month =>o1m
*  one off 3 months =>o3m
*  one off 6 months =>o6m
*  one off 1 year =>o1y
*  one off 2 years =>o2y
*/

 public getHpayDetails(type:number, period:string, voucher:string): Promise<any> {
  let url:string = 'hpayPrepareCheckout';
  let config:any;
  let extsessionid = this.authService.authDate.session;
  let options = new RequestOptions({ headers: this.headers});
  let autoRenew = type == 2? 1 : 0 ;
   

   return new Promise((resolve, reject) => {
     if (!extsessionid)
         return reject(105);
     this.getConfig()
       .then(c=>{
         config = c;
         return this.config.getUrl( url, extsessionid )
       })
       .then((url)=>{
         let data:any = {
          extsessionid: extsessionid,
          pType: type,
          pPeriod:period,
          channelId: config.channelId,
          autoRenew: autoRenew
         };
         if (voucher) data.voucher = voucher;
         return this.http.post(url, this.config.toQuery(data), options).toPromise();
       })
       .then(res=>{
         if (res.json().errorcode !== "0"){
           return reject(res.json().errorcode);
         }

         resolve(res.json().hpayPrepareCheckout);
       })
   })
   .catch(e => this.handleError(e));
 };

 public hpayMakePayment(cId: string): Promise<any> {
  let url:string = 'hpayMakePayment';
   let config:any;
   let extsessionid = this.authService.authDate.session;
   let options = new RequestOptions({ headers: this.headers});

   return new Promise((resolve, reject) => {
     if (!extsessionid)
         return reject(105);
     this.getConfig()
       .then(c=>{
         config = c;
         return this.config.getUrl( url, cId )
       })
       .then((url)=>{
         let data = {
          extsessionid: extsessionid,
          cId: cId,
          channelId: config.channelId
         };
         return this.http.post(url, this.config.toQuery(data), options).toPromise();
       })
       .then(res=>{
         if (res.json().errorcode !== "0"){
           return reject(res.json().errorcode);
         }
         resolve(res.json());
       });
   })
   .catch(e => this.handleError(e));
 };


	private getConfig(): Promise<any> {
		return this.config.getConfig();
	};

  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    if (error == 105){
      localStorage.removeItem('authDate');
      window.location.href = '/login';
    }
    let errorText =  error || 'Something went wrong';
    let errorTitel = 'Sorry' 
    this.translate.get([ errorTitel, errorText ]).subscribe((translations: any) => {
      toster.pop('error', translations[errorTitel], translations[errorText]);
    });
    return Promise.reject(error.message || error);
  }
};
