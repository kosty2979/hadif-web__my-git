import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ContextMenuService, ContextMenuComponent } from 'angular2-contextmenu';

declare let vis: any;
import * as moment from 'moment';
import 'moment-timezone';

import { EpgService } from '../../services/epg.service';
import { TransmiteService } from '../../services/transmite.service';

@Component({
	moduleId: module.id,
	selector: 'epg',
	templateUrl: 'epg.component.html'
})

export class EpgComponent {

	constructor(
		private epgService: EpgService,
		private transmiteService: TransmiteService,
		private router: Router,
		private contextMenuService: ContextMenuService
	){};
		
	@ViewChild('visTimeline') wrapper:ElementRef;

	
	groups = new vis.DataSet();
	items = new vis.DataSet();
	contextItemId:Object={};
	recordedItems:Object={};
	options:Object ={};
	timeline:any;
	data:any;
	load:boolean = false;
	lang: boolean= true;
	movedDate = moment().startOf('day');
	date:string = this.movedDate.format('LL')
	
	ngOnInit(){
    this.getPortalTimeLine()
  };

  ngDoCheck() {
  	if( (this.lang != this.isEnglish()) && this.load ){
  		this.timeline.destroy();
			this.timeline.off('click', this.openContextMenu);
			this.setData( this.data ); //we need to reload the data in vis.js when a language is changed
  		this.setOptions();
			this.renderTimline();
  	}
  };

	private setData( Items:any ){ 
	  let groups= new vis.DataSet();
		let items = new vis.DataSet();
		let contextItemId:Object={};
		let recordedItems:Object={};
    let counter: number = 0;
    let currentTimeZone = moment.tz.guess();

		Items.forEach( function (val:{ itemid:string, events:Array<Object>, channelThumbnail:string,recordedItems:Array<Object>, epgTZ:string }, i:number ) {
// Add channels to data set
		      groups.add({
		        id: val.itemid,
		        content: '<img src="' + val.channelThumbnail + '" />'
		      });

		      let timeZone = val.epgTZ;

		      recordedItems[val.itemid]=val.recordedItems;
// Add events to channels and context menu
				 val.events.forEach( function( event:{startdate:string, starttime:string, endtime:string, title:string, synopsis:string, duration:string, titleOL:string, synopsisOL:string, recordedItemId:string }, j:number) {
				 				let startTime = moment.tz( event.startdate + ' ' + event.starttime, timeZone).format()
				 				let currentStartTime = moment.tz(startTime, currentTimeZone).format();

				 				let splited = event.duration.split(':');
								let lang = localStorage.getItem('lang');
								let evTitle = lang == 'en'? event.title : event.titleOL;
								let evSynopsis = lang == 'en'? event.synopsis : event.synopsisOL;
				 				let title:string = evSynopsis +"<br>"+ moment(currentStartTime).format('MMMM Do YYYY, H:mm ');
				 				let id = val.itemid+":"+counter;


								contextItemId[id]={
										id: id,
										recordId: event.recordedItemId,
										groupId:val.itemid,
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
				          // type: 'range'
				        });
				      })
				    });
				this.groups = groups;
				this.items = items;
				this.contextItemId = contextItemId;
				this.recordedItems = recordedItems;
	};

	private setOptions(){

	let min = moment().startOf('day').subtract(7, 'days').format()
    let max = moment().startOf('day').add(7, 'days').format()
    let maxVisible = moment().startOf('day').add(8, 'days').format()
		return  this.options = {
			stack: false,
			min: min,
			max: maxVisible,
			editable: false,
			start: ((new Date()).getTime() - 1000 * 60 * 60*3), 
			end:   ((new Date()).getTime() + 1000 * 60 * 60*3), 
			zoomKey: 'ctrlKey',                  
			//horizontalScroll: true,
			verticalScroll: true,
			maxHeight: 800,            
			orientation: 'top',                  
			margin: {
			  item: 20, // minimal margin between items
			  // axis: 5   // minimal margin between items and the axis
			},
			tooltip:{
			  followMouse: true
			},
			rtl: this.isEnglish()? false : true  , //for revert timeline
  	};
	};

	private getPortalTimeLine(){
		this.epgService.getPortalTimeline()
			.then( answer =>{
				this.data = answer;
				this.setData( answer );
				this.setOptions();
				this.renderTimline();
				this.load = true;
			})
	  	.catch( string  => {
	  		console.log(string);
	  	})
	};

 private renderTimline(){ 	
  this.timeline = new vis.Timeline( this.wrapper.nativeElement, null, this.options);
  this.timeline.setGroups(this.groups);
  this.timeline.setItems(this.items);
  this.timeline.on('click', this.openContextMenu.bind(this));
 };


private moveLeft(){
	let min = moment().startOf('day').subtract(7, 'days').format()
	this.movedDate = this.movedDate.subtract(1, 'days');
	if (!this.movedDate.isBefore(min)) {
   this.date =  this.movedDate.format('LL');
   this.timeline.moveTo(this.movedDate.format());
 } else {
   this.movedDate = moment().subtract(7, 'days').startOf('day');
   this.date =  this.movedDate.format('LL');
 }
};
 
 private moveRight(){
 	let max = moment().startOf('day').add(7, 'days').format()
 	this.movedDate = this.movedDate.add(1, 'days');
  if (!this.movedDate.isAfter(max)) {
    this.date = this.movedDate.format('LL');
    this.timeline.moveTo(this.movedDate.format());
  } else {
    this.movedDate = moment().startOf('day').add(7, 'days');
  }
 };


private isEnglish():boolean{
	let lang = localStorage.getItem('lang');
	this.lang = lang == 'en';
     return ( lang == 'en' ) ;
};



  public openContextMenu (properties:any) {
  if(!properties.group && !properties.item ) return

	let id = properties.group+":"+properties.item;
	let item = this.getContextObj(id);

	this.contextMenuService.show.next({
      event: properties.event,
      item: item,
    });
    properties.event.preventDefault();
    properties.event.stopPropagation();
  };

	private getContextObj(id:string){
		let context:{itemId:string, thumbnail:string, title:string }={itemId:'',thumbnail:'',title:'' };
		let obj= this.contextItemId[id];
		if(!obj) return;
		context.title = obj.title; 
		let arr = this.recordedItems[obj.groupId]
		let item = arr.find((item:any)=>{
			return item.itemId == obj.recordId
		});

		if( item ){
			context.itemId = item.itemId;
			context.thumbnail = item.thumbnail;
			item.groupId = obj.groupId;
			this.transmiteService.setContext(item)
		};
		return context;
	};

	private openVideoId(id:number){
		this.router.navigate(['live/catch'])
	};

	private isActiveCatch(item: any): boolean {
		return item.itemId !== '';
	};

};

