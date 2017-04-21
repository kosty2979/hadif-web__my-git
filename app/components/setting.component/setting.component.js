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
var router_2 = require("@angular/router");
var auth_service_1 = require("../../services/auth.service");
var user_data_service_1 = require("../../services/user-data.service");
var user_1 = require("../../classes/user");
var avatar_pics_1 = require("../../classes/avatar-pics");
var SettingComponent = (function () {
    function SettingComponent(route, authService, userDataService, router) {
        this.route = route;
        this.authService = authService;
        this.userDataService = userDataService;
        this.router = router;
        this.user = new user_1.User();
        this.avatar = new avatar_pics_1.AvatarPics();
    }
    ;
    SettingComponent.prototype.ngOnInit = function () {
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['/register']);
        }
        ;
        this.getUserInfo();
    };
    ;
    SettingComponent.prototype.getUserInfo = function () {
        var _this = this;
        this.subscription = this.userDataService.getUserData().subscribe(function (answer) {
            _this.user = answer;
        });
    };
    ;
    SettingComponent.prototype.getImageUrl = function () {
        return this.userDataService.getUserImageUrl(this.user);
    };
    ;
    SettingComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    ;
    return SettingComponent;
}());
SettingComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'setting.component.html'
    }),
    __metadata("design:paramtypes", [router_2.ActivatedRoute,
        auth_service_1.AuthService,
        user_data_service_1.UserDataService,
        router_1.Router])
], SettingComponent);
exports.SettingComponent = SettingComponent;
;
//# sourceMappingURL=setting.component.js.map