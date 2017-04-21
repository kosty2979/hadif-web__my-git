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
var user_1 = require("../../classes/user");
var LostPassComponent = (function () {
    function LostPassComponent(userDataService, router) {
        this.userDataService = userDataService;
        this.router = router;
        this.user = new user_1.User();
        this.error = false;
        this.complite = false;
        this.errortext = '';
    }
    ;
    LostPassComponent.prototype.onSubmit = function () {
        var _this = this;
        this.userDataService.resetPass(this.user.username)
            .then(function () {
            _this.error = false;
            _this.complite = true;
            setTimeout(function () {
                _this.router.navigate(['/login']);
            }, 3000);
        })
            .catch(function (string) {
            _this.errortext = string;
            _this.error = true;
        });
    };
    ;
    return LostPassComponent;
}());
LostPassComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'lost-pass.component.html'
    }),
    __metadata("design:paramtypes", [user_data_service_1.UserDataService,
        router_1.Router])
], LostPassComponent);
exports.LostPassComponent = LostPassComponent;
//# sourceMappingURL=lost-pass.component.js.map