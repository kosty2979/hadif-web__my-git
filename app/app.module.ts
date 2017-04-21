import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { FormsModule }        from '@angular/forms';
import { HttpModule, Http }   from '@angular/http';
import { RatingModule }       from "ngx-rating";
import { ToasterModule }      from 'angular2-toaster';
import { ContextMenuModule }  from "angular2-contextmenu";
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, "app/i18n/", ".json");
}

import { AppComponent }         from './app.component';
import { VideoItemsService }    from './services/video-items.service';
import { ConfigService }        from './services/config.service';
import { AuthService }          from './services/auth.service';
import { PaymentService }       from './services/payment.service';
import { ChenalService }        from './services/chenal.service';
import { EpgService }           from './services/epg.service';
import { TransmiteService }     from './services/transmite.service';
import { UserDataService }     from './services/user-data.service';

import { LiveComponent }        from './components/live.component/live.component';
import { VodComponent }         from './components/vod.component/vod.component';
import { FollowComponent }      from './components/follow.component/follow.component';
import { SettingComponent }     from './components/setting.component/setting.component';
import { LoginComponent }       from './components/login.component/login.component';
import { LogoutComponent }      from './components/logout.component/logout.component';
import { RegisterComponent }    from './components/register.component/register.component';
import { LostPassComponent }    from './components/lost-pass.component/lost-pass.component';
import { VoucherComponent }     from './components/voucher.component/voucher.component';
import { VodEpisodeComponent }  from './components/vod-episode.component/vod-episode.component';
import { PriceComponent }       from './components/price.component/price.component';
import { VideoPlayer }          from './components/player.component/player.component';
import {ComfirmPaymentComponent} from './components/comfirm-payment.component/comfirm-payment.component';
import { PaymentComponent }     from './components/payment.component/payment.component';
import { SettingProfileComponent }     from './components/setting-profile.component/setting-profile.component';
import { SettingHistoryComponent }     from './components/setting-history.component/setting-history.component';
import { SettingRemindComponent }      from './components/setting-remind.component/setting-remind.component';
import { SettingNotificComponent }     from './components/setting-notific.component/setting-notific.component';
import { SettingConfigComponent }      from './components/setting-config.component/setting-config.component';
import { SettingAboutComponent }       from './components/setting-about.component/setting-about.component';
import { EpgComponent }                from './components/epg.component/epg.component';
import { ChannelEpgComponent }         from './components/channel-epg.component/channel-epg.component';
import { SettingUpdateCardComponent }         from './components/setting-updateCard.component/setting-updateCard.component';
import { SettingComfirmCardComponent }         from './components/setting-confirmCard.component/setting-confirmCard.component';
import { FocusDirective }               from './directives/focus-directive';



@NgModule({
  imports: [
    RatingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ToasterModule,
    ContextMenuModule,
    TranslateModule.forRoot({loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [Http]
          }}),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  declarations: [
    AppComponent,
    LiveComponent,
    VodComponent,
    FollowComponent,
    SettingComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    LostPassComponent,
    VoucherComponent,
    VodEpisodeComponent,
    PriceComponent,
    VideoPlayer,
    ComfirmPaymentComponent,
    PaymentComponent,
    SettingProfileComponent,
    SettingHistoryComponent,
    SettingRemindComponent,
    SettingNotificComponent,
    SettingConfigComponent,
    SettingAboutComponent,
    EpgComponent,
    ChannelEpgComponent,
    SettingUpdateCardComponent,
    SettingComfirmCardComponent,
    FocusDirective
  ],
  providers: [ 
  VideoItemsService,
  AuthService,
  ChenalService,
  ConfigService,
  PaymentService,
  EpgService,
  TransmiteService,
  UserDataService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
