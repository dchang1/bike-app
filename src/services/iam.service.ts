import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../services/config.service';
import { NavController, AlertController } from 'ionic-angular';

@Injectable()
export class IAMService {
  public response: any = {};

  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  // set the current user in localStorages
  setCurrentUser(data) {
    if (data == null) {
      console.log("logged out");
      localStorage.clear();
    } else {
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('lastName', data.lastName);
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('session', "true");
      localStorage.setItem('campus', data.campus);
      localStorage.setItem('userType', data.userType);
      /*
      localStorage.setItem('totalRideTime', data.totalRideTime);
      localStorage.setItem('totalDistance', data.totalDistance);
      localStorage.setItem('totalRides', data.pastRides.length);
      */
    }
  }

  checkUser() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/user', {headers: headers}).subscribe(data => {
      if(data) {
        return true;
      } else {
        return false;
      }
    }, error => {
      console.log("ERROR");
    })
  }
}
