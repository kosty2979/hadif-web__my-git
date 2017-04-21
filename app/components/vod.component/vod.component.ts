import { Component, OnInit, OnChanges } from '@angular/core';
import { ChenalService } from '../../services/chenal.service';
import { Series } from '../../classes/series';
import {Subject, Observable} from 'rxjs/Rx';
import {AuthService} from '../../services/auth.service';

@Component({
  moduleId: module.id,
  selector: 'content',
  templateUrl: 'vod.component.html'
})

export class VodComponent implements OnInit {
  private searchEmitter:Subject<any>;

  private seriesList:Series[];
  private searchSeriesList:any[];
  private filter:any;
  private sorting:any;
  private types:any = [];
  private searchInput:any;
  private search:boolean = false;
  private errortext:string ='';
  private error:boolean = false;
  private inFocus:boolean = true;
  hasAccess(item:any){ return  this.authService.hasAccess(item);}


  constructor(private chenal: ChenalService, private authService: AuthService) {
    this.chenal.getSeries({},null)
      .then(d=> this.seriesList = this.sotringArray( d, 'publishDatetime', true ));
    this.chenal.getGenre({},null)
      .then(d=>this.types=d);
      this.initEmiter();
  }

  initEmiter(){
    this.searchEmitter = new Subject<any>();
    this.searchEmitter
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap((val:string) => {
          this.chenal.getsearchItems( this.searchInput.trim(), 3 )
          .then(answer =>{
               this.error = false;
               this.searchSeriesList = this.sotringArray( answer, 'added', true ) ;
             })
             .catch(error=>{
               this.errortext = error;
               this.error = true;
               this.searchSeriesList =[];
               this.searchEmitter.complete();
             });
             return val;
      }).subscribe();
  }

  private getField(field:string ,series:Series){
    let lang = localStorage.getItem('lang');
		if (!lang) lang = 'en';
    let fieldAr = field+'OL';
    if (field=="contentTitle") fieldAr = "titleOL";
    if (lang == 'en'){
      return series[field] || series[fieldAr] || " :(( ";
    } else {
      return series[fieldAr] || series[field] || " :(( ";
    }
  };

  private applyFilter(){
    let genre = [];
    for(let i in this.types){
      if(this.types[i].enable){
        genre.push(parseInt(this.types[i].genreId));
      }
    }
    this.chenal.getSeries({filter:{genre:genre, sorting: this.sorting}},null)
      .then(d=>this.seriesList=d);
  };

 ngOnChanges(): void {

 }

  private getSearch(){
    if (this.searchEmitter.isStopped) this.initEmiter();
    if(this.searchInput.length>0) this.searchEmitter.next(this.searchInput.trim());
  };

  private exitSearch(){
    this.search = false;
    this.searchSeriesList =[];
    this.error = false;
    this.errortext = '';
    this.searchInput ='';
  };

  

  ngOnInit(): void {
//    this.heroService.getHeroes()
//      .then(heroes => this.heroes = heroes.slice(1, 5));
  };

  private sotringArray( array:Array<any>, field:string, revers?:boolean ){
     let r:number = revers? -1 : 1;
     if(array && field ){ array.sort((a: any, b: any)=>{
            if (a[field] < b[field]) {
            return -1*r;
          } else if (a[field] > b[field]) {
            return 1*r;
          } else {
            return 0;
          }
        })
     };
     return array
  };
}
