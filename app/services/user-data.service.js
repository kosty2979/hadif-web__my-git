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
var Subject_1 = require("rxjs/Subject");
var avatar_pics_1 = require("../classes/avatar-pics");
var md5_1 = require("ts-md5/dist/md5");
var api_errors_1 = require("../classes/api-errors");
var config_service_1 = require("./config.service");
var angular2_toaster_1 = require("angular2-toaster");
var core_2 = require("@ngx-translate/core");
var toster;
var UserDataService = (function () {
    function UserDataService(http, config, toasterService, translate) {
        this.http = http;
        this.config = config;
        this.toasterService = toasterService;
        this.translate = translate;
        this.avatar = new avatar_pics_1.AvatarPics();
        this.userData = new Subject_1.Subject();
        this.authDate = {
            session: '',
            hash: '',
            username: ''
        };
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        toster = toasterService;
    }
    ;
    UserDataService.prototype.getAuthDate = function () {
        if (localStorage.getItem('authDate')) {
            var auth = JSON.parse(localStorage.getItem('authDate'));
            this.authDate = {
                session: auth.session,
                hash: auth.hash,
                username: auth.username
            };
        }
    };
    ;
    UserDataService.prototype.getUserData = function () {
        var _this = this;
        this.getUserDataServer().then(function (user) {
            _this.userData.next(user);
        });
        return this.userData.asObservable();
    };
    ;
    UserDataService.prototype.getUserDataServer = function () {
        var _this = this;
        this.getAuthDate();
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var param = "extsessionid=" + ((this.authDate) ? this.authDate.session : '');
        return new Promise(function (resolve, reject) {
            if (!_this.authDate || !_this.authDate.session)
                reject(105);
            if (_this.userinfo) {
                return resolve(_this.userinfo);
            }
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('getUserData', _this.authDate.session);
            })
                .then(function (url) {
                return _this.http.post(url, param, options).toPromise();
            })
                .then(function (res) {
                if (res.json()) {
                    if (res.json().errorcode != "0") {
                        reject(res.json().errorcode);
                        return;
                    }
                    _this.userinfo = res.json();
                    resolve(res.json());
                }
                else {
                    throw new TypeError('auth fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.getUserImageUrl = function (user) {
        var url = "/img/profile/ic_glasses.png";
        if (user.avatar) {
            var pic = this.avatar.pics.find(function (item) {
                return item.val == user.avatar;
            });
            if (pic) {
                url = "/img/profile/" + pic.name;
            }
            ;
        }
        ;
        return url;
    };
    ;
    UserDataService.prototype.changePassword = function (passwordObj) {
        var _this = this;
        var url = 'changePassword';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var extsessionid = (this.authDate) ? this.authDate.session : null;
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, passwordObj.newPassword);
            })
                .then(function (url) {
                var data = {
                    portalid: config.portalId,
                    username: _this.authDate.username,
                    password: passwordObj.oldPassword,
                    newpass: passwordObj.newPassword
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
                    resolve();
                }
                else {
                    throw new TypeError('auth fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.resetPass = function (username) {
        var _this = this;
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl('forgottenPassword', username);
            })
                .then(function (url) {
                var data = { username: username, portalid: config.portalId };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
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
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.editUserDetails = function (user) {
        var _this = this;
        var url = 'editUserDetails';
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
                    extsessionid: extsessionid,
                    avatar: user.avatar ? user.avatar : '',
                    email: user.email,
                    firstName: user.firstName ? user.firstName : '',
                    lastName: user.lastName ? user.lastName : '',
                    phone: user.phone ? user.phone : ''
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
                    _this.resetUserInfo();
                    _this.getUserData();
                    resolve();
                }
                else {
                    throw new TypeError('fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.hpayGetSubscriptions = function (clear) {
        var _this = this;
        if (clear) {
            this.userSubscr = null;
        }
        ;
        var url = 'hpayGetSubscriptions';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var extsessionid = (this.authDate) ? this.authDate.session : null;
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            if (_this.userSubscr) {
                return resolve(_this.userSubscr);
            }
            ;
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, extsessionid);
            })
                .then(function (url) {
                var data = {
                    extsessionid: extsessionid,
                    channelId: config.channelId
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
                    _this.userSubscr = res.json().hpayGetSubscriptions;
                    resolve(res.json().hpayGetSubscriptions);
                }
                else {
                    throw new TypeError('fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.hpayGetPastTransactions = function () {
        var _this = this;
        var url = 'hpayGetPastTransactions';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var extsessionid = (this.authDate) ? this.authDate.session : null;
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            if (_this.usertransactions) {
                return resolve(_this.usertransactions);
            }
            ;
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, extsessionid);
            })
                .then(function (url) {
                var data = {
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
                    _this.usertransactions = res.json().hpayGetPastTransactions;
                    resolve(res.json().hpayGetPastTransactions);
                }
                else {
                    throw new TypeError('fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.hpayUpdateCard = function () {
        var _this = this;
        var url = 'hpayUpdateCard';
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
                    resolve(res.json().hpayUpdateCard);
                }
                else {
                    throw new TypeError('fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.hpayUpdateCardPayment = function (cId) {
        var _this = this;
        var url = 'hpayUpdateCardPayment';
        var config;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var extsessionid = (this.authDate) ? this.authDate.session : null;
        return new Promise(function (resolve, reject) {
            if (!extsessionid)
                return reject(105);
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, cId);
            })
                .then(function (url) {
                var data = {
                    cId: cId,
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
                    resolve(res.json());
                }
                else {
                    throw new TypeError('fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.hpayUpdateAutoRenew = function (code) {
        var _this = this;
        var url = 'hpayUpdateAutoRenew';
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
                    autoRenew: code,
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
                    resolve(res.json());
                }
                else {
                    throw new TypeError('fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.hpayCancelRecurringPayment = function () {
        var _this = this;
        var url = 'hpayCancelRecurringPayment';
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
                    resolve(res.json());
                }
                else {
                    throw new TypeError('fail');
                }
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.resetUserInfo = function () {
        this.userinfo = null;
        this.userSubscr = null;
        this.usertransactions = null;
    };
    ;
    UserDataService.prototype.getConfig = function () {
        return this.config.getConfig();
    };
    ;
    UserDataService.prototype.getUrl = function (name, digest) {
        var _this = this;
        var url;
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getConfig()
                .then(function (config) {
                url = config.apiUrl + config.apiTemplate + '/' + name + '?version=2&clientId=' + config.clientId + '&digest=';
                var token = md5_1.Md5.hashStr(config.token + digest);
                resolve(url + token);
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    UserDataService.prototype.handleError = function (error) {
        console.error('An error occurred', api_errors_1.default[error] || error); // for demo purposes only
        if (error == 105) {
            localStorage.removeItem('authDate');
            window.location.href = '/login';
        }
        var errorText = error || 'Something went wrong';
        var errorTitel = 'Sorry';
        this.translate.get([errorTitel, errorText]).subscribe(function (translations) {
            toster.pop('error', translations[errorTitel], translations[errorText]);
        });
        return Promise.reject(error.message || error);
    };
    ;
    return UserDataService;
}());
UserDataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        config_service_1.ConfigService,
        angular2_toaster_1.ToasterService,
        core_2.TranslateService])
], UserDataService);
exports.UserDataService = UserDataService;
;
//# sourceMappingURL=user-data.service.js.map