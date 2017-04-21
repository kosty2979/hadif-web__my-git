import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { BaseRequestOptions, RequestOptions } from '@angular/http';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import 'rxjs/add/observable/of';

import {Md5} from 'ts-md5/dist/md5';
import { ConfigService }          from '../services/config.service';
import {AuthService} from './auth.service';

import { VideoItem } from '../../app/classes/video-item';
import { UrlItem } from '../../app/classes/url-item';
import errors from '../classes/api-errors';
import {ToasterModule, ToasterService} from 'angular2-toaster';
let toster:ToasterService;

@Injectable()
export class VideoItemsService {


  constructor(private http: Http, private config: ConfigService, private auth:AuthService,  private toasterService: ToasterService) {
    toster = toasterService;
      this.getConfig().then((config)=>{
//        console.log(config);
      });
  }

  getConfig(): Promise<any> {
    return this.config.getConfig();
  }

  private headers = new Headers({'Content-Type': 'application/json'});

  public getUrl(itemid: number, bitrate?: string, protocolid?: number	): Promise<UrlItem> {
    let extsessionid = (this.auth.authDate)?this.auth.authDate.session:null;
    bitrate = bitrate || "MB";
    protocolid = protocolid || 5;
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    return new Promise((resolve, reject) => {
      if (!extsessionid) return reject(105);
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl('getUrl', extsessionid.toString())
        })
        .then((url)=>{
          let data = {extsessionid:extsessionid, itemid:itemid, bitrate:bitrate, protocolid:protocolid};
          return this.http.get(url+'&'+this.config.toQuery(data)).toPromise();
        })
        .then(res=>{
          if (res.json().getUrl[0].errorcode !== "0"){
            return reject(res.json().getUrl[0].errorcode);
          }
          resolve(res.json().getUrl[0]);
        });
      })
      .catch(this.handleError);
    }

    public getItemList(itemType: number	): Promise<UrlItem> {
      let extsessionid = (this.auth.authDate)?this.auth.authDate.session:null;;
      let config:any;
      let options = new RequestOptions({ headers: this.headers});
      return new Promise((resolve, reject) => {
        if (!extsessionid) return reject(105);
        this.getConfig()
          .then(c=>{
            config = c;
            return this.config.getUrl('getItemList', c.channelId.toString())
          })
          .then((url)=>{
            let data = {itemType:itemType, channelid: config.channelId.toString()};
            return this.http.get(url+'&'+this.config.toQuery(data)).toPromise();
          })
          .then(res=>{
            if (!res.json().getItemList){
              return reject(res.json());
            }
            resolve(res.json().getItemList);
          });
        })
        .catch(this.handleError);
      }

  // private getItemListUrl = 'http://api.visionip.tv/api/JSONMOBILE/getItemList?version=2&clientId=24&digest=ece8c6bb327b053498a788fd7f55d1b0&channelid=772&';  // URL to web api
  // getItemList(): Promise<any> {
  //   return this.http.get(this.getItemListUrl as any)
  //     .toPromise()
  //     .then(response => response.json().data)
  //     .catch(this.handleError);
  // }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    if (error == 105){
      localStorage.removeItem('authDate');
      window.location.href = '/login';
    }
    toster.pop('error', 'Oops', 'Something went wrong!');
    return Promise.reject(error.message || error);
  }
}
