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
var http_1 = require("@angular/http");
var http_2 = require("@angular/http");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var config_service_1 = require("../services/config.service");
var auth_service_1 = require("./auth.service");
var angular2_toaster_1 = require("angular2-toaster");
var toster;
var VideoItemsService = (function () {
    function VideoItemsService(http, config, auth, toasterService) {
        this.http = http;
        this.config = config;
        this.auth = auth;
        this.toasterService = toasterService;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        toster = toasterService;
        this.getConfig().then(function (config) {
            //        console.log(config);
        });
    }
    VideoItemsService.prototype.getConfig = function () {
        return this.config.getConfig();
    };
    VideoItemsService.prototype.getUrl = function (itemid, bitrate, protocolid) {
        var _this = this;
        var extsessionid = (this.auth.authDate) ? this.auth.authDate.session : null;
        bitrate = bitrate || "MB";
        protocolid = protocolid || 5;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('getUrl', extsessionid.toString());
            })
                .then(function (url) {
                var data = { extsessionid: extsessionid, itemid: itemid, bitrate: bitrate, protocolid: protocolid };
                return _this.http.get(url + '&' + _this.config.toQuery(data)).toPromise();
            })
                .then(function (res) {
                if (res.json().getUrl[0].errorcode !== "0") {
                    return reject(res.json().getUrl[0].errorcode);
                }
                resolve(res.json().getUrl[0]);
            });
        })
            .catch(this.handleError);
    };
    VideoItemsService.prototype.getItemList = function (itemType) {
        var _this = this;
        var extsessionid = (this.auth.authDate) ? this.auth.authDate.session : null;
        ;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('getItemList', c.channelId.toString());
            })
                .then(function (url) {
                var data = { itemType: itemType, channelid: config.channelId.toString() };
                return _this.http.get(url + '&' + _this.config.toQuery(data)).toPromise();
            })
                .then(function (res) {
                if (!res.json().getItemList) {
                    return reject(res.json());
                }
                resolve(res.json().getItemList);
            });
        })
            .catch(this.handleError);
    };
    // private getItemListUrl = 'http://api.visionip.tv/api/JSONMOBILE/getItemList?version=2&clientId=24&digest=ece8c6bb327b053498a788fd7f55d1b0&channelid=772&';  // URL to web api
    // getItemList(): Promise<any> {
    //   return this.http.get(this.getItemListUrl as any)
    //     .toPromise()
    //     .then(response => response.json().data)
    //     .catch(this.handleError);
    // }
    VideoItemsService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        if (error == 105) {
            localStorage.removeItem('authDate');
            window.location.href = '/login';
        }
        toster.pop('error', 'Sorry', 'Some Error has Occured!');
        return Promise.reject(error.message || error);
    };
    return VideoItemsService;
}());
VideoItemsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, config_service_1.ConfigService, auth_service_1.AuthService, angular2_toaster_1.ToasterService])
], VideoItemsService);
exports.VideoItemsService = VideoItemsService;
//# sourceMappingURL=video-items.service.js.map