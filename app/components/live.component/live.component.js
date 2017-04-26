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
var router_1 = require("@angular/router");
var video_items_service_1 = require("../../services/video-items.service");
var chenal_service_1 = require("../../services/chenal.service");
var config_service_1 = require("../../services/config.service");
var transmite_service_1 = require("../../services/transmite.service");
var auth_service_1 = require("../../services/auth.service");
var Rx_1 = require("rxjs/Rx");
var LiveComponent = (function () {
    function LiveComponent(route, videoItemsService, chenalService, router, authService, confService, transmiteService) {
        this.route = route;
        this.videoItemsService = videoItemsService;
        this.chenalService = chenalService;
        this.router = router;
        this.authService = authService;
        this.confService = confService;
        this.transmiteService = transmiteService;
        this.errortext = '';
        this.error = false;
        this.inFocus = true;
        this.catchUp = false;
        this.search = "";
        this.searchVideo = {}; // Url
        this.selectChanel = 0;
        this.video = {}; // Url
        this.subscription = [];
        this.searchMode = false;
        this.contextObj = {};
        this.initEmiter();
    }
    LiveComponent.prototype.initEmiter = function () {
        var _this = this;
        this.searchEmitter = new Rx_1.Subject();
        this.searchEmitter
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap(function (val) {
            _this.chenalService.getsearchItems(_this.searchInput.toString(), 2, true)
                .then(function (answer) {
                _this.error = false;
                _this.searchItem = (answer) ? answer[0] : {};
                _this.getSearchVideo();
            })
                .catch(function (error) {
                _this.errortext = error;
                _this.error = true;
                _this.searchItem = null;
                _this.searchEmitter.complete();
                _this.searchVideo = {};
            });
            return val;
        }).subscribe();
    };
    LiveComponent.prototype.getField = function (field, obj) {
        var lang = localStorage.getItem('lang');
        if (!lang)
            lang = 'en';
        var fieldAr = field + 'OL';
        if (field == "contentTitle")
            fieldAr = "titleOL";
        if (field == "synopsis")
            fieldAr = "longsynopsisOL";
        if (lang == 'en') {
            return obj[field] || obj[fieldAr] || " :(( ";
        }
        else {
            return obj[fieldAr] || obj[field] || " :(( ";
        }
    };
    ;
    LiveComponent.prototype.hasAccess = function (item) { return this.authService.hasAccess(item); };
    LiveComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/login']);
            return;
        }
        this.route.params.subscribe(function (params) {
            var id = params['id'];
            if (id == "catch") {
                var obj = _this.transmiteService.getContext();
                _this.itemId = obj.groupId;
                _this.loadCatchVideo(obj);
            }
            else {
                //this.itemId = params['id'];
                _this.itemId = +id;
                _this.loadLive();
            }
        });
    };
    LiveComponent.prototype.getSearch = function () {
        if (this.searchEmitter.isStopped)
            this.initEmiter();
        if (this.searchInput)
            this.searchEmitter.next(this.searchInput.toString());
    };
    ;
    LiveComponent.prototype.exitSearch = function () {
        this.searchMode = false;
        this.searchItem = null;
        this.error = false;
        this.errortext = '';
        this.searchInput = null;
        this.search = "";
        this.catchUp = false;
    };
    ;
    LiveComponent.prototype.loadLive = function () {
        var _this = this;
        this.videoItemsService.getItemList(1)
            .then(function (videoItems) { return _this.videoItems = videoItems; })
            .then(function () {
            if (_this.itemId) {
                _this.selectChanel = _this.videoItems.findIndex(function (el) {
                    return el.itemid == _this.itemId;
                });
                if (_this.selectChanel == -1) {
                    _this.selectChanel = 0;
                }
            }
            if (_this.hasAccess(_this.videoItems[_this.selectChanel])) {
                _this.itemId = _this.videoItems[_this.selectChanel].itemid;
                return _this.videoItemsService.getUrl(_this.videoItems[_this.selectChanel].itemid)
                    .catch(function (e) {
                    _this.urlError = e;
                    _this.video = {};
                });
            }
        })
            .then(function (item) {
            _this.video = item;
        });
    };
    LiveComponent.prototype.select = function (select) {
        var _this = this;
        this.selectChanel = select;
        this.catchUp = false;
        if (!this.hasAccess(this.videoItems[this.selectChanel])) {
            return this.video = {};
        }
        this.itemId = this.videoItems[this.selectChanel].itemid;
        history.pushState({}, '', 'live/' + this.itemId);
        this.videoItemsService.getUrl(this.itemId)
            .then(function (item) { return _this.video = item; })
            .catch(function (e) {
            _this.urlError = e;
            _this.video = {};
        });
    };
    ;
    LiveComponent.prototype.loadCatchVideo = function (contextObj) {
        var _this = this;
        this.catchUp = true;
        var id = contextObj.itemId;
        if (!this.videoItems) {
            this.videoItemsService.getItemList(1)
                .then(function (videoItems) { return _this.videoItems = videoItems; })
                .then(function () {
                _this.selectChanel = _this.videoItems.findIndex(function (el) {
                    return el.itemid == _this.itemId;
                });
            });
        }
        ;
        this.videoItemsService.getUrl(id)
            .then(function (item) { return _this.video = item; })
            .catch(function (e) {
            _this.urlError = e;
            _this.video = {};
        });
        this.contextObj = contextObj;
    };
    ;
    LiveComponent.prototype.loadSearchCatchVideo = function (contextObj) {
        var _this = this;
        this.catchUp = true;
        var id = contextObj.itemId;
        this.videoItemsService.getUrl(id)
            .then(function (item) { return _this.searchVideo = item; })
            .catch(function (e) {
            _this.urlError = e;
            _this.video = {};
        });
        this.contextObj = contextObj;
    };
    ;
    LiveComponent.prototype.backToSearchVideo = function () {
        this.catchUp = false;
        this.getSearchVideo();
    };
    ;
    LiveComponent.prototype.getSearchVideo = function () {
        var _this = this;
        if (this.searchItem && this.hasAccess(this.searchItem)) {
            return this.videoItemsService.getUrl(this.searchItem.itemid)
                .then(function (video) { return _this.searchVideo = video; })
                .catch(function (e) {
                _this.urlError = e;
                _this.searchVideo = {};
            });
        }
        else {
            this.searchVideo = {};
        }
    };
    ;
    LiveComponent.prototype.goToVoucher = function () {
        this.router.navigate(['/voucher']);
    };
    ;
    LiveComponent.prototype.getImageUrl = function (item) {
        return (item.thumbSDh || item.thumbSDq || item.thumbnail);
    };
    ;
    return LiveComponent;
}());
LiveComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'live.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        video_items_service_1.VideoItemsService,
        chenal_service_1.ChenalService,
        router_1.Router,
        auth_service_1.AuthService,
        config_service_1.ConfigService,
        transmite_service_1.TransmiteService])
], LiveComponent);
exports.LiveComponent = LiveComponent;
;
//# sourceMappingURL=live.component.js.map