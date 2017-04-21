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
var VoucherComponent = (function () {
    function VoucherComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.error = false;
        this.errorVoucher = false;
        this.complite = false;
        this.errortext = '';
        this.errortextVoucher = '';
    }
    ;
    VoucherComponent.prototype.ngOnInit = function () {
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/register']);
        }
        ;
    };
    ;
    VoucherComponent.prototype.onSubmit = function () {
        var _this = this;
        this.authService.getVoucher(this.vouchNumber, true)
            .then(function () {
            _this.error = false;
            _this.complite = true;
            _this.errorVoucher = false;
            setTimeout(function () {
                _this.router.navigate(['/price']);
            }, 2500);
        })
            .catch(function (error) {
            _this.errortextVoucher = error;
            _this.errorVoucher = true;
        });
    };
    return VoucherComponent;
}());
VoucherComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'voucher.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        router_1.Router])
], VoucherComponent);
exports.VoucherComponent = VoucherComponent;
//# sourceMappingURL=voucher.component.js.map