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
var angular2_toaster_1 = require("angular2-toaster");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var config_service_1 = require("../services/config.service");
var auth_service_1 = require("./auth.service");
var toster;
var ChenalService = (function () {
    function ChenalService(toasterService, http, config, authService) {
        this.toasterService = toasterService;
        this.http = http;
        this.config = config;
        this.authService = authService;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        toster = toasterService;
    }
    ChenalService.prototype.getConfig = function () {
        return this.config.getConfig();
    };
    ChenalService.prototype.getChannelList = function () {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('getChannelList', config.portalId.toString());
            })
                .then(function (url) {
                var data = {
                    portalid: config.portalId
                };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().getChannelList);
            });
        })
            .catch(this.handleError);
    };
    ChenalService.prototype.getsearchItems = function (searchString, itemType, channelNumber) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('searchItems', searchString);
            })
                .then(function (url) {
                var data = {
                    searchString: searchString,
                    portalid: config.portalId,
                    itemType: itemType
                };
                if (channelNumber)
                    data.channelNumber = channelNumber;
                return _this.http.get(url + "&" + _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                if (res.json().errorcode == "0" && res.json().searchItems.length == 0) {
                    return reject("999");
                }
                resolve(res.json().searchItems[0].items);
            });
        })
            .catch(this.handleError);
    };
    ChenalService.prototype.getGenre = function (filter, channelId) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                channelId = channelId || config.channelId;
                return _this.config.getUrl('getGenre', channelId.toString());
            })
                .then(function (url) {
                var data = { channelId: channelId };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().getGenre);
            });
        })
            .catch(this.handleError);
    };
    ChenalService.prototype.getSeries = function (filter, channelId) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                channelId = channelId || config.channelId;
                return _this.config.getUrl('getSeries', channelId.toString());
            })
                .then(function (url) {
                var data = { filter: JSON.stringify(filter), channelId: channelId };
                return _this.http.get(url + '&' + _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().getSeries);
            });
        })
            .catch(this.handleError);
    };
    ;
    ChenalService.prototype.getSeriesItems = function (Id) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('getSeriesItems', Id.toString());
            })
                .then(function (url) {
                var data = {
                    seriesId: Id,
                    channelId: config.channelId
                };
                return _this.http.get(url + '&' + _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().getSeriesItems);
            });
        })
            .catch(this.handleError);
    };
    ;
    ChenalService.prototype.getSeason = function (seriesId, channelId) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                channelId = channelId || config.channelId;
                return _this.config.getUrl('getSeason', seriesId.toString());
            })
                .then(function (url) {
                var data = { seriesId: seriesId, channelId: channelId };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().getSeason);
            });
        })
            .catch(this.handleError);
    };
    /**
    *extsessionid string Required
      itemid int Required
      bitrate int Required Bitrate	ID
      protocolid
    *
    */
    ChenalService.prototype.rateSeries = function (seriesId, rating, channelId) {
        var _this = this;
        var config;
        var extsessionid = (this.authService.authDate) ? this.authService.authDate.session : null;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            _this.getConfig()
                .then(function (c) {
                config = c;
                channelId = channelId || config.channelId;
                return _this.config.getUrl('rateSeries', seriesId.toString());
            })
                .then(function (url) {
                var data = { rate: rating, extsessionid: extsessionid, seriesId: seriesId };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().rateSeries);
            });
        })
            .catch(this.handleError);
    };
    ChenalService.prototype.getSeasonItems = function (seasonId, seriesId, channelId) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                channelId = channelId || config.channelId;
                return _this.config.getUrl('getSeasonItems', seasonId.toString());
            })
                .then(function (url) {
                var data = { seasonId: seasonId, seriesId: seriesId, channelId: channelId };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().getSeasonItems.items);
            });
        })
            .catch(this.handleError);
    };
    ChenalService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        if (error == 105) {
            localStorage.removeItem('authDate');
            window.location.href = '/login';
        }
        toster.pop('error', 'Sorry', 'Some Error has Occured!');
        return Promise.reject(error.message || error);
    };
    return ChenalService;
}());
ChenalService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [angular2_toaster_1.ToasterService, http_1.Http, config_service_1.ConfigService, auth_service_1.AuthService])
], ChenalService);
exports.ChenalService = ChenalService;
//# sourceMappingURL=chenal.service.js.map