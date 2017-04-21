"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var angular2_contextmenu_1 = require("angular2-contextmenu");
var moment = require("moment");
require("moment-timezone");
var epg_service_1 = require("../../services/epg.service");
var ChannelEpgComponent = (function (_super) {
    __extends(ChannelEpgComponent, _super);
    function ChannelEpgComponent(epgService, contextMenuService) {
        var _this = _super.call(this) || this;
        _this.epgService = epgService;
        _this.contextMenuService = contextMenuService;
        _this.contextVideo = new core_1.EventEmitter();
        _this.items = new vis.DataSet();
        _this.options = {};
        _this.timeline = null;
        _this.load = false;
        _this.lang = true;
        _this.contextItemId = {};
        _this.recordedItems = [];
        _this.contextObj = {};
        return _this;
    }
    ;
    ChannelEpgComponent.prototype.ngDoCheck = function () {
        if ((this.lang != this.isEnglish()) && this.load) {
            this.timeline.destroy();
            this.setData(this.data); //we need to reload the data in vis.js when a language is changed
            this.setOptions();
            this.renderTimline();
        }
    };
    ;
    ChannelEpgComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        setTimeout(function () {
            if (_this.timeline)
                _this.timeline.destroy();
            _this.setOptions();
            _this.getTimeline(changes['id'].currentValue.toString());
        }, 100);
    };
    ;
    ChannelEpgComponent.prototype.setData = function (Items) {
        var items = new vis.DataSet();
        var contextItemId = {};
        var recordedItems = [];
        var counter = 0;
        var currentTimeZone = moment.tz.guess();
        var timeZone = Items.epgTZ;
        // Add events to channels
        recordedItems = Items.recordedItems;
        Items.events.forEach(function (event, j) {
            var startTime = moment.tz(event.startdate + ' ' + event.starttime, timeZone).format();
            var currentStartTime = moment.tz(startTime, currentTimeZone).format();
            var splited = event.duration.split(':');
            var lang = localStorage.getItem('lang');
            var evTitle = lang == 'en' ? event.title : event.titleOL;
            var evSynopsis = lang == 'en' ? event.synopsis : event.synopsisOL;
            var title = evSynopsis + "<br>" + moment(currentStartTime).format('MMMM Do YYYY, H:mm ');
            contextItemId[j] = {
                id: j,
                recordId: event.recordedItemId,
                title: evTitle
            };
            items.add({
                id: j,
                content: '<span style="color:#97B0F8;">' + evTitle + '</span>',
                start: currentStartTime,
                end: moment(currentStartTime).add(splited[0], 'hours').add(splited[1], 'minutes').add(splited[2], 'seconds').format(),
                type: 'range',
                title: title
            });
        });
        this.items = items;
        this.contextItemId = contextItemId;
        this.recordedItems = recordedItems;
    };
    ;
    ChannelEpgComponent.prototype.setOptions = function () {
        var min = moment().startOf('day').subtract(7, 'days').format();
        var max = moment().startOf('day').add(7, 'days').format();
        var maxVisible = moment().startOf('day').add(8, 'days').format();
        return this.options = {
            stack: false,
            min: min,
            max: maxVisible,
            editable: false,
            start: ((new Date()).getTime() - 1000 * 60 * 60 * 3),
            end: ((new Date()).getTime() + 1000 * 60 * 60 * 3),
            zoomKey: 'ctrlKey',
            horizontalScroll: true,
            orientation: 'top',
            margin: {
                item: 20,
            },
            tooltip: {
                followMouse: true
            },
            rtl: this.isEnglish() ? false : true,
        };
    };
    ;
    ChannelEpgComponent.prototype.getTimeline = function (id) {
        var _this = this;
        if (!id || id === "NaN")
            return;
        this.epgService.getTimeline(id)
            .then(function (answer) {
            _this.data = answer;
            _this.setData(answer);
            _this.setOptions();
            _this.renderTimline();
            _this.load = true;
        })
            .catch(function (string) {
            _this.load = false;
            _this.timeline = null;
        });
    };
    ;
    ChannelEpgComponent.prototype.renderTimline = function () {
        this.timeline = new vis.Timeline(this.wrapper.nativeElement, null, this.options);
        this.timeline.setItems(this.items);
        this.timeline.on('click', this.openContextMenu.bind(this));
    };
    ;
    ChannelEpgComponent.prototype.isEnglish = function () {
        var lang = localStorage.getItem('lang');
        this.lang = lang == 'en';
        return (lang == 'en');
    };
    ;
    ChannelEpgComponent.prototype.openContextMenu = function (properties) {
        if (!properties.item)
            return;
        var item = this.getContextObj(properties.item);
        this.contextMenuService.show.next({
            event: properties.event,
            item: item,
        });
        properties.event.preventDefault();
        properties.event.stopPropagation();
    };
    ;
    ChannelEpgComponent.prototype.getContextObj = function (id) {
        var context = { itemId: '', thumbnail: '', title: '' };
        var obj = this.contextItemId[id];
        if (!obj)
            return context;
        context.title = obj.title;
        var item = this.recordedItems.find(function (item) {
            return item.itemId == obj.recordId;
        });
        if (item) {
            context.itemId = item.itemId;
            context.thumbnail = item.thumbnail;
            this.contextObj = item;
        }
        ;
        return context;
    };
    ;
    ChannelEpgComponent.prototype.isActiveCatch = function (item) {
        return item.itemId !== '';
    };
    ;
    ChannelEpgComponent.prototype.openVideoId = function () {
        this.contextVideo.emit(this.contextObj);
    };
    ;
    return ChannelEpgComponent;
}(core_1.OnChanges));
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ChannelEpgComponent.prototype, "id", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ChannelEpgComponent.prototype, "contextVideo", void 0);
__decorate([
    core_1.ViewChild('visChannelTimeline'),
    __metadata("design:type", core_1.ElementRef)
], ChannelEpgComponent.prototype, "wrapper", void 0);
ChannelEpgComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'channel-epg',
        templateUrl: 'channel-epg.component.html'
    }),
    __metadata("design:paramtypes", [epg_service_1.EpgService,
        angular2_contextmenu_1.ContextMenuService])
], ChannelEpgComponent);
exports.ChannelEpgComponent = ChannelEpgComponent;
;
//# sourceMappingURL=channel-epg.component.js.map