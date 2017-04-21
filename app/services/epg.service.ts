import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { BaseRequestOptions, RequestOptions } from '@angular/http';

import { Observable} from 'rxjs/Rx';
import * as moment from 'moment';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { ConfigService }          from './config.service';
import { AuthService } from './auth.service';
import {ToasterModule, ToasterService} from 'angular2-toaster';
let toster:ToasterService;

@Injectable()
export class EpgService {

	constructor(
	 	private http: Http,
	 	private config: ConfigService,
		private toasterService: ToasterService) {
	    toster = toasterService;
		};

	public getPortalTimeline(){
		let url:string = 'getPortalTimeline';
		let config:any;
		let options = new RequestOptions({ headers: this.headers});

		let startdate:string = ( moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD') ).toString();
		let starttime:string = 	"00:00:01";
		let duration:string = 	"20160";

		return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, config.portalId )
        })
        .then((url)=>{
          let data = {
          	portalid	: config.portalId,
          	startdate	: startdate,
          	starttime	: starttime,
          	duration	: duration,
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          // if (res.json().errorcode !== "0"){
          //   return reject(res.json().errorcode);
          // }
          //resolve(res.json());
          resolve(res.json().getPortalTimeline[0].items);
        });
    })
		.catch(this.handleError);
	};

	public getTimeline ( itemid  :string){
		let id = itemid;
		let url:string = 'getTimeline';
		let config:any;
		let options = new RequestOptions({ headers: this.headers});

		let startdate:string = ( moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD') ).toString();
    let starttime:string =   "00:00:01";
    let duration:string =   "20160";
    
		return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl( url, id )
        })
        .then((url)=>{
          let data = {
          	itemid	: id,
          	startdate	: startdate,
          	starttime	: starttime,
          	duration	: duration,
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().errorcode !== "0"){
            return reject(res.json().errorcode);
          }
          resolve(res.json().getTimeline[0]);
        })
    })
		.catch(/*this.handleError*/);
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
		toster.pop('error', 'Oops', 'Something went wrong!');
		return Promise.reject(error.message || error);
	};

};
