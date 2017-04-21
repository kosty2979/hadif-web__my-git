import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ChenalService } from '../../services/chenal.service';
import { ConfigService } from '../../services/config.service';
import { VideoItemsService } from '../../services/video-items.service';
import {AuthService} from '../../services/auth.service';

import { Season } from '../../classes/season';
import {VideoItem} from '../../classes/video-item';
import {UrlItem} from '../../classes/url-item';

@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'vod-episode.component.html'
})

export class VodEpisodeComponent {
		id: number;
    ses: string;
    item: number;
		private sub: any;
    seriesData:any ={};
		sesons: Season[] = [];
		selected: number = 0;
		episodes: VideoItem[] = [];
    itemNumber: number = 0;
    video: Object = {};
    rating: number = 0;
    ratingSeries:number = 0;
    sort:number = -1;
    subscription: any[] = [];
		urlError: string;
    hasAccess(item:any){ return  this.authService.hasAccess(item);}


		constructor(
			private route: ActivatedRoute,
			private chenal:ChenalService,
			private videoitem:VideoItemsService,
			private router: Router,
			private authService: AuthService,
			private confService:ConfigService) {}


initAverage(){
 this.chenal.getSeriesItems(this.id)
 .then(items=>{
    this.seriesData = items
    this.ratingSeries =  this.seriesData.average 
  })
 .catch( error  => {
      console.log(error);
    })
};

	ngOnInit() {
     if (!this.authService.isAuthorized()){
      return this.router.navigate(['/login']);
     }
    this.route.params.subscribe(params => {
			 this.id = params['id'];
       this.ses = params['ses'];
       this.item = params['item'];
			 this.selected = 0;
       this.itemNumber = 0;
       this.initAverage();
       this.authService.getUserRatingSeries(this.id)
        .then(r=>this.rating=r);
       this.chenal.getSeason(this.id,null)
			 .then(sesons=>this.sesons=sesons)
			 .then(()=>{
         if(this.ses){
           this.selected = this.sesons.findIndex(el => {
             return el.seasonId == this.ses;
           })
           if (this.selected == -1) {
             this.ses = null;
             this.item = null;
             this.selected = 0;
           }
         }
         return this.chenal.getSeasonItems(parseInt(this.sesons[this.selected].seasonId),this.id)})
			 .then(episodes=>this.episodes=episodes)
       .then(()=>{
         this.sotring();
         if(this.item){
           this.itemNumber = this.episodes.findIndex(el => {
             return el.itemId == this.item;
           })
           if (this.itemNumber == -1) {
             this.ses = null;
             this.item = null;
             this.itemNumber = 0;
           }
         }
        if (this.hasAccess(this.episodes[this.itemNumber]))  {
					return this.videoitem.getUrl(this.episodes[this.itemNumber].itemId)
					.catch(e=>{this.urlError=e;
						this.video={};
					})
				}
        return this.video= {};
       })
       .then((item:any)=>{
         this.video=item})


		});
	}
  rate(){
    this.chenal.rateSeries(this.id, this.rating)
      .then((r:any)=> this.ratingSeries = parseFloat(r.average))
    window['$'].fancybox.close();
  }

  download(){
    //window.open(this.video);
  }

  sotring(){
    this.sort = -this.sort;
      this.episodes.sort((a, b)=>{
        if (a.contentTitle < b.contentTitle) {
          return -this.sort;
        }
        if (a.contentTitle > b.contentTitle) {
          return this.sort;
        }
        // a должно быть равным b
        return 0;
      })
  }
  formatedDuration(duration:string){
    let parts:string[] = duration.split(':');
    parts.pop();
    return parts.join(":");
  }

	private select(select:number){
		this.selected = select;
    this.itemNumber = 0;
    this.chenal.getSeasonItems(parseInt(this.sesons[this.selected].seasonId),this.id)
		.then(episodes=>this.episodes=episodes)
    .then(()=>{
      this.ses = this.sesons[this.selected].seasonId;
      this.item = this.episodes[this.itemNumber].itemId;
      history.pushState({}, '', 'vod-episodes/'+this.id+'/'+this.ses+'/'+ this.item);
      if (this.hasAccess(this.episodes[this.itemNumber])){
				return this.videoitem.getUrl(this.episodes[this.itemNumber].itemId)
					.catch(e=>{this.urlError=e;
						this.video={};
					});
				}
      return this.video= {};
    })
    .then((item:any)=>{
      this.video=item;

    });

	}

  private selectEpisod(select:number){
    if (!this.hasAccess(this.episodes[select])) {
      return this.video= {};
    }
    this.itemNumber = select;
    this.ses = this.sesons[this.selected].seasonId;
    this.item = this.episodes[this.itemNumber].itemId;
    history.pushState({}, '', 'vod-episodes/'+this.id+'/'+this.ses+'/'+ this.item);
    this.videoitem.getUrl(this.episodes[this.itemNumber].itemId)
    .then(item=>this.video=item)
		.catch(e=>{this.urlError=e;
			this.video={};
		})

  }

  private getField(field:string , obj:any){
    let lang = localStorage.getItem('lang');
		if (!lang) lang = 'en';
    let fieldAr = field+'OL';
    if (field=="contentTitle") fieldAr = "titleOL";
    if (field=="synopsis" && !obj.seasonId) fieldAr = "longsynopsisOL"; //in getSeason field is called synopsisOL and in getItemList it's longsynopsisOL  :-/
    if (lang == 'en'){
      return obj[field] || obj[fieldAr] || " :(( ";
    } else {
      return obj[fieldAr] || obj[field] || " :(( ";
    }
  };

  private goToVoucher(){
      this.router.navigate(['/voucher'])
    };

	ngOnDestroy() {
		if(this.sub) this.sub.unsubscribe();
	};

	}
