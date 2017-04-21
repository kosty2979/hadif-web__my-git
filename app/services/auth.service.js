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
var router_1 = require("@angular/router");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var md5_1 = require("ts-md5/dist/md5");
var config_service_1 = require("../services/config.service");
var user_data_service_1 = require("../services/user-data.service");
var api_errors_1 = require("../classes/api-errors");
var toster;
var AuthService = (function () {
    function AuthService(http, config, router, toasterService, userDataService) {
        this.http = http;
        this.config = config;
        this.router = router;
        this.toasterService = toasterService;
        this.userDataService = userDataService;
        this.authDate = {
            session: '',
            hash: '',
            username: ''
        };
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        toster = toasterService;
        if (localStorage.getItem('authDate')) {
            var auth = JSON.parse(localStorage.getItem('authDate'));
            this.authDate = {
                session: auth.session,
                hash: auth.hash,
                username: auth.username
            };
        }
    }
    AuthService.prototype.isAuthorized = function () {
        if (localStorage.getItem('authDate')) {
            var auth = JSON.parse(localStorage.getItem('authDate'));
            this.authDate = {
                session: auth.session,
                hash: auth.hash,
                username: auth.username
            };
            if (!this.subscription) {
                this.refreshSubscriptions();
            }
        }
        return this.authDate && this.authDate.session && this.authDate.session.length > 0;
    };
    ;
    AuthService.prototype.hasAccess = function (item) {
        if (!item || item.subscription == "Free") {
            return true;
        }
        var access = false;
        var conf = this.config.getCashed();
        this.subscription.forEach(function (el) {
            if (conf.channelId == el.channelid && conf.portalId == el.portalid) {
                access = true;
            }
        });
        return access;
    };
    AuthService.prototype.refreshSubscriptions = function () {
        var _this = this;
        this.subscription = [];
        this.getSubscriptions().then(function (s) { return _this.subscription = s; });
    };
    ;
    AuthService.prototype.getSubscriptions = function () {
        var _this = this;
        var url = 'getSubscriptions';
        var extsessionid = (this.authDate) ? this.authDate.session : null;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, extsessionid.toString());
            })
                .then(function (url) {
                var data = { extsessionid: extsessionid };
                return _this.http.get(url + '&' + _this.config.toQuery(data)).toPromise();
            })
                .then(function (res) {
                if (res.json().errorCode !== "0") {
                    return reject(res.json().errorCode);
                }
                resolve(res.json().subscriptions);
            });
        })
            .catch(this.handleError);
    };
    ;
    AuthService.prototype.getVoucher = function (voucher, price) {
        var _this = this;
        var url = price ? 'voucherGetPrices' : 'voucherClaim';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var extsessionid = (this.authDate) ? this.authDate.session : null;
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, voucher);
            })
                .then(function (url) {
                var data = {
                    voucher: voucher,
                    channelId: config.channelId,
                    extsessionid: extsessionid
                };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json()) {
                    if (res.json().errorcode != "0") {
                        reject(res.json().errorcode);
                        return;
                    }
                    ;
                    if (res.json().voucherGetPrices && res.json().errorcode == "0") {
                        localStorage.setItem('voucherPrice', JSON.stringify(res.json().voucherGetPrices));
                        localStorage.setItem('voucherCode', voucher);
                    }
                    ;
                    resolve();
                }
                else {
                    throw new TypeError('auth fail');
                }
            });
        })
            .catch(this.handleError);
    };
    ;
    AuthService.prototype.getUserRatingSeries = function (seriesId) {
        var _this = this;
        var url = 'getUserRatingSeries';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var extsessionid = (this.authDate) ? this.authDate.session : null;
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, extsessionid);
            })
                .then(function (url) {
                var data = {
                    seriesId: seriesId,
                    extsessionid: extsessionid
                };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json()) {
                    if (res.json().errorcode != "0") {
                        reject(res.json().errorcode);
                        return;
                    }
                    ;
                    resolve(res.json().userRating);
                }
                else {
                    throw new TypeError('auth fail');
                }
            });
        })
            .catch(this.handleError);
    };
    ;
    AuthService.prototype.getPrice = function () {
        var _this = this;
        var url = 'hpayGetSubscriptionPrices';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, config.channelId);
            })
                .then(function (url) {
                var data = {
                    channelId: config.channelId,
                    portalId: config.portalId
                };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json()) {
                    if (res.json().errorcode != "0") {
                        reject(res.json().errorcode);
                        return;
                    }
                    ;
                    resolve(res.json().hpGetSubscriptionPrices);
                }
                else {
                    throw new TypeError('auth fail');
                }
            });
        })
            .catch(this.handleError);
    };
    ;
    AuthService.prototype.getConfig = function () {
        return this.config.getConfig();
    };
    ;
    AuthService.prototype.logout = function () {
        var _this = this;
        localStorage.removeItem('authDate');
        this.userDataService.resetUserInfo();
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var param = "extsessionid=" + ((this.authDate) ? this.authDate.session : '');
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('logout', _this.authDate.session);
            })
                .then(function (url) {
                return _this.http.post(url, param, options).toPromise();
            })
                .then(function () {
                _this.subscription = [];
                _this.authDate = {};
                resolve(true);
            });
        })
            .catch(this.handleError);
    };
    ;
    AuthService.prototype.login = function (user, password) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('login', user);
            })
                .then(function (url) {
                var data = { username: user, password: password, portalid: config.portalId };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().login && res.json().login.length > 0) {
                    if (res.json().login[0].errorcode != "0") {
                        reject(res.json().login[0].errorcode);
                        return;
                    }
                    _this.authDate = {
                        session: res.json().login[0].session,
                        hash: res.json().login[0].hash,
                        username: user
                    };
                    localStorage.setItem('authDate', JSON.stringify(_this.authDate));
                    _this.subscription = [];
                    _this.getSubscriptions().then(function (s) { return _this.subscription = s; });
                    resolve(null);
                }
                else {
                    throw new TypeError('auth fail');
                }
            });
        })
            .catch(this.handleError);
    };
    ;
    AuthService.prototype.register = function (user) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('createUser', user.email);
            })
                .then(function (url) {
                user.portalid = config.portalId;
                return _this.http.post(url, _this.config.toQuery(user), options).toPromise();
            })
                .then(function (res) {
                if (res.json()) {
                    if (res.json().errorcode != "0") {
                        reject(res.json().errorcode);
                        return;
                    }
                    resolve();
                }
                else {
                    throw new TypeError('auth fail');
                }
            });
        })
            .catch(this.handleError);
    };
    ;
    AuthService.prototype.getUrl = function (name, digest) {
        var url;
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getConfig()
                .then(function (config) {
                console.log(config);
                url = config.apiUrl + config.apiTemplate + '/' + name + '?version=2&clientId=' + config.clientId + '&digest=';
                var token = md5_1.Md5.hashStr(config.token + digest);
                resolve(url + token);
            });
        })
            .catch(this.handleError);
    };
    AuthService.prototype.handleError = function (error) {
        console.error('An error occurred', api_errors_1.default[error] || error); // for demo purposes only
        if (error == 105) {
            localStorage.removeItem('authDate');
            window.location.href = '/login';
        }
        toster.pop('error', 'Oops', 'Something went wrong!');
        return Promise.reject(error.message || error);
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        config_service_1.ConfigService,
        router_1.Router,
        angular2_toaster_1.ToasterService,
        user_data_service_1.UserDataService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map