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
var core_2 = require("@ngx-translate/core");
var SettingConfigComponent = (function () {
    function SettingConfigComponent(translate) {
        this.translate = translate;
        this.support = false;
        this.language = localStorage.getItem('lang') == 'en' ? "English" : "Arabic";
    }
    ;
    SettingConfigComponent.prototype.langChange = function (lang) {
        this.translate.use(lang);
        this.language = lang == 'en' ? "English" : "Arabic";
        localStorage.setItem('lang', lang);
        if (lang == 'en') {
            window['$']('#dinamic-css')[0].href = '/css/english-main.css';
        }
        else {
            window['$']('#dinamic-css')[0].href = '/css/main.css';
        }
    };
    ;
    return SettingConfigComponent;
}());
SettingConfigComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'setting-config.component.html'
    }),
    __metadata("design:paramtypes", [core_2.TranslateService])
], SettingConfigComponent);
exports.SettingConfigComponent = SettingConfigComponent;
//# sourceMappingURL=setting-config.component.js.map