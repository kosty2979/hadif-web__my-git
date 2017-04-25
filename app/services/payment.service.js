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
var config_service_1 = require("./config.service");
var auth_service_1 = require("./auth.service");
var angular2_toaster_1 = require("angular2-toaster");
var core_2 = require("@ngx-translate/core");
var toster;
var Types;
(function (Types) {
    Types[Types["Free"] = 1] = "Free";
    Types[Types["Recurring"] = 2] = "Recurring";
    Types[Types["OneOffPayment"] = 3] = "OneOffPayment";
})(Types = exports.Types || (exports.Types = {}));
var PaymentService = (function () {
    function PaymentService(http, config, authService, toasterService, translate) {
        this.http = http;
        this.config = config;
        this.authService = authService;
        this.toasterService = toasterService;
        this.translate = translate;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        toster = toasterService;
    }
    ;
    PaymentService.prototype.getCards = function () {
        var _this = this;
        var url = 'getCards';
        var config;
        var extsessionid = this.authService.authDate.session;
        var options = new http_2.RequestOptions({ headers: this.headers });
        return new Promise(function (resolve, reject) {
            _this.getConfig()
                .then(function (c) {
                config = c;
                return _this.config.getUrl(url, extsessionid);
            })
                .then(function (url) {
                var data = {
                    extsessionid: extsessionid,
                    excludeExpired: 1
                };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json());
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    /**
    *  period:
    *  recurring 1 month =>r1m
    *  recurring 3 months =>r3m
    *  recurring 6 months =>r6m
    *  recurring 1 year =>r1y
    *  recurring 2 years =>r2y
    *  one off 1 month =>o1m
    *  one off 3 months =>o3m
    *  one off 6 months =>o6m
    *  one off 1 year =>o1y
    *  one off 2 years =>o2y
    */
    PaymentService.prototype.getHpayDetails = function (type, period, voucher) {
        var _this = this;
        var url = 'hpayPrepareCheckout';
        var config;
        var extsessionid = this.authService.authDate.session;
        var options = new http_2.RequestOptions({ headers: this.headers });
        var autoRenew = type == 2 ? 1 : 0;
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
                    pType: type,
                    pPeriod: period,
                    channelId: config.channelId,
                    autoRenew: autoRenew
                };
                if (voucher)
                    data.voucher = voucher;
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json().hpayPrepareCheckout);
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    PaymentService.prototype.hpayMakePayment = function (cId) {
        var _this = this;
        var url = 'hpayMakePayment';
        var config;
        var extsessionid = this.authService.authDate.session;
        var options = new http_2.RequestOptions({ headers: this.headers });
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
                    extsessionid: extsessionid,
                    cId: cId,
                    channelId: config.channelId
                };
                return _this.http.post(url, _this.config.toQuery(data), options).toPromise();
            })
                .then(function (res) {
                if (res.json().errorcode !== "0") {
                    return reject(res.json().errorcode);
                }
                resolve(res.json());
            });
        })
            .catch(function (e) { return _this.handleError(e); });
    };
    ;
    PaymentService.prototype.getConfig = function () {
        return this.config.getConfig();
    };
    ;
    PaymentService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
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
    return PaymentService;
}());
PaymentService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        config_service_1.ConfigService,
        auth_service_1.AuthService,
        angular2_toaster_1.ToasterService,
        core_2.TranslateService])
], PaymentService);
exports.PaymentService = PaymentService;
;
//# sourceMappingURL=payment.service.js.map