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
var chenal_service_1 = require("../../services/chenal.service");
var config_service_1 = require("../../services/config.service");
var video_items_service_1 = require("../../services/video-items.service");
var auth_service_1 = require("../../services/auth.service");
var VodEpisodeComponent = (function () {
    function VodEpisodeComponent(route, chenal, videoitem, router, authService, confService) {
        this.route = route;
        this.chenal = chenal;
        this.videoitem = videoitem;
        this.router = router;
        this.authService = authService;
        this.confService = confService;
        this.seriesData = {};
        this.sesons = [];
        this.selected = 0;
        this.episodes = [];
        this.itemNumber = 0;
        this.video = {};
        this.rating = 0;
        this.ratingSeries = 0;
        this.sort = -1;
        this.subscription = [];
    }
    VodEpisodeComponent.prototype.hasAccess = function (item) { return this.authService.hasAccess(item); };
    VodEpisodeComponent.prototype.initAverage = function () {
        var _this = this;
        this.chenal.getSeriesItems(this.id)
            .then(function (items) {
            _this.seriesData = items;
            _this.ratingSeries = _this.seriesData.average;
        })
            .catch(function (error) {
            console.log(error);
        });
    };
    ;
    VodEpisodeComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.authService.isAuthorized()) {
            return this.router.navigate(['/login']);
        }
        this.route.params.subscribe(function (params) {
            _this.id = params['id'];
            _this.ses = params['ses'];
            _this.item = params['item'];
            _this.selected = 0;
            _this.itemNumber = 0;
            _this.initAverage();
            _this.authService.getUserRatingSeries(_this.id)
                .then(function (r) { return _this.rating = r; });
            _this.chenal.getSeason(_this.id, null)
                .then(function (sesons) { return _this.sesons = sesons; })
                .then(function () {
                if (_this.ses) {
                    _this.selected = _this.sesons.findIndex(function (el) {
                        return el.seasonId == _this.ses;
                    });
                    if (_this.selected == -1) {
                        _this.ses = null;
                        _this.item = null;
                        _this.selected = 0;
                    }
                }
                return _this.chenal.getSeasonItems(parseInt(_this.sesons[_this.selected].seasonId), _this.id);
            })
                .then(function (episodes) { return _this.episodes = episodes; })
                .then(function () {
                _this.sotring();
                if (_this.item) {
                    _this.itemNumber = _this.episodes.findIndex(function (el) {
                        return el.itemId == _this.item;
                    });
                    if (_this.itemNumber == -1) {
                        _this.ses = null;
                        _this.item = null;
                        _this.itemNumber = 0;
                    }
                }
                if (_this.hasAccess(_this.episodes[_this.itemNumber])) {
                    return _this.videoitem.getUrl(_this.episodes[_this.itemNumber].itemId)
                        .catch(function (e) {
                        _this.urlError = e;
                        _this.video = {};
                    });
                }
                return _this.video = {};
            })
                .then(function (item) {
                _this.video = item;
            });
        });
    };
    VodEpisodeComponent.prototype.rate = function () {
        var _this = this;
        this.chenal.rateSeries(this.id, this.rating)
            .then(function (r) { return _this.ratingSeries = parseFloat(r.average); });
        window['$'].fancybox.close();
    };
    VodEpisodeComponent.prototype.download = function () {
        //window.open(this.video);
    };
    VodEpisodeComponent.prototype.sotring = function () {
        var _this = this;
        this.sort = -this.sort;
        this.episodes.sort(function (a, b) {
            if (a.contentTitle < b.contentTitle) {
                return -_this.sort;
            }
            if (a.contentTitle > b.contentTitle) {
                return _this.sort;
            }
            // a должно быть равным b
            return 0;
        });
    };
    VodEpisodeComponent.prototype.formatedDuration = function (duration) {
        var parts = duration.split(':');
        parts.pop();
        return parts.join(":");
    };
    VodEpisodeComponent.prototype.select = function (select) {
        var _this = this;
        this.selected = select;
        this.itemNumber = 0;
        this.chenal.getSeasonItems(parseInt(this.sesons[this.selected].seasonId), this.id)
            .then(function (episodes) { return _this.episodes = episodes; })
            .then(function () {
            _this.ses = _this.sesons[_this.selected].seasonId;
            _this.item = _this.episodes[_this.itemNumber].itemId;
            history.pushState({}, '', 'vod-episodes/' + _this.id + '/' + _this.ses + '/' + _this.item);
            if (_this.hasAccess(_this.episodes[_this.itemNumber])) {
                return _this.videoitem.getUrl(_this.episodes[_this.itemNumber].itemId)
                    .catch(function (e) {
                    _this.urlError = e;
                    _this.video = {};
                });
            }
            return _this.video = {};
        })
            .then(function (item) {
            _this.video = item;
        });
    };
    VodEpisodeComponent.prototype.selectEpisod = function (select) {
        var _this = this;
        if (!this.hasAccess(this.episodes[select])) {
            return this.video = {};
        }
        this.itemNumber = select;
        this.ses = this.sesons[this.selected].seasonId;
        this.item = this.episodes[this.itemNumber].itemId;
        history.pushState({}, '', 'vod-episodes/' + this.id + '/' + this.ses + '/' + this.item);
        this.videoitem.getUrl(this.episodes[this.itemNumber].itemId)
            .then(function (item) { return _this.video = item; })
            .catch(function (e) {
            _this.urlError = e;
            _this.video = {};
        });
    };
    VodEpisodeComponent.prototype.getField = function (field, obj) {
        var lang = localStorage.getItem('lang');
        if (!lang)
            lang = 'en';
        var fieldAr = field + 'OL';
        if (field == "contentTitle")
            fieldAr = "titleOL";
        if (field == "synopsis" && !obj.seasonId)
            fieldAr = "longsynopsisOL"; //in getSeason field is called synopsisOL and in getItemList it's longsynopsisOL  :-/
        if (lang == 'en') {
            return obj[field] || obj[fieldAr] || " :(( ";
        }
        else {
            return obj[fieldAr] || obj[field] || " :(( ";
        }
    };
    ;
    VodEpisodeComponent.prototype.goToVoucher = function () {
        this.router.navigate(['/voucher']);
    };
    ;
    VodEpisodeComponent.prototype.getImageUrl = function (item) {
        return (item.thumbSD || item.thumbSDh || item.thumbSDq || item.thumbnail);
    };
    ;
    VodEpisodeComponent.prototype.ngOnDestroy = function () {
        if (this.sub)
            this.sub.unsubscribe();
    };
    ;
    return VodEpisodeComponent;
}());
VodEpisodeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'vod-episode.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        chenal_service_1.ChenalService,
        video_items_service_1.VideoItemsService,
        router_1.Router,
        auth_service_1.AuthService,
        config_service_1.ConfigService])
], VodEpisodeComponent);
exports.VodEpisodeComponent = VodEpisodeComponent;
//# sourceMappingURL=vod-episode.component.js.map