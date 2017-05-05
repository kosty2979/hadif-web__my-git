import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoItemsService } from '../../services/video-items.service';
import { ChenalService } from '../../services/chenal.service';
import { ConfigService } from '../../services/config.service';
import { TransmiteService } from '../../services/transmite.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs/Rx';


import { VideoItem } from '../../classes/video-item';

@Component({
  moduleId: module.id,
  selector: 'content',
  templateUrl: 'live.component.html'
})

export class LiveComponent implements OnInit {
  private searchEmitter:Subject<any>;
  private searchInput:any;
  private errortext:string ='';
  private error:boolean = false;
  private searchItem:any;
  private inFocus:boolean = true;
  catchUp:boolean =false;
  search : string = "";
  searchVideo: any = {}; // Url

  itemId:number;
  selectChanel:number = 0;
  videoItems: any;
  video: any = {}; // Url
  subscription: any[] = [];
  urlError:string;
  searchMode = false;
  contextObj:any={};


  constructor(
    private route: ActivatedRoute,
    private videoItemsService: VideoItemsService,
    private chenalService: ChenalService,
    private router: Router,
    private authService: AuthService,
    private confService:ConfigService,
    private transmiteService:TransmiteService
    )
    {
      this.initEmiter();
    }

    initEmiter(){
      this.searchEmitter = new Subject<any>();
      this.searchEmitter
        .debounceTime(500)
        .distinctUntilChanged()
        .switchMap((val:string) => {
            this.chenalService.getsearchItems( this.searchInput.toString(), 2,  true)
            .then(answer =>{
                 this.error = false;
                 this.searchItem = (answer)?answer[0]:{};
                 this.getSearchVideo();
               })
               .catch(error=>{
                 this.errortext = error;
                 this.error = true;
                 this.searchItem = null;
                 this.searchEmitter.complete();
                 this.searchVideo = {};
               });
               return val;
        }).subscribe();
    }
    private getField(field:string ,obj:any){
      let lang = localStorage.getItem('lang');
  		if (!lang) lang = 'en';
      let fieldAr = field+'OL';
      if (field=="contentTitle") fieldAr = "titleOL";
      if (field=="synopsis") fieldAr = "longsynopsisOL";
      if (lang == 'en'){
        return obj[field] || obj[fieldAr] || " :(( ";
      } else {
        return obj[fieldAr] || obj[field] || " :(( ";
      }
    };

    hasAccess(item:any){ return  this.authService.hasAccess(item);}

    ngOnInit(): void {
    
      if (!this.authService.isAuthorized()){
       this.transmiteService.setUrl(this.router.url)
       this.router.navigate(['/login']);
       return;
      }
      this.route.params.subscribe(params => {
        
         let id = params['id'];
         if ( id =="catch" ){
          let obj:any = this.transmiteService.getContext();
          this.itemId = obj.groupId;
          this.loadCatchVideo(obj);
         }else{

         //this.itemId = params['id'];
  			 this.itemId = +id;
         this.loadLive();
         }

         
       })
    }
    private getSearch(){
      if (this.searchEmitter.isStopped) this.initEmiter();
      if(this.searchInput) this.searchEmitter.next(this.searchInput.toString());
    };

    private exitSearch(){
      this.searchMode = false;
      this.searchItem = null;
      this.error = false;
      this.errortext = '';
      this.searchInput = null;
      this.search = "";
      this.catchUp = false;
    };



    loadLive() {
      this.videoItemsService.getItemList(1)
        .then(videoItems =>{ 
          this.videoItems = videoItems})
        .then(()=>{
          if(this.itemId){
            this.selectChanel = this.videoItems.findIndex((el:any) => {
              return el.itemid == this.itemId;
            })
            if (this.selectChanel == -1) {
              this.selectChanel = 0;
            }
          }

          if (this.hasAccess(this.videoItems[this.selectChanel])){
            this.itemId = this.videoItems[this.selectChanel].itemid;
            return this.videoItemsService.getUrl(this.videoItems[this.selectChanel].itemid)
            .catch(e=>{this.urlError=e;
              this.video={};
            });
          }
        })
        .then(item=>{
          if(item){
             this.video=item 
            } else (
              this.urlError="130"
            );
          })
    }

    private select(select:number){
  		this.selectChanel = select;
      this.catchUp = false;
      if (!this.hasAccess(this.videoItems[this.selectChanel])) {
        return this.video= {};
      }
      this.itemId = this.videoItems[this.selectChanel].itemid;
      history.pushState({}, '', 'live/'+ this.itemId);
      this.videoItemsService.getUrl(this.itemId)
      .then(item=>this.video=item)
      .catch(e=>{this.urlError=e;
        this.video={};
      });

  	};

    private loadCatchVideo(contextObj:any){

      this.catchUp = true;
      let id= contextObj.itemId;
      if( !this.videoItems ){
        this.videoItemsService.getItemList(1)
        .then(videoItems => this.videoItems = videoItems)
        .then(()=>{
          this.selectChanel = this.videoItems.findIndex((el:any) => {
                return el.itemid == this.itemId;
              })
          });
      };
      this.videoItemsService.getUrl(id)
      .then(item=>this.video=item)
      .catch(e=>{this.urlError=e;
        this.video={};
      });
      this.contextObj = contextObj;
    };
    
    private loadSearchCatchVideo(contextObj:any){
      this.catchUp = true;
      let id= contextObj.itemId;
      this.videoItemsService.getUrl(id)
      .then(item=>this.searchVideo=item)
      .catch(e=>{this.urlError=e;
        this.video={};
      });
      this.contextObj = contextObj;
    };

    private backToSearchVideo(){
      this.catchUp = false;
      this.getSearchVideo();
    };

    private getSearchVideo(){
      if (this.searchItem && this.hasAccess(this.searchItem)){
         return this.videoItemsService.getUrl(this.searchItem.itemid)
         .then((video)=>this.searchVideo = video)
         .catch(e=>{this.urlError=e;
           this.searchVideo={};
         });
       } else {
         this.searchVideo = {};
       }
    };
    
    private goToVoucher(id:any){
      let url = this.router.url+'/'+id
      this.transmiteService.setUrl(url)
      this.router.navigate(['/voucher'])
    };

    private getImageUrl(item:any){
        return ( item.thumbSDh || item.thumbSDq || item.thumbnail )
    };
};

