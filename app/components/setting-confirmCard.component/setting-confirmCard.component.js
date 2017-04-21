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
var user_data_service_1 = require("../../services/user-data.service");
var auth_service_1 = require("../../services/auth.service");
var SettingComfirmCardComponent = (function () {
    function SettingComfirmCardComponent(userDataService, authService, router) {
        this.userDataService = userDataService;
        this.authService = authService;
        this.router = router;
        this.success = false;
        this.error = false;
    }
    ;
    SettingComfirmCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        var cId = sessionStorage.getItem('updateCardCid');
        this.userDataService.hpayUpdateCardPayment(cId)
            .then(function () {
            sessionStorage.removeItem('updateCardCid');
            _this.success = true;
            _this.authService.refreshSubscriptions();
            setTimeout(function () {
                _this.router.navigate(['/setting/profile']);
            }, 3000);
        })
            .catch(function () {
            sessionStorage.removeItem('updateCardCid');
            _this.error = true;
            setTimeout(function () {
                _this.router.navigate(['/setting/profile']);
            }, 3000);
        });
    };
    ;
    return SettingComfirmCardComponent;
}());
SettingComfirmCardComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'setting-confirmCard.component.html'
    }),
    __metadata("design:paramtypes", [user_data_service_1.UserDataService,
        auth_service_1.AuthService,
        router_1.Router])
], SettingComfirmCardComponent);
exports.SettingComfirmCardComponent = SettingComfirmCardComponent;
;
//# sourceMappingURL=setting-confirmCard.component.js.map