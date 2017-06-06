import {Component, OnChanges, Input, Output, EventEmitter, SimpleChange, ElementRef} from '@angular/core';

let videojs:any= window['videojs'];

@Component({
    selector: 'video-player',
    template: `
    <div *ngIf="!remove">
      <video id="my_video" class="video-js vjs-default-skin" controls preload="auto"
      data-setup='{}'>
      </video>
    </div>
  <div class="control">
    <!--<button title="{{'Share' | translate}}" *ngIf="download" class="download" (click)="downloadVideo()"></button>-->
    <button title="{{'Fullscreen' | translate}}" class="fullscreen" (click)="fullscreen()"></button>
  </div>
    <p  *ngIf='live && !catch' class="liveOverlay">{{'LIVE' | translate}}</p>
    <p  *ngIf='catch' class="liveOverlay">{{'catch' | translate}}</p>  
`,
})


export class VideoPlayer implements OnChanges {
    @Input() url: string;
    @Input() preRoll: string ;
    @Input() download: string;
    @Input() live: string;
    @Input() catch: string;

    @Output() endVideo =new EventEmitter();


    remove: boolean = false;
    id = 'player-';
    player:any
    constructor(private elem:ElementRef){
      //super()
    }
    fullscreen(){
      if (!document['fullscreenElement'] &&    // alternative standard method
      !document['mozFullScreenElement'] && !document['webkitFullscreenElement']) {
        let elem = this.elem.nativeElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
      } else {
        if (document['cancelFullScreen']) {
          document['cancelFullScreen']();
        } else if (document['mozCancelFullScreen']) {
          document['mozCancelFullScreen']();
        } else if (document['webkitCancelFullScreen']) {
          document['webkitCancelFullScreen']();
        }
      }
    }
    downloadVideo(){
      //window.open(this.url);
    }

    initPlayer(src:string, srcPre?:string){
      if(this.player){
        this.player.dispose();
        this.player = null;
      }
      this.remove = true;
      //srcPre ="http://almajd.api.visionip.tv/vod/ASHTTP/almajd/almajd/Hothiyon5_mpg_vod-25f-16x9-MB/playlist.m3u8?extsessionid=58b43118be1dc-a5f0a70928929e33938c792789e04ebe"
      setTimeout(()=>{this.remove = false}, 0);
      setTimeout(()=>{

          this.player =  videojs('my_video');


        this.player.src({
            src: src,
            type: 'application/x-mpegURL'
          });
        if( srcPre && this.player.preroll ){
          if (typeof(this.player.preroll) == 'function'){
          this.player.preroll({
                src:{src:srcPre, type:"application/x-mpegURL"},
                adsOptions: {}
           });
         } else {
           this.player.ads.contentSrc = srcPre;
         }
          this.player.ads.endLinearAdMode()
          this.player.one('adend', function() {
            //this.ads.endLinearAdMode()
            //this.ads.startLinearAdMode()
            this.play();
          });
          setTimeout(()=>{
            this.player.play();
          },0);
          this.player.on('contentupdate', function(){
           this.ads.startLinearAdMode();
          });
        } else {
          this.player.play();
        }

       var self=this
       this.player.one('ended', function() {
              self.endVideo.emit()
        });
    

        if (src == ""){
          this.player.bigPlayButton.hide()
          this.player.pause();
        } else {
          this.player.bigPlayButton.show();
        }
      },10)
    };


    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
         setTimeout(()=>{
           if( changes['url'] ){
             this.initPlayer(changes['url'].currentValue, this.preRoll);
           }
         },100);
    }
    ngOnDestroy() {
      if(this.player){
       this.player.dispose();
       this.player = null;
     }
    }
}
