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
var auth_service_1 = require("../../services/auth.service");
var user_data_service_1 = require("../../services/user-data.service");
var config_service_1 = require("../../services/config.service");
var SettingUpdateCardComponent = (function () {
    function SettingUpdateCardComponent(authService, userDataService, router, config) {
        this.authService = authService;
        this.userDataService = userDataService;
        this.router = router;
        this.config = config;
        this.lang = true;
    }
    ;
    SettingUpdateCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/login']);
            return;
        }
        ;
        this.isEnglish();
        this.userDataService.hpayUpdateCard().then(function (answer) {
            sessionStorage.setItem('updateCardCid', answer.hpayDetails.cId);
            var site = new URL(window.location.href);
            _this.url = site.origin + '/setting/confirmCard';
            _this.config.getConfig()
                .then(function (config) {
                setTimeout(function () {
                    _this.cId = answer.hpayDetails.cId;
                    _this.loadScript(config.hpay + '/v1/paymentWidgets.js?checkoutId=' + _this.cId);
                }, 0);
            });
        });
    };
    ;
    SettingUpdateCardComponent.prototype.ngDoCheck = function () {
        if ((this.lang != this.isEnglish())) {
            this.router.navigate(['/setting/profile']);
        }
    };
    ;
    SettingUpdateCardComponent.prototype.loadScript = function (url) {
        console.log('preparing to load...');
        var oldStyle = document.getElementById('wpwl-style');
        if (oldStyle) {
            document.getElementsByTagName('head')[0].removeChild(oldStyle);
        }
        var node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        this.forScript.nativeElement.appendChild(node);
    };
    ;
    SettingUpdateCardComponent.prototype.isEnglish = function () {
        var lang = localStorage.getItem('lang');
        this.lang = lang == 'en';
        return (lang == 'en');
    };
    ;
    return SettingUpdateCardComponent;
}());
__decorate([
    core_1.ViewChild('wrapForPayment'),
    __metadata("design:type", core_1.ElementRef)
], SettingUpdateCardComponent.prototype, "forScript", void 0);
SettingUpdateCardComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'setting-updateCard.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_data_service_1.UserDataService,
        router_1.Router,
        config_service_1.ConfigService])
], SettingUpdateCardComponent);
exports.SettingUpdateCardComponent = SettingUpdateCardComponent;
;
//# sourceMappingURL=setting-updateCard.component.js.map