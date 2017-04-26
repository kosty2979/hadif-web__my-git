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
var about_1 = require("../../classes/about");
var SettingAboutComponent = (function () {
    function SettingAboutComponent() {
        this.lang = true;
        this.about = new about_1.About();
    }
    ;
    SettingAboutComponent.prototype.getAboutText = function () {
        var text = this.isEnglish() ? this.about.en : this.about.ar;
        return text;
    };
    SettingAboutComponent.prototype.isEnglish = function () {
        var lang = localStorage.getItem('lang');
        this.lang = lang == 'en';
        return (lang == 'en');
    };
    ;
    return SettingAboutComponent;
}());
SettingAboutComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'content',
        templateUrl: 'setting-about.component.html'
    }),
    __metadata("design:paramtypes", [])
], SettingAboutComponent);
exports.SettingAboutComponent = SettingAboutComponent;
//# sourceMappingURL=setting-about.component.js.map