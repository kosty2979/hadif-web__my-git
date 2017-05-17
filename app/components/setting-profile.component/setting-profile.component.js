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
var passwordObj_1 = require("../../classes/passwordObj");
var user_1 = require("../../classes/user");
var avatar_pics_1 = require("../../classes/avatar-pics");
var subscriptionInfo_1 = require("../../classes/subscriptionInfo");
var SettingProfileComponent = (function () {
    function SettingProfileComponent(authService, userDataService, router) {
        this.authService = authService;
        this.userDataService = userDataService;
        this.router = router;
        this.edit = false;
        this.password = false;
        this.billing = false;
        this.card = false;
        this.imageEdit = false;
        this.subscript = false;
        this.passwordObj = new passwordObj_1.PasswordObj();
        this.user = new user_1.User();
        this.avatar = new avatar_pics_1.AvatarPics();
        this.subscriptionInfo = new subscriptionInfo_1.SubscriptionInfo();
        this.confirmClicked = false;
        this.cancelClicked = false;
    }
    ;
    SettingProfileComponent.prototype.ngOnInit = function () {
        this.getUserInfo();
        this.getUserSubscription();
        this.getUserTransaction();
    };
    ;
    SettingProfileComponent.prototype.getStatus = function () {
        return !(this.edit || this.password || this.billing || this.card || this.subscript);
    };
    ;
    SettingProfileComponent.prototype.changePass = function (form) {
        var _this = this;
        this.userDataService.changePassword(this.passwordObj).then(function () {
            _this.passwordObj.complite = true;
            _this.passwordObj.errortext = '';
            _this.passwordObj.error = false;
            setTimeout(function () {
                _this.password = false;
                _this.passwordObj = new passwordObj_1.PasswordObj();
            }, 2000);
        })
            .catch(function (error) {
            // this.passwordObj = new PasswordObj();	
            _this.passwordObj.complite = false;
            _this.passwordObj.errortext = error;
            _this.passwordObj.error = true;
            form.reset();
        });
    };
    ;
    SettingProfileComponent.prototype.getUserInfo = function () {
        var _this = this;
        this.subscriptUser = this.userDataService.getUserData().subscribe(function (answer) {
            _this.user = answer;
        });
    };
    ;
    SettingProfileComponent.prototype.getUserSubscription = function () {
        var _this = this;
        this.userDataService.hpayGetSubscriptions()
            .then(function (answer) {
            _this.subscriptionInfo = answer;
        });
    };
    ;
    SettingProfileComponent.prototype.getUserTransaction = function () {
        var _this = this;
        this.userDataService.hpayGetPastTransactions()
            .then(function (answer) {
            _this.transactionInfo = answer;
        });
    };
    ;
    SettingProfileComponent.prototype.getType = function (type) {
        switch (type) {
            case '2':
                return 'Recurring';
            case '3':
                return 'One off	payment';
            default:
                return '';
        }
    };
    ;
    SettingProfileComponent.prototype.getImageUrl = function () {
        return this.userDataService.getUserImageUrl(this.user);
    };
    ;
    SettingProfileComponent.prototype.onSubmitUserInfo = function () {
        var _this = this;
        this.userDataService.editUserDetails(this.user).then(function () {
            _this.edit = !_this.edit;
        });
    };
    ;
    SettingProfileComponent.prototype.updateCard = function () {
        this.router.navigate(['/setting/updateCard']);
    };
    ;
    SettingProfileComponent.prototype.autoRenewUpdate = function (autoRenew) {
        var _this = this;
        var code = autoRenew.srcElement.checked ? 1 : 0;
        this.userDataService.hpayUpdateAutoRenew(code).then(function () {
            _this.subscriptionInfo.autoRenew = code;
        })
            .catch(function () {
            autoRenew.srcElement.checked = _this.subscriptionInfo.autoRenew == 1 ? true : false;
            //this.subscript = !this.subscript
        });
    };
    ;
    SettingProfileComponent.prototype.getFreePeriod = function () {
        var answer;
        if (this.subscriptionInfo.freePeriodEndDate) {
            answer = new Date(this.subscriptionInfo.freePeriodEndDate) > new Date();
        }
        ;
        return answer;
    };
    ;
    SettingProfileComponent.prototype.discardFreePeriod = function () {
        var _this = this;
        this.userDataService.hpayCancelRecurringPayment().then(function () {
            _this.subscript = false;
            _this.authService.refreshSubscriptions();
            _this.userDataService.hpayGetSubscriptions(true)
                .then(function (answer) {
                _this.subscriptionInfo = answer;
            });
        });
    };
    ;
    SettingProfileComponent.prototype.ngOnDestroy = function () {
        this.subscriptUser.unsubscribe();
    };
    ;
    return SettingProfileComponent;
}());
SettingProfileComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'setting-profile.component.html',
        styleUrls: ["setting-profile.component.css"]
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_data_service_1.UserDataService,
        router_1.Router])
], SettingProfileComponent);
exports.SettingProfileComponent = SettingProfileComponent;
;
//# sourceMappingURL=setting-profile.component.js.map