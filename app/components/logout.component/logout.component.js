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
var user_1 = require("../../classes/user");
var LogoutComponent = (function () {
    function LogoutComponent(authService, userDataService, router) {
        this.authService = authService;
        this.userDataService = userDataService;
        this.router = router;
        this.user = new user_1.User();
    }
    ;
    LogoutComponent.prototype.ngOnInit = function () {
        this.getUserInfo();
    };
    ;
    LogoutComponent.prototype.exit = function () {
        var _this = this;
        if (this.authService.isAuthorized()) {
            return this.authService.logout().then(function () {
                _this.router.navigate(['/login']);
            });
        }
        ;
        this.router.navigate(['/login']);
    };
    ;
    LogoutComponent.prototype.getImageUrl = function () {
        return this.userDataService.getUserImageUrl(this.user);
    };
    ;
    LogoutComponent.prototype.getUserInfo = function () {
        var _this = this;
        this.subscriptUser = this.userDataService.getUserData().subscribe(function (answer) {
            _this.user = answer;
        });
    };
    ;
    return LogoutComponent;
}());
LogoutComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'logout.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_data_service_1.UserDataService,
        router_1.Router])
], LogoutComponent);
exports.LogoutComponent = LogoutComponent;
;
//# sourceMappingURL=logout.component.js.map