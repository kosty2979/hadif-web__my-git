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
var moment = require("moment");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var config_service_1 = require("./config.service");
var angular2_toaster_1 = require("angular2-toaster");
var toster;
var EpgService = (function () {
    function EpgService(http, config, toasterService) {
        this.http = http;
        this.config = config;
        this.toasterService = toasterService;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        toster = toasterService;
    }
    ;
    EpgService.prototype.getPortalTimeline = function () {
        var _this = this;
        var url = 'getPortalTimeline';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var startdate = (moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD')).toString();
        var starttime = "00:00:01";
        var duration = "20160";
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, config.portalId);
            })
                .then(function (url) {
                var data = {
                    portalid: config.portalId,
                    startdate: startdate,
                    starttime: starttime,
                    duration: duration,
                };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                // if (res.json().errorcode !== "0"){
                //   return reject(res.json().errorcode);
                // }
                //resolve(res.json());
                resolve(res.json().getPortalTimeline[0].items);
            });
        })
            .catch(this.handleError);
    };
    ;
    EpgService.prototype.getTimeline = function (itemid) {
        var _this = this;
        var id = itemid;
        var url = 'getTimeline';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var startdate = (moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD')).toString();
        var starttime = "00:00:01";
        var duration = "20160";
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, id);
            })
                .then(function (url) {
                var data = {
                    itemid: id,
                    startdate: startdate,
                    starttime: starttime,
                    duration: duration,
                };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().getTimeline[0]);
            });
        })
            .catch();
    };
    ;
    EpgService.prototype.getConfig = function () {
        return this.config.getConfig();
    };
    ;
    EpgService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        if (error == 105) {
            localStorage.removeItem('authDate');
            window.location.href = '/login';
        }
        toster.pop('error', 'Sorry', 'Some Error has Occured!');
        return Promise.reject(error.message || error);
    };
    ;
    return EpgService;
}());
EpgService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        config_service_1.ConfigService,
        angular2_toaster_1.ToasterService])
], EpgService);
exports.EpgService = EpgService;
;
//# sourceMappingURL=epg.service.js.map