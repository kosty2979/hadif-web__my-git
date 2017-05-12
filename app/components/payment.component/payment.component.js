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
        this.lang = true;
        this.start = false;
    }
    ;
    PaymentComponent.prototype.ngOnInit = function () {
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
        this.isEnglish();
        this.price = sessionStorage.getItem("price");
        this.freeDays = sessionStorage.getItem("freeDays");
        var site = new URL(window.location.href);
        this.url = site.origin + '/comfirm-payment';
        this.preLoad();
    };
    ;
    PaymentComponent.prototype.ngDoCheck = function () {
        if ((this.lang != this.isEnglish())) {
            this.start = false;
            this.preLoad();
        }
    };
    ;
    PaymentComponent.prototype.preLoad = function () {
        var _this = this;
        this.config.getConfig()
            .then(function (config) {
            if (!_this.authService.isAuthorized()) {
                _this.router.navigate(['/register']);
            }
            ;
            _this.hpay = JSON.parse(sessionStorage.getItem('hpayDetails'));
            _this.start = true;
            setTimeout(function () {
                _this.loadScript(config.hpay + '/v1/paymentWidgets.js?checkoutId=' + _this.hpay.checkoutId);
            }, 0);
        });
    };
    ;
    PaymentComponent.prototype.loadScript = function (url) {
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
    PaymentComponent.prototype.isEnglish = function () {
        var lang = localStorage.getItem('lang');
        this.lang = lang == 'en';
        return (lang == 'en');
    };
    ;
    return PaymentComponent;
}());
__decorate([
    core_1.ViewChild('wrapForPayment'),
    __metadata("design:type", core_1.ElementRef)
], PaymentComponent.prototype, "forScript", void 0);
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