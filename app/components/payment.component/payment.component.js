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
var config_service_1 = require("../../services/config.service");
var PaymentComponent = (function () {
    function PaymentComponent(authService, router, config) {
        this.authService = authService;
        this.router = router;
        this.config = config;
    }
    ;
    PaymentComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/register']);
            return;
        }
        ;
        if (!sessionStorage.getItem('hpayDetails')) {
            this.router.navigate(['/price']);
            return;
        }
        ;
        this.price = sessionStorage.getItem("price");
        this.freeDays = sessionStorage.getItem("freeDays");
        var site = new URL(window.location.href);
        this.url = site.origin + '/comfirm-payment';
        this.config.getConfig()
            .then(function (config) {
            if (!_this.authService.isAuthorized()) {
                _this.router.navigate(['/register']);
            }
            ;
            _this.hpay = JSON.parse(sessionStorage.getItem('hpayDetails'));
            setTimeout(function () {
                _this.loadScript(config.hpay + '/v1/paymentWidgets.js?checkoutId=' + _this.hpay.checkoutId);
            }, 0);
        });
    };
    ;
    PaymentComponent.prototype.loadScript = function (url) {
        console.log('preparing to load...');
        if (!this.isEnglish()) {
            var node2 = document.createElement('script');
            node2.type = 'text/javascript';
            node2.charset = 'utf-8';
            node2.text = 'var wpwlOptions = { locale:"ar", paymentTarget:"_top"}; console.log("set AR locale")';
            document.getElementsByTagName('head')[0].appendChild(node2);
        }
        ;
        var node = document.createElement('script');
        node.src = url;
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
    };
    ;
    PaymentComponent.prototype.isEnglish = function () {
        var lang = localStorage.getItem('lang');
        return (lang == 'en');
    };
    ;
    return PaymentComponent;
}());
PaymentComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'payment.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        router_1.Router,
        config_service_1.ConfigService])
], PaymentComponent);
exports.PaymentComponent = PaymentComponent;
;
//# sourceMappingURL=payment.component.js.map