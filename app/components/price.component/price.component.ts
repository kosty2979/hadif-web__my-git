import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Types, PaymentService } from '../../services/payment.service';
import { Price } from '../../classes/price';
import { Terms } from '../../classes/terms';

let period= {
  "recurring1Month": "r1m",
  "recurring3Months": "r3m",
  "recurring6Months": "r6m",
  "recurring1Year": "r1y",
  "recurring2Years": "r2y",
  "oneoffpayment1Month": "o1m",
  "oneoffpayment3Months": "o3m",
  "oneoffpayment6Months": "o6m",
  "oneoffpayment1Year": "o1y",
  "oneoffpayment2Years": "o2y",
  "recurringprice1Month": "r1m",
  "recurringprice3Months": "r3m",
  "recurringprice6Months": "r6m",
  "recurringprice1Year": "r1y",
  "recurringprice2Years": "r2y",
  "oneoffprice1Month": "o1m",
  "oneoffprice3Months": "o3m",
  "oneoffprice6Months": "o6m",
  "oneoffprice1Year": "o1y",
  "oneoffprice2Years": "o2y",
}

@Component({
	moduleId: module.id,
	selector: 'content',
	templateUrl: 'price.component.html'
})

export class PriceComponent {
	terms:Terms = new Terms();
	lang: boolean= true;
	prices: Price[] ;
	error:boolean = false;
	errortext:string ='';
	selectedPrice:string;
	voucherCode:string;
	firstStep: boolean = false;
	freePeriod:{ active:string, days:string } ;
	tarifForFree:Array<string>= ["r1m", "r3m", "r6m", "r1y", "r2y"];

	constructor( private authService: AuthService,
							private router: Router,
              private paymentService: PaymentService
	){};

	ngOnInit(){
		if ( !this.authService.isAuthorized() ){
		this.router.navigate(['/register']);
		};
		this.getPrice()
	};

  showItem(price:Price){
    return parseInt(price.value) != 99999;
  };


	onSubmit(){
    let type:number = Types.OneOffPayment;
    if( period[this.selectedPrice][0]=='r' ) type = Types.Recurring;
    let price = "";
    this.prices.forEach((el)=>{
      if (el.name == this.selectedPrice){
        price = el.value;
      }
    })

    let vaucher = localStorage.getItem('voucherCode');

    this.paymentService.getHpayDetails(type, period[this.selectedPrice], vaucher)
      .then((d:any)=>{
        sessionStorage.setItem('hpayDetails', JSON.stringify(d.hpayDetails));
        sessionStorage.setItem('price', price);
        if(parseInt(price) != 0){
        	this.router.navigate(['/payment']);
        } else {
        	this.router.navigate(['/comfirm-payment']);
        }
      })
      .catch((error)=>{
      })

	};

	private getPrice(){
		if( localStorage.getItem('voucherPrice') ){
			this.setPrice( JSON.parse( localStorage.getItem('voucherPrice') ) );
			this.voucherCode = localStorage.getItem('voucherCode');
		} else {
			this.authService.getPrice()
			.then( answer =>{
				this.freePeriod = answer.freePeriod;
				delete answer.freePeriod;
				let tmp:Object = {};
				for ( let key in answer ){
		      var obj = answer[key];
		      for( let str in obj ){
			        var name = key.toLowerCase()+str;
			        tmp[name] = obj[str];
			      }
		    };
				this.setPrice( tmp )
			})
			.catch( error  => {
  		this.errortext = error;
  		this.error = true
	  	})
		};
	};


	private setPrice( obj:Object){
 		let array = [];
 		let needSubmit:boolean= false
 		for ( let key in obj ){
 			let tmp:Price = new Price;
 			tmp["name"] = key;
 			tmp["value"] = obj[key].replace(/USD/g, '');
 			if ( parseInt(obj[key]) == 0 ){//   for
	    	this.selectedPrice = tmp.name;//  0 price
	   		needSubmit = true;						//  not select tarrif plan
	    }
 			array.push(tmp);
 		}
 		this.prices = array;
 		if ( needSubmit){
	   		this.firstStep =!this.firstStep
	    }
	};

	 private getActiveDay(price:Price){
	 	let text;
	 	if( localStorage.getItem('voucherPrice') ) return text
	 	if(this.tarifForFree.indexOf(period[price.name])!=-1 && this.freePeriod.active == "1" ){
	 		text = this.freePeriod.days 
		 	//text = '(including '+days+' days free trial)'
		 }
		 return text
	 };

	 private getTermsText(){
	 	let text = this.isEnglish()? this.terms.en : this.terms.ar;
	 	return text
	 }

	 private isEnglish():boolean{
			let lang = localStorage.getItem('lang');
			this.lang = lang == 'en';
		     return ( lang == 'en' ) ;
		};
};
