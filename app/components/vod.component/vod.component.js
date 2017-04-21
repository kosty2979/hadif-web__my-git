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
var chenal_service_1 = require("../../services/chenal.service");
var Rx_1 = require("rxjs/Rx");
var auth_service_1 = require("../../services/auth.service");
var VodComponent = (function () {
    function VodComponent(chenal, authService) {
        var _this = this;
        this.chenal = chenal;
        this.authService = authService;
        this.types = [];
        this.search = false;
        this.errortext = '';
        this.error = false;
        this.inFocus = true;
        this.chenal.getSeries({}, null)
            .then(function (d) { return _this.seriesList = _this.sotringArray(d, 'publishDatetime', true); });
        this.chenal.getGenre({}, null)
            .then(function (d) { return _this.types = d; });
        this.initEmiter();
    }
    VodComponent.prototype.hasAccess = function (item) { return this.authService.hasAccess(item); };
    VodComponent.prototype.initEmiter = function () {
        var _this = this;
        this.searchEmitter = new Rx_1.Subject();
        this.searchEmitter
            .debounceTime(500)
            .distinctUntilChanged()
            .switchMap(function (val) {
            _this.chenal.getsearchItems(_this.searchInput.trim(), 3)
                .then(function (answer) {
                _this.error = false;
                _this.searchSeriesList = _this.sotringArray(answer, 'added', true);
            })
                .catch(function (error) {
                _this.errortext = error;
                _this.error = true;
                _this.searchSeriesList = [];
                _this.searchEmitter.complete();
            });
            return val;
        }).subscribe();
    };
    VodComponent.prototype.getField = function (field, series) {
        var lang = localStorage.getItem('lang');
        if (!lang)
            lang = 'en';
        var fieldAr = field + 'OL';
        if (field == "contentTitle")
            fieldAr = "titleOL";
        if (lang == 'en') {
            return series[field] || series[fieldAr] || " :(( ";
        }
        else {
            return series[fieldAr] || series[field] || " :(( ";
        }
    };
    ;
    VodComponent.prototype.applyFilter = function () {
        var _this = this;
        var genre = [];
        for (var i in this.types) {
            if (this.types[i].enable) {
                genre.push(parseInt(this.types[i].genreId));
            }
        }
        this.chenal.getSeries({ filter: { genre: genre, sorting: this.sorting } }, null)
            .then(function (d) { return _this.seriesList = d; });
    };
    ;
    VodComponent.prototype.ngOnChanges = function () {
    };
    VodComponent.prototype.getSearch = function () {
        if (this.searchEmitter.isStopped)
            this.initEmiter();
        if (this.searchInput.length > 0)
            this.searchEmitter.next(this.searchInput.trim());
    };
    ;
    VodComponent.prototype.exitSearch = function () {
        this.search = false;
        this.searchSeriesList = [];
        this.error = false;
        this.errortext = '';
        this.searchInput = '';
    };
    ;
    VodComponent.prototype.ngOnInit = function () {
        //    this.heroService.getHeroes()
        //      .then(heroes => this.heroes = heroes.slice(1, 5));
    };
    ;
    VodComponent.prototype.sotringArray = function (array, field, revers) {
        var r = revers ? -1 : 1;
        if (array && field) {
            array.sort(function (a, b) {
                if (a[field] < b[field]) {
                    return -1 * r;
                }
                else if (a[field] > b[field]) {
                    return 1 * r;
                }
                else {
                    return 0;
                }
            });
        }
        ;
        return array;
    };
    ;
    return VodComponent;
}());
VodComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'vod.component.html'
    }),
    __metadata("design:paramtypes", [chenal_service_1.ChenalService, auth_service_1.AuthService])
], VodComponent);
exports.VodComponent = VodComponent;
//# sourceMappingURL=vod.component.js.map