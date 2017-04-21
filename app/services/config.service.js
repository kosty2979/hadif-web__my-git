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
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var md5_1 = require("ts-md5/dist/md5");
var ConfigService = (function () {
    function ConfigService(http) {
        var _this = this;
        this.http = http;
        this.load = this.http.get('../../app/config.json')
            .toPromise()
            .then(function (res) {
            _this.config = res.json().config;
        });
    }
    ConfigService.prototype.getCashed = function () {
        return this.config;
    };
    ConfigService.prototype.getConfig = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.load.then(function () {
                resolve(_this.config);
            });
        });
    };
    ConfigService.prototype.getUrl = function (name, digest) {
        var url;
        var self = this;
        return new Promise(function (resolve, reject) {
            self.getConfig()
                .then(function (config) {
                url = config.apiUrl + config.apiTemplate + '/' + name + '?version=2&clientId=' + config.clientId + '&digest=';
                var token = md5_1.Md5.hashStr(config.token + digest);
                resolve(url + token);
            });
        });
    };
    ConfigService.prototype.toQuery = function (data) {
        var params = [];
        for (var i in data) {
            params.push(i + '=' + data[i]);
        }
        return params.join('&');
    };
    ConfigService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    return ConfigService;
}());
ConfigService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map