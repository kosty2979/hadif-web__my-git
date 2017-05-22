import { Component, ViewChild, ElementRef, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { ContextMenuService, ContextMenuComponent } from 'angular2-contextmenu';

declare let vis: any;
import * as moment from 'moment';
import 'moment-timezone';

import { EpgService } from '../../services/epg.service';

@Component({
	moduleId: module.id,
	selector: 'channel-epg',
	templateUrl: 'channel-epg.component.html'
})

export class ChannelEpgComponent extends OnChanges  {

  @Input() id: string;
  @Output() contextVideo: EventEmitter<any> = new EventEmitter()
	items = new vis.DataSet();
	options:Object ={};
	timeline:any = null;
	data:any;
	load:boolean = false;
	lang: boolean= true;

	contextItemId:Object = {};
	recordedItems:Array<any> = [];
	contextObj:Object = {};

	constructor(
		private epgService: EpgService,
		private contextMenuService: ContextMenuService
	){
		super()
	};
		
	@ViewChild('visChannelTimeline') wrapper:ElementRef;

  ngDoCheck() {
  	if( ( this.lang != this.isEnglish()) && this.load ){
  		this.timeline.destroy();
			this.setData( this.data ); //we need to reload the data in vis.js when a language is changed
  		this.setOptions();
			this.renderTimline();
  	}

  };

   ngOnChanges(changes: {[propKey: string]: SimpleChange}) {

         setTimeout(()=>{
         		if( this.timeline ) this.timeline.destroy();
			  		this.setOptions();
            this.getTimeline( changes['id'].currentValue.toString());
         },100);
    };

  private setData( Items:any ){ 

		let items = new vis.DataSet();
		let contextItemId:Object={};
		let recordedItems:Array<any>=[];
		let counter: number = 0;
		let currentTimeZone = moment.tz.guess();
		let timeZone = Items.epgTZ;
	    // Add events to channels
	    recordedItems = Items.recordedItems;

		 Items.events.forEach( function( event:{startdate:string, starttime:string, endtime:string, title:string, synopsis:string, duration:string, titleOL:string, synopsisOL:string, recordedItemId:string }, j:number) {
		 				let startTime = moment.tz( event.startdate + ' ' + event.starttime, timeZone).format()
				 		let currentStartTime = moment.tz(startTime, currentTimeZone).format();
		 				let splited = event.duration.split(':');
						let lang = localStorage.getItem('lang');
						let evTitle = lang == 'en'? event.title : event.titleOL;
						let evSynopsis = lang == 'en'? event.synopsis : event.synopsisOL;
						let title:string = evSynopsis +"<br>"+ moment(currentStartTime).format('MMMM Do YYYY, H:mm ');

				contextItemId[j]={
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
		      })	
	this.items = items;
	this.contextItemId=contextItemId;
	this.recordedItems=recordedItems;   			   
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
				horizontalScroll: true,              
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

	private getTimeline( id:string ){

	if( !id || id==="NaN" ) return

		this.epgService.getTimeline( id )
			.then( answer =>{
				 this.data = answer;
				 this.setData( answer );
				 this.setOptions();
				 this.renderTimline();
				 this.load = true;
			})
	  	.catch( string  => {
	  		this.load = false;
	  		this.timeline = null;
	  	})
	};

	private renderTimline(){ 
		this.wrapper.nativeElement.style='';
		this.timeline = new vis.Timeline( this.wrapper.nativeElement, null, this.options);
		this.timeline.setItems(this.items);
		this.timeline.on('click', this.openContextMenu.bind(this))
	};

	private isEnglish():boolean{
		let lang = localStorage.getItem('lang');
		this.lang = lang == 'en';
	     return ( lang == 'en' ) ;
	};

	public openContextMenu (properties:any) {
		if(!properties.item ) return
		let item = this.getContextObj(properties.item);
		this.contextMenuService.show.next({
		  event: properties.event,
		  item: item,
		});
		properties.event.preventDefault();
		properties.event.stopPropagation();
	};

	private getContextObj(id:string){
		let context:{itemId:string, thumbnail:string, title:string }={itemId:'',thumbnail:'',title:''};
		let obj= this.contextItemId[id];
		if(!obj) return context
		context.title = obj.title;
		let item = this.recordedItems.find((item:any)=>{
			return item.itemId == obj.recordId
		});
		if( item ){
			context.itemId = item.itemId;
			context.thumbnail = item.thumbnail;
			this.contextObj = item;
		};
		return context;
	};

	private isActiveCatch(item: any): boolean {
		return item.itemId !== '';
	};

	private openVideoId(){
		this.contextVideo.emit(this.contextObj)
	};
};
