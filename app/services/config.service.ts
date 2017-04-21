import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import 'rxjs/add/observable/of';

import {Md5} from 'ts-md5/dist/md5';


@Injectable()
export class ConfigService {

  private config: any;
  private load: Promise<any>;

  constructor(private http: Http) {
    this.load = this.http.get('../../app/config.json')
      .toPromise()
      .then(res=>{
        this.config = res.json().config;
      })
  }

  public getCashed():any{
    return this.config;
  }

  public getConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.load.then(()=>{
          resolve(this.config);
        })
    });
  }

  public getUrl(name: string, digest: string): Promise<string>{
    let url:string;
    let self = this;
    return new Promise((resolve, reject) => {
      self.getConfig()
      .then((config)=>{
        url = config.apiUrl + config.apiTemplate + '/' + name + '?version=2&clientId=' + config.clientId + '&digest=';
        let token:string = Md5.hashStr(config.token+digest) as string;
        resolve(url+token);
      })
    });
  }

  public toQuery(data:any){
    let params:string[] = [];
    for(var i in data){
      params.push(i+ '='+ data[i]);
    }
    return params.join('&');
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
