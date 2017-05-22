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
var angular2_contextmenu_1 = require("angular2-contextmenu");
var moment = require("moment");
require("moment-timezone");
var epg_service_1 = require("../../services/epg.service");
var transmite_service_1 = require("../../services/transmite.service");
var EpgComponent = (function () {
    function EpgComponent(epgService, transmiteService, router, contextMenuService) {
        this.epgService = epgService;
        this.transmiteService = transmiteService;
        this.router = router;
        this.contextMenuService = contextMenuService;
        this.groups = new vis.DataSet();
        this.items = new vis.DataSet();
        this.contextItemId = {};
        this.recordedItems = {};
        this.options = {};
        this.load = false;
        this.lang = true;
        this.movedDate = moment().startOf('day');
        this.date = this.movedDate.format('LL');
    }
    ;
    EpgComponent.prototype.ngOnInit = function () {
        this.getPortalTimeLine();
    };
    ;
    EpgComponent.prototype.ngDoCheck = function () {
        if ((this.lang != this.isEnglish()) && this.load) {
            this.timeline.destroy();
            this.timeline.off('click', this.openContextMenu);
            this.setData(this.data); //we need to reload the data in vis.js when a language is changed
            this.setOptions();
            this.renderTimline();
        }
    };
    ;
    EpgComponent.prototype.setData = function (Items) {
        var groups = new vis.DataSet();
        var items = new vis.DataSet();
        var contextItemId = {};
        var recordedItems = {};
        var counter = 0;
        var groupCounter = 0;
        var currentTimeZone = moment.tz.guess();
        Items.forEach(function (val, i) {
            // Add channels to data set
            groups.add({
                id: val.itemid,
                count: groupCounter++,
                content: '<img src="' + val.channelThumbnail + '" />'
            });
            var timeZone = val.epgTZ;
            recordedItems[val.itemid] = val.recordedItems;
            // Add events to channels and context menu
            val.events.forEach(function (event, j) {
                var startTime = moment.tz(event.startdate + ' ' + event.starttime, timeZone).format();
                var currentStartTime = moment.tz(startTime, currentTimeZone).format();
                var splited = event.duration.split(':');
                var lang = localStorage.getItem('lang');
                var evTitle = lang == 'en' ? event.title : event.titleOL;
                var evSynopsis = lang == 'en' ? event.synopsis : event.synopsisOL;
                var title = evSynopsis + "<br>" + moment(currentStartTime).format('MMMM Do YYYY, H:mm ');
                var id = val.itemid + ":" + counter;
                contextItemId[id] = {
                    id: id,
                    recordId: event.recordedItemId,
                    groupId: val.itemid,
                    title: evTitle
                };
                items.add({
                    id: counter++,
                    group: val.itemid,
                    content: '<span style="color:#97B0F8;">' + evTitle + '</span>',
                    start: currentStartTime,
                    end: moment(currentStartTime).add(splited[0], 'hours').add(splited[1], 'minutes').add(splited[2], 'seconds').format(),
                    type: 'range',
                    title: title
                });
            });
        });
        this.groups = groups;
        this.items = items;
        this.contextItemId = contextItemId;
        this.recordedItems = recordedItems;
    };
    ;
    EpgComponent.prototype.setOptions = function () {
        var min = moment().startOf('day').subtract(7, 'days').format();
        var max = moment().startOf('day').add(7, 'days').format();
        var maxVisible = moment().startOf('day').add(8, 'days').format();
        return this.options = {
            stack: false,
            min: min,
            max: maxVisible,
            groupOrder: function (a, b) {
                return a.count - b.count;
            },
            editable: false,
            start: ((new Date()).getTime() - 1000 * 60 * 60 * 3),
            end: ((new Date()).getTime() + 1000 * 60 * 60 * 3),
            zoomKey: 'ctrlKey',
            //horizontalScroll: true,
            verticalScroll: true,
            maxHeight: 800,
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
    EpgComponent.prototype.getPortalTimeLine = function () {
        var _this = this;
        this.epgService.getPortalTimeline()
            .then(function (answer) {
            _this.data = answer;
            _this.setData(answer);
            _this.setOptions();
            _this.renderTimline();
            _this.load = true;
        })
            .catch(function (string) {
            console.log(string);
        });
    };
    ;
    EpgComponent.prototype.renderTimline = function () {
        this.wrapper.nativeElement.style = '';
        this.timeline = new vis.Timeline(this.wrapper.nativeElement, null, this.options);
        this.timeline.setGroups(this.groups);
        this.timeline.setItems(this.items);
        this.timeline.on('click', this.openContextMenu.bind(this));
    };
    ;
    EpgComponent.prototype.moveLeft = function () {
        var min = moment().startOf('day').subtract(7, 'days').format();
        this.movedDate = this.movedDate.subtract(1, 'days');
        if (!this.movedDate.isBefore(min)) {
            this.date = this.movedDate.format('LL');
            this.timeline.moveTo(this.movedDate.format());
        }
        else {
            this.movedDate = moment().subtract(7, 'days').startOf('day');
            this.date = this.movedDate.format('LL');
        }
    };
    ;
    EpgComponent.prototype.moveRight = function () {
        var max = moment().startOf('day').add(7, 'days').format();
        this.movedDate = this.movedDate.add(1, 'days');
        if (!this.movedDate.isAfter(max)) {
            this.date = this.movedDate.format('LL');
            this.timeline.moveTo(this.movedDate.format());
        }
        else {
            this.movedDate = moment().startOf('day').add(7, 'days');
        }
    };
    ;
    EpgComponent.prototype.isEnglish = function () {
        var lang = localStorage.getItem('lang');
        this.lang = lang == 'en';
        return (lang == 'en');
    };
    ;
    EpgComponent.prototype.openContextMenu = function (properties) {
        if (!properties.group && !properties.item)
            return;
        var id = properties.group + ":" + properties.item;
        var item = this.getContextObj(id);
        this.contextMenuService.show.next({
            event: properties.event,
            item: item,
        });
        properties.event.preventDefault();
        properties.event.stopPropagation();
    };
    ;
    EpgComponent.prototype.getContextObj = function (id) {
        var context = { itemId: '', thumbnail: '', title: '' };
        var obj = this.contextItemId[id];
        if (!obj)
            return;
        context.title = obj.title;
        var arr = this.recordedItems[obj.groupId];
        var item = arr.find(function (item) {
            return item.itemId == obj.recordId;
        });
        if (item) {
            context.itemId = item.itemId;
            context.thumbnail = item.thumbnail;
            item.groupId = obj.groupId;
            this.transmiteService.setContext(item);
        }
        ;
        return context;
    };
    ;
    EpgComponent.prototype.openVideoId = function (id) {
        this.router.navigate(['live/catch']);
    };
    ;
    EpgComponent.prototype.isActiveCatch = function (item) {
        return item.itemId !== '';
    };
    ;
    return EpgComponent;
}());
__decorate([
    core_1.ViewChild('visTimeline'),
    __metadata("design:type", core_1.ElementRef)
], EpgComponent.prototype, "wrapper", void 0);
EpgComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'epg',
        templateUrl: 'epg.component.html'
    }),
    __metadata("design:paramtypes", [epg_service_1.EpgService,
        transmite_service_1.TransmiteService,
        router_1.Router,
        angular2_contextmenu_1.ContextMenuService])
], EpgComponent);
exports.EpgComponent = EpgComponent;
;
//# sourceMappingURL=epg.component.js.map