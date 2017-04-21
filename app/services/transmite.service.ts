import { Injectable }    from '@angular/core';

@Injectable()
export class TransmiteService {

context:{}={};

	public setContext(obj:any):any{
		this.context = obj
	};
	public getContext():Object{
		return this.context 
	};

};