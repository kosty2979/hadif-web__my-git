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
var payment_service_1 = require("../../services/payment.service");
var price_1 = require("../../classes/price");
var terms_1 = require("../../classes/terms");
var period = {
    "recurring1Month": "r1m",
    "recurring3Months": "r3m",
    "recurring6Months": "r6m",
    "recurring1Year": "r1y",
    "recurring2Years": "r2y",
    "oneoffpayment1Month": "o1m",
    "oneoffpayment3Months": "o3m",
    "oneoffpayment6Months": "o6m",
    "oneoffpayment1Year": "o1y",
    "oneoffpayment2Years": "o2y",
    "recurringprice1Month": "r1m",
    "recurringprice3Months": "r3m",
    "recurringprice6Months": "r6m",
    "recurringprice1Year": "r1y",
    "recurringprice2Years": "r2y",
    "oneoffprice1Month": "o1m",
    "oneoffprice3Months": "o3m",
    "oneoffprice6Months": "o6m",
    "oneoffprice1Year": "o1y",
    "oneoffprice2Years": "o2y",
};
var PriceComponent = (function () {
    function PriceComponent(authService, router, paymentService) {
        this.authService = authService;
        this.router = router;
        this.paymentService = paymentService;
        this.terms = new terms_1.Terms();
        this.lang = true;
        this.error = false;
        this.errortext = '';
        this.firstStep = false;
        this.tarifForFree = ["r1m", "r3m", "r6m", "r1y", "r2y"];
    }
    ;
    PriceComponent.prototype.ngOnInit = function () {
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/register']);
        }
        ;
        this.getPrice();
    };
    ;
    PriceComponent.prototype.showItem = function (price) {
        return parseInt(price.value) != 99999;
    };
    PriceComponent.prototype.onSubmit = function () {
        var _this = this;
        var type = payment_service_1.Types.OneOffPayment;
        if (period[this.selectedPrice][0] == 'r')
            type = payment_service_1.Types.Recurring;
        var price = "";
        this.prices.forEach(function (el) {
            if (el.name == _this.selectedPrice) {
                price = el.value;
            }
        });
        var vaucher = localStorage.getItem('voucherCode');
        this.paymentService.getHpayDetails(type, period[this.selectedPrice], vaucher)
            .then(function (d) {
            sessionStorage.setItem('hpayDetails', JSON.stringify(d.hpayDetails));
            sessionStorage.setItem('price', price);
            if (parseInt(price) != 0) {
                _this.router.navigate(['/payment']);
            }
            else {
                _this.router.navigate(['/comfirm-payment']);
            }
        })
            .catch(function (error) {
        });
    };
    ;
    PriceComponent.prototype.getPrice = function () {
        var _this = this;
        if (localStorage.getItem('voucherPrice')) {
            this.setPrice(JSON.parse(localStorage.getItem('voucherPrice')));
            this.voucherCode = localStorage.getItem('voucherCode');
        }
        else {
            this.authService.getPrice()
                .then(function (answer) {
                _this.freePeriod = answer.freePeriod;
                delete answer.freePeriod;
                var tmp = {};
                for (var key in answer) {
                    var obj = answer[key];
                    for (var str in obj) {
                        var name = key.toLowerCase() + str;
                        tmp[name] = obj[str];
                    }
                }
                ;
                _this.setPrice(tmp);
            })
                .catch(function (error) {
                _this.errortext = error;
                _this.error = true;
            });
        }
        ;
    };
    ;
    PriceComponent.prototype.setPrice = function (obj) {
        var array = [];
        for (var key in obj) {
            var tmp = new price_1.Price;
            tmp["name"] = key;
            tmp["value"] = obj[key];
            array.push(tmp);
        }
        this.prices = array;
    };
    ;
    PriceComponent.prototype.getActiveDay = function (price) {
        var text;
        if (localStorage.getItem('voucherPrice'))
            return text;
        if (this.tarifForFree.indexOf(period[price.name]) != -1 && this.freePeriod.active == "1") {
            var days = this.freePeriod.days;
            text = '(including ' + days + ' days free trial)';
        }
        return text;
    };
    ;
    PriceComponent.prototype.getTermsText = function () {
        var text = this.isEnglish() ? this.terms.en : this.terms.ar;
        return text;
    };
    PriceComponent.prototype.isEnglish = function () {
        var lang = localStorage.getItem('lang');
        this.lang = lang == 'en';
        return (lang == 'en');
    };
    ;
    return PriceComponent;
}());
PriceComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'price.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        router_1.Router,
        payment_service_1.PaymentService])
], PriceComponent);
exports.PriceComponent = PriceComponent;
;
//# sourceMappingURL=price.component.js.map