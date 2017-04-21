import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveComponent }        from './components/live.component/live.component';
import { VodComponent }         from './components/vod.component/vod.component';
import { FollowComponent }      from './components/follow.component/follow.component';
import { SettingComponent }     from './components/setting.component/setting.component';
import { LoginComponent }     	from './components/login.component/login.component';
import { LogoutComponent }     	from './components/logout.component/logout.component';
import { RegisterComponent }    from './components/register.component/register.component';
import { LostPassComponent }    from './components/lost-pass.component/lost-pass.component';
import { VoucherComponent }     from './components/voucher.component/voucher.component';
import { VodEpisodeComponent }  from './components/vod-episode.component/vod-episode.component';
import { PriceComponent }       from './components/price.component/price.component';
import { PaymentComponent }     from './components/payment.component/payment.component';
import {ComfirmPaymentComponent} from './components/comfirm-payment.component/comfirm-payment.component';
import { SettingProfileComponent }     from './components/setting-profile.component/setting-profile.component';
import { SettingHistoryComponent }     from './components/setting-history.component/setting-history.component';
import { SettingRemindComponent }      from './components/setting-remind.component/setting-remind.component';
import { SettingNotificComponent }     from './components/setting-notific.component/setting-notific.component';
import { SettingConfigComponent }      from './components/setting-config.component/setting-config.component';
import { SettingAboutComponent }       from './components/setting-about.component/setting-about.component';
import { EpgComponent }                from './components/epg.component/epg.component';
import { SettingUpdateCardComponent }  from './components/setting-updateCard.component/setting-updateCard.component';
import { SettingComfirmCardComponent } from './components/setting-confirmCard.component/setting-confirmCard.component';




const settingRoutes: Routes = [
    { path: 'profile', component: SettingProfileComponent },
    { path: 'history', component: SettingHistoryComponent },
    { path: 'remind',  component: SettingRemindComponent },
    { path: 'notific', component: SettingNotificComponent },
    { path: 'config',  component: SettingConfigComponent },
    { path: 'about',   component: SettingAboutComponent },
    { path: 'updateCard',   component: SettingUpdateCardComponent },
    { path: 'confirmCard',   component: SettingComfirmCardComponent }
];

const routes: Routes = [
   { path: '', redirectTo: '/login', pathMatch: 'full' },
   { path: 'setting', redirectTo: 'setting/profile', pathMatch: 'full'},

   { path: 'live',                       component: LiveComponent },
   { path: 'live/:id',                   component: LiveComponent },
   { path: 'vod',                        component: VodComponent },
   { path: 'follow',                     component: FollowComponent },
   { path: 'setting',                    component: SettingComponent, children: settingRoutes },
   { path: 'login',  	                   component: LoginComponent, },
   { path: 'logout',                     component: LogoutComponent, },
   { path: 'register',                   component: RegisterComponent },
   { path: 'lostpass',                   component: LostPassComponent },
   { path: 'voucher',                    component: VoucherComponent },
   { path: 'vod-episodes/:id',           component: VodEpisodeComponent},
   { path: 'vod-episodes/:id/:ses/:item', component: VodEpisodeComponent},
   { path: 'price',                     component: PriceComponent },
   { path: 'comfirm-payment',                     component: ComfirmPaymentComponent },
   { path: 'payment',                   component: PaymentComponent },
   { path: 'epg',                       component: EpgComponent }


];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
