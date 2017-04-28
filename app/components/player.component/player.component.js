"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var videojs = window['videojs'];
var VideoPlayer = (function () {
    function VideoPlayer(elem) {
        this.elem = elem;
        this.endVideo = new core_1.EventEmitter();
        this.remove = false;
        this.id = 'player-';
        //super()
    }
    VideoPlayer.prototype.fullscreen = function () {
        if (!document['fullscreenElement'] &&
            !document['mozFullScreenElement'] && !document['webkitFullscreenElement']) {
            var elem = this.elem.nativeElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }
            else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        }
        else {
            if (document['cancelFullScreen']) {
                document['cancelFullScreen']();
            }
            else if (document['mozCancelFullScreen']) {
                document['mozCancelFullScreen']();
            }
            else if (document['webkitCancelFullScreen']) {
                document['webkitCancelFullScreen']();
            }
        }
    };
    VideoPlayer.prototype.downloadVideo = function () {
        //window.open(this.url);
    };
    VideoPlayer.prototype.initPlayer = function (src, srcPre) {
        var _this = this;
        if (this.player) {
            this.player.dispose();
            this.player = null;
        }
        this.remove = true;
        //srcPre ="http://almajd.api.visionip.tv/vod/ASHTTP/almajd/almajd/Hothiyon5_mpg_vod-25f-16x9-MB/playlist.m3u8?extsessionid=58b43118be1dc-a5f0a70928929e33938c792789e04ebe"
        setTimeout(function () { _this.remove = false; }, 0);
        setTimeout(function () {
            _this.player = videojs('my_video');
            _this.player.src({
                src: src,
                type: 'application/x-mpegURL'
            });
            if (srcPre && _this.player.preroll) {
                if (typeof (_this.player.preroll) == 'function') {
                    _this.player.preroll({
                        src: { src: srcPre, type: "application/x-mpegURL" },
                        adsOptions: {}
                    });
                }
                else {
                    _this.player.ads.contentSrc = srcPre;
                }
                _this.player.ads.endLinearAdMode();
                _this.player.one('adend', function () {
                    //this.ads.endLinearAdMode()
                    //this.ads.startLinearAdMode()
                    this.play();
                });
                setTimeout(function () {
                    _this.player.play();
                }, 0);
                _this.player.on('contentupdate', function () {
                    this.ads.startLinearAdMode();
                });
            }
            else {
                _this.player.play();
            }
            var self = _this;
            _this.player.one('ended', function () {
                self.endVideo.emit();
            });
            if (src == "") {
                _this.player.bigPlayButton.hide();
                _this.player.pause();
            }
            else {
                _this.player.bigPlayButton.show();
            }
        }, 10);
    };
    ;
    VideoPlayer.prototype.ngOnChanges = function (changes) {
        var _this = this;
        setTimeout(function () {
            if (changes['url']) {
                _this.initPlayer(changes['url'].currentValue, _this.preRoll);
            }
        }, 100);
    };
    VideoPlayer.prototype.ngOnDestroy = function () {
        if (this.player) {
            this.player.dispose();
            this.player = null;
        }
    };
    return VideoPlayer;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VideoPlayer.prototype, "url", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VideoPlayer.prototype, "preRoll", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VideoPlayer.prototype, "download", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VideoPlayer.prototype, "live", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], VideoPlayer.prototype, "catch", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], VideoPlayer.prototype, "endVideo", void 0);
VideoPlayer = __decorate([
    core_1.Component({
        selector: 'video-player',
        template: "\n    <div *ngIf=\"!remove\">\n      <video id=\"my_video\" class=\"video-js vjs-default-skin\" controls preload=\"auto\"\n      data-setup='{}'>\n      </video>\n    </div>\n  <div class=\"control\">\n    <!--<button title=\"{{'Share' | translate}}\" *ngIf=\"download\" class=\"download\" (click)=\"downloadVideo()\"></button>-->\n    <button title=\"{{'Fullscreen' | translate}}\" class=\"fullscreen\" (click)=\"fullscreen()\"></button>\n  </div>\n    <p  *ngIf='live == true && catch == false' class=\"liveOverlay\">{{'LIVE' | translate}}</p>\n    <p  *ngIf='catch == true' class=\"liveOverlay\">{{'catch' | translate}}</p>  \n",
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], VideoPlayer);
exports.VideoPlayer = VideoPlayer;
//# sourceMappingURL=player.component.js.map