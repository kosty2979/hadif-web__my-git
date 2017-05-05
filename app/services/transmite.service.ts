import { Injectable }    from '@angular/core';

@Injectable()
export class TransmiteService {

context:{}={};
url:string="";

	public setContext(obj:any):any{
		this.context = obj
	};
	public getContext():Object{
		return this.context 
	};

	public setUrl(url:string):any{
		this.url = url
	};
	public getUrl():any{
		let url = this.url;
		this.url ='';
		return url 
	};

};