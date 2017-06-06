import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserDataService } from '../../services/user-data.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'content',
  templateUrl: 'setting-confirmCard.component.html'
})

export class SettingComfirmCardComponent {
  cId:any;
  success: boolean = false;
  error: boolean  = false;

constructor(
    private userDataService: UserDataService,
    private authService: AuthService,
    private router: Router
  ){};



  ngOnInit(){
    let cId = sessionStorage.getItem('updateCardCid');

    this.userDataService.hpayUpdateCardPayment(cId)
    .then(()=>{
        sessionStorage.removeItem('updateCardCid');
        this.success = true;
        this.authService.refreshSubscriptions();
        setTimeout(()=>{
          this.router.navigate(['/setting/profile']);
        }, 3000)
    })
    .catch(()=>{
      sessionStorage.removeItem('updateCardCid');
      this.error = true;
       setTimeout(()=>{
          this.router.navigate(['/setting/profile']);
        }, 3000)
    })

  };

};
