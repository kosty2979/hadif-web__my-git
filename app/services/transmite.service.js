"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var TransmiteService = (function () {
    function TransmiteService() {
        this.context = {};
        this.url = "";
    }
    TransmiteService.prototype.setContext = function (obj) {
        this.context = obj;
    };
    ;
    TransmiteService.prototype.getContext = function () {
        return this.context;
    };
    ;
    TransmiteService.prototype.setUrl = function (url) {
        this.url = url;
    };
    ;
    TransmiteService.prototype.getUrl = function () {
        var url = this.url;
        this.url = '';
        return url;
    };
    ;
    return TransmiteService;
}());
TransmiteService = __decorate([
    core_1.Injectable()
], TransmiteService);
exports.TransmiteService = TransmiteService;
;
//# sourceMappingURL=transmite.service.js.map