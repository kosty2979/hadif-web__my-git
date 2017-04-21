import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { BaseRequestOptions, RequestOptions } from '@angular/http';
import {ToasterModule, ToasterService} from 'angular2-toaster';

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import 'rxjs/add/observable/of';

import {Md5} from 'ts-md5/dist/md5';
import { ConfigService }          from '../services/config.service';
import errors from '../classes/api-errors';
import {AuthService} from './auth.service';
import {Series} from '../classes/series';
import {Genre} from '../classes/genre';
import {Season} from '../classes/season';
import {VideoItem} from '../classes/video-item';
let toster:ToasterService;

@Injectable()
export class ChenalService {

  constructor( private toasterService: ToasterService, private http: Http, private config: ConfigService, private authService: AuthService) {
      toster = toasterService;
  }

  getConfig(): Promise<any> {
    return this.config.getConfig();
  }

  public getChannelList(): Promise<any> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl('getChannelList', config.portalId.toString())
        })
        .then((url)=>{
          let data = {
            portalid: config.portalId
          };
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().errorcode !== "0" ){
            return reject(res.json().errorcode);
          }
          resolve(res.json().getChannelList);
        });
      })
      .catch(this.handleError);
  }

  public getsearchItems(searchString: string, itemType:number, channelNumber?: boolean): Promise<any> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          return this.config.getUrl('searchItems', searchString )
        })
        .then((url)=>{
          let data:any = {
            searchString: searchString,
            portalid: config.portalId,
            itemType: itemType
          };
          if (channelNumber) data.channelNumber = channelNumber;
          return this.http.get(url+"&"+this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().errorcode !== "0" ){
            return reject(res.json().errorcode);
          }
          if (res.json().errorcode == "0" && res.json().searchItems.length == 0){
            return reject("999");
          }
          resolve(res.json().searchItems[0].items);
        });
      })
      .catch(this.handleError);

  }

  public getGenre	(filter	: any, channelId?: number	): Promise<Genre> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          channelId = channelId || config.channelId;
          return this.config.getUrl('getGenre', channelId.toString())
        })
        .then((url)=>{
          let data = {channelId:channelId};
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().errorcode !== "0"){
            return reject(res.json().errorcode);
          }
          resolve(res.json().getGenre);
        });
      })
      .catch(this.handleError);
  }

  public getSeries(filter	: any, channelId?: number	): Promise<Series[]> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          channelId = channelId || config.channelId;
          return this.config.getUrl('getSeries', channelId.toString())
        })
        .then((url)=>{
          let data = {filter:JSON.stringify(filter),channelId:channelId};
          return this.http.get(url+'&'+this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().errorcode !== "0"){
            return reject(res.json().errorcode);
          }
          resolve(res.json().getSeries);
        });
      })
      .catch(this.handleError);
  };

  public getSeriesItems  (Id:number): Promise<Series> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;

          return this.config.getUrl('getSeriesItems', Id.toString())
        })
        .then((url)=>{
          let data = {
            seriesId  :Id,
            channelId:config.channelId
          };
          return this.http.get(url+'&'+this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().errorcode !== "0"){
            return reject(res.json().errorcode);
          }
          resolve(res.json().getSeriesItems);
        });
      })
      .catch(this.handleError);
  };


  public getSeason(seriesId	: number, channelId?: number	): Promise<Season[]> {
    let config:any;
    let options = new RequestOptions({ headers: this.headers});
    return new Promise((resolve, reject) => {
      this.getConfig()
        .then(c=>{
          config = c;
          channelId = channelId || config.channelId;
          return this.config.getUrl('getSeason', seriesId.toString())
        })
        .then((url)=>{
          let data = {seriesId:seriesId, channelId:channelId};
          return this.http.post(url, this.config.toQuery(data), options).toPromise();
        })
        .then(res=>{
          if (res.json().errorcode !== "0"){
            return reject(res.json().errorcode);
          }
          resolve(res.json().getSeason);
        });
      })
      .catch(this.handleError);
    }

/**
*extsessionid string Required
  itemid int Required
  bitrate int Required Bitrate	ID
  protocolid
*
*/


public rateSeries(seriesId	: number, rating:number, channelId?: number	): Promise<VideoItem[]> {
  let config:any;
  var extsessionid = (this.authService.authDate)?this.authService.authDate.session:null;
  let options = new RequestOptions({ headers: this.headers});
  return new Promise((resolve, reject) => {
    if (!extsessionid) return reject(105);
    this.getConfig()
      .then(c=>{
        config = c;
        channelId = channelId || config.channelId;
        return this.config.getUrl('rateSeries', seriesId.toString())
      })
      .then((url)=>{
        let data = {rate:rating, extsessionid:extsessionid, seriesId:seriesId};
        return this.http.post(url, this.config.toQuery(data), options).toPromise();
      })
      .then(res=>{
        if (res.json().errorcode !== "0"){
          return reject(res.json().errorcode);
        }
        resolve(res.json().rateSeries);
      });
    })
    .catch(this.handleError);
  }
    public getSeasonItems(seasonId	: number, seriesId	: number, channelId?: number	): Promise<VideoItem[]> {
      let config:any;
      let options = new RequestOptions({ headers: this.headers});
      return new Promise((resolve, reject) => {
        this.getConfig()
          .then(c=>{
            config = c;
            channelId = channelId || config.channelId;
            return this.config.getUrl('getSeasonItems', seasonId.toString())
          })
          .then((url)=>{
            let data = {seasonId:seasonId, seriesId:seriesId, channelId:channelId};
            return this.http.post(url, this.config.toQuery(data), options).toPromise();
          })
          .then(res=>{
            if (res.json().errorcode !== "0"){
              return reject(res.json().errorcode);
            }
            resolve(res.json().getSeasonItems.items);
          });
        })
        .catch(this.handleError);
      }


  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

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
