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
var payment_service_1 = require("../../services/payment.service");
var transmite_service_1 = require("../../services/transmite.service");
var auth_service_1 = require("../../services/auth.service");
var ComfirmPaymentComponent = (function () {
    function ComfirmPaymentComponent(paymentService, authService, transmiteService, router) {
        this.paymentService = paymentService;
        this.authService = authService;
        this.transmiteService = transmiteService;
        this.router = router;
        this.success = false;
        this.error = false;
    }
    ;
    ComfirmPaymentComponent.prototype.ngOnInit = function () {
        var _this = this;
        var hpay = JSON.parse(sessionStorage.getItem('hpayDetails'));
        var price = sessionStorage.getItem('price');
        if (parseInt(price) != 0) {
            this.paymentService.hpayMakePayment(hpay.checkoutId)
                .then(function () {
                _this.endPayment();
            })
                .catch(function () {
                _this.error = true;
            });
        }
        else {
            this.endPayment();
        }
    };
    ;
    ComfirmPaymentComponent.prototype.endPayment = function () {
        var _this = this;
        sessionStorage.removeItem('hpayDetails');
        sessionStorage.removeItem('price');
        sessionStorage.removeItem('freeDays');
        this.success = true;
        localStorage.removeItem('voucherCode');
        localStorage.removeItem('voucherPrice');
        this.authService.refreshSubscriptions();
        setTimeout(function () {
            var url = _this.transmiteService.getUrl();
            if (url) {
                _this.router.navigate([url]);
            }
            else {
                _this.router.navigate(['/live']);
            }
        }, 3000);
    };
    ;
    return ComfirmPaymentComponent;
}());
ComfirmPaymentComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'comfirm-payment.component.html'
    }),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        auth_service_1.AuthService,
        transmite_service_1.TransmiteService,
        router_1.Router])
], ComfirmPaymentComponent);
exports.ComfirmPaymentComponent = ComfirmPaymentComponent;
;
//# sourceMappingURL=comfirm-payment.component.js.map