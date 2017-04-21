"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var ngx_rating_1 = require("ngx-rating");
var angular2_toaster_1 = require("angular2-toaster");
var angular2_contextmenu_1 = require("angular2-contextmenu");
var angular_confirmation_popover_1 = require("angular-confirmation-popover");
var app_routing_module_1 = require("./app-routing.module");
var core_2 = require("@ngx-translate/core");
var http_loader_1 = require("@ngx-translate/http-loader");
function HttpLoaderFactory(http) {
    return new http_loader_1.TranslateHttpLoader(http, "app/i18n/", ".json");
}
exports.HttpLoaderFactory = HttpLoaderFactory;
var app_component_1 = require("./app.component");
var video_items_service_1 = require("./services/video-items.service");
var config_service_1 = require("./services/config.service");
var auth_service_1 = require("./services/auth.service");
var payment_service_1 = require("./services/payment.service");
var chenal_service_1 = require("./services/chenal.service");
var epg_service_1 = require("./services/epg.service");
var transmite_service_1 = require("./services/transmite.service");
var user_data_service_1 = require("./services/user-data.service");
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
var player_component_1 = require("./components/player.component/player.component");
var comfirm_payment_component_1 = require("./components/comfirm-payment.component/comfirm-payment.component");
var payment_component_1 = require("./components/payment.component/payment.component");
var setting_profile_component_1 = require("./components/setting-profile.component/setting-profile.component");
var setting_history_component_1 = require("./components/setting-history.component/setting-history.component");
var setting_remind_component_1 = require("./components/setting-remind.component/setting-remind.component");
var setting_notific_component_1 = require("./components/setting-notific.component/setting-notific.component");
var setting_config_component_1 = require("./components/setting-config.component/setting-config.component");
var setting_about_component_1 = require("./components/setting-about.component/setting-about.component");
var epg_component_1 = require("./components/epg.component/epg.component");
var channel_epg_component_1 = require("./components/channel-epg.component/channel-epg.component");
var setting_updateCard_component_1 = require("./components/setting-updateCard.component/setting-updateCard.component");
var setting_confirmCard_component_1 = require("./components/setting-confirmCard.component/setting-confirmCard.component");
var focus_directive_1 = require("./directives/focus-directive");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            ngx_rating_1.RatingModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            app_routing_module_1.AppRoutingModule,
            angular2_toaster_1.ToasterModule,
            angular2_contextmenu_1.ContextMenuModule,
            core_2.TranslateModule.forRoot({ loader: {
                    provide: core_2.TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [http_1.Http]
                } }),
            angular_confirmation_popover_1.ConfirmationPopoverModule.forRoot({
                confirmButtonType: 'danger' // set defaults here
            })
        ],
        declarations: [
            app_component_1.AppComponent,
            live_component_1.LiveComponent,
            vod_component_1.VodComponent,
            follow_component_1.FollowComponent,
            setting_component_1.SettingComponent,
            login_component_1.LoginComponent,
            logout_component_1.LogoutComponent,
            register_component_1.RegisterComponent,
            lost_pass_component_1.LostPassComponent,
            voucher_component_1.VoucherComponent,
            vod_episode_component_1.VodEpisodeComponent,
            price_component_1.PriceComponent,
            player_component_1.VideoPlayer,
            comfirm_payment_component_1.ComfirmPaymentComponent,
            payment_component_1.PaymentComponent,
            setting_profile_component_1.SettingProfileComponent,
            setting_history_component_1.SettingHistoryComponent,
            setting_remind_component_1.SettingRemindComponent,
            setting_notific_component_1.SettingNotificComponent,
            setting_config_component_1.SettingConfigComponent,
            setting_about_component_1.SettingAboutComponent,
            epg_component_1.EpgComponent,
            channel_epg_component_1.ChannelEpgComponent,
            setting_updateCard_component_1.SettingUpdateCardComponent,
            setting_confirmCard_component_1.SettingComfirmCardComponent,
            focus_directive_1.FocusDirective
        ],
        providers: [
            video_items_service_1.VideoItemsService,
            auth_service_1.AuthService,
            chenal_service_1.ChenalService,
            config_service_1.ConfigService,
            payment_service_1.PaymentService,
            epg_service_1.EpgService,
            transmite_service_1.TransmiteService,
            user_data_service_1.UserDataService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map