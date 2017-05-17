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
var core_2 = require("@ngx-translate/core");
var auth_service_1 = require("./services/auth.service");
var AppComponent = (function () {
    function AppComponent(translate, renderer, router, authService) {
        var _this = this;
        this.translate = translate;
        this.renderer = renderer;
        this.router = router;
        this.authService = authService;
        translate.addLangs(["en", "ar"]);
        translate.setDefaultLang('ar');
        localStorage.setItem('lang', 'ar');
        var lang = localStorage.getItem('lang');
        if (!lang)
            lang = 'en';
        // let browserLang = translate.getBrowserLang();
        // this.langChange(browserLang.match(/en|ar/) ? browserLang : lang);
        this.langChange(lang);
        this.lang = renderer.listenGlobal('document', 'click', function (event) {
            if (event.target.name == 'lang' && ['en', 'ar'].indexOf(event.target.lang) > -1) {
                _this.langChange(event.target.lang);
                event.preventDefault();
            }
        });
    }
    AppComponent.prototype.ngOnDestroy = function () {
        if (this.lang) {
            this.lang();
        }
    };
    AppComponent.prototype.isAuthorized = function () {
        if (this.authService.isAuthorized()) {
            this.username = this.authService.authDate.username;
            return true;
        }
        else {
            this.username = '';
            return false;
        }
    };
    ;
    AppComponent.prototype.langChange = function (lang) {
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
        if (lang == 'en') {
            window['$']('#dinamic-css')[0].href = '/css/english-main.css';
            window['wpwlOptions'] = { locale: "", paymentTarget: "_top" };
            console.log("set EN locale");
        }
        else {
            window['$']('#dinamic-css')[0].href = '/css/main.css';
            window['wpwlOptions'] = { locale: "ar", paymentTarget: "_top" };
            console.log("set AR locale");
        }
    };
    ;
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-app',
        templateUrl: 'app.component.html'
    }),
    __metadata("design:paramtypes", [core_2.TranslateService,
        core_1.Renderer,
        router_1.Router,
        auth_service_1.AuthService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map