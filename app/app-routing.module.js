"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var live_component_1 = require("./components/live.component/live.component");
var vod_component_1 = require("./components/vod.component/vod.component");
var follow_component_1 = require("./components/follow.component/follow.component");
var setting_component_1 = require("./components/setting.component/setting.component");
var login_component_1 = require("./components/login.component/login.component");
var logout_component_1 = require("./components/logout.component/logout.component");
var register_component_1 = require("./components/register.component/register.component");
var lost_pass_component_1 = require("./components/lost-pass.component/lost-pass.component");
var voucher_component_1 = require("./components/voucher.component/voucher.component");
var vod_episode_component_1 = require("./components/vod-episode.component/vod-episode.component");
var price_component_1 = require("./components/price.component/price.component");
var payment_component_1 = require("./components/payment.component/payment.component");
var comfirm_payment_component_1 = require("./components/comfirm-payment.component/comfirm-payment.component");
var setting_profile_component_1 = require("./components/setting-profile.component/setting-profile.component");
var setting_history_component_1 = require("./components/setting-history.component/setting-history.component");
var setting_remind_component_1 = require("./components/setting-remind.component/setting-remind.component");
var setting_notific_component_1 = require("./components/setting-notific.component/setting-notific.component");
var setting_config_component_1 = require("./components/setting-config.component/setting-config.component");
var setting_about_component_1 = require("./components/setting-about.component/setting-about.component");
var epg_component_1 = require("./components/epg.component/epg.component");
var setting_updateCard_component_1 = require("./components/setting-updateCard.component/setting-updateCard.component");
var setting_confirmCard_component_1 = require("./components/setting-confirmCard.component/setting-confirmCard.component");
var settingRoutes = [
    { path: 'profile', component: setting_profile_component_1.SettingProfileComponent },
    { path: 'history', component: setting_history_component_1.SettingHistoryComponent },
    { path: 'remind', component: setting_remind_component_1.SettingRemindComponent },
    { path: 'notific', component: setting_notific_component_1.SettingNotificComponent },
    { path: 'config', component: setting_config_component_1.SettingConfigComponent },
    { path: 'about', component: setting_about_component_1.SettingAboutComponent },
    { path: 'updateCard', component: setting_updateCard_component_1.SettingUpdateCardComponent },
    { path: 'confirmCard', component: setting_confirmCard_component_1.SettingComfirmCardComponent }
];
var routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'setting', redirectTo: 'setting/profile', pathMatch: 'full' },
    { path: 'live', component: live_component_1.LiveComponent },
    { path: 'live/:id', component: live_component_1.LiveComponent },
    { path: 'vod', component: vod_component_1.VodComponent },
    { path: 'follow', component: follow_component_1.FollowComponent },
    { path: 'setting', component: setting_component_1.SettingComponent, children: settingRoutes },
    { path: 'login', component: login_component_1.LoginComponent, },
    { path: 'logout', component: logout_component_1.LogoutComponent, },
    { path: 'register', component: register_component_1.RegisterComponent },
    { path: 'lostpass', component: lost_pass_component_1.LostPassComponent },
    { path: 'voucher', component: voucher_component_1.VoucherComponent },
    { path: 'vod-episodes/:id', component: vod_episode_component_1.VodEpisodeComponent },
    { path: 'vod-episodes/:id/:ses/:item', component: vod_episode_component_1.VodEpisodeComponent },
    { path: 'price', component: price_component_1.PriceComponent },
    { path: 'comfirm-payment', component: comfirm_payment_component_1.ComfirmPaymentComponent },
    { path: 'payment', component: payment_component_1.PaymentComponent },
    { path: 'epg', component: epg_component_1.EpgComponent }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map