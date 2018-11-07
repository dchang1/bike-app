import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../services/config.service';
import { NavController, AlertController } from 'ionic-angular';

@Injectable()
export class IAMService {
  public response: any = {};

  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  pad(num) {
    var s = "0" + num;
    return s.substr(s.length-2);
  }
  // set the current user in localStorages
  setCurrentUser(data) {
    if (data == null) {
      console.log("logged out");
      localStorage.clear();
    } else {
      data.totalDistance = 0.10;
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('lastName', data.lastName);
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('session', "true");
      localStorage.setItem('campus', data.campus);
      localStorage.setItem('userType', data.userType);
      localStorage.setItem('totalRideDistance', data.totalDistance.toFixed(2).toString().split(".")[0]);
      localStorage.setItem('totalRideDistanceDecimal', data.totalDistance.toFixed(2).toString().split(".")[1]);
      localStorage.setItem('totalRideHours', Math.floor(data.totalRideTime));
      localStorage.setItem('totalRideMinutes', this.pad(Math.floor(data.totalRideTime%1 * 60)));
      localStorage.setItem('totalRides', data.totalRides.toString());
      localStorage.setItem('verified', data.verified);
    }
  }

  updateCurrentUser(data) {
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('lastName', data.lastName);
    localStorage.setItem('email', data.email);
    localStorage.setItem('campus', data.campus);
    localStorage.setItem('userType', data.userType);
    localStorage.setItem('totalRideDistance', data.totalDistance.toFixed(2).toString().split(".")[0]);
    localStorage.setItem('totalRideDistanceDecimal', data.totalDistance.toFixed(2).toString().split(".")[1]);
    localStorage.setItem('totalRideHours', Math.floor(data.totalRideTime));
    localStorage.setItem('totalRideMinutes', this.pad(Math.floor(data.totalRideTime%1 * 60)));
    localStorage.setItem('totalRides', data.totalRides.toString());
    localStorage.setItem('verified', data.verified);
  }
  checkVerified() {
    if(localStorage.getItem('verified')=="true") {
      console.log("THIS IS VERIFIED");
      return true;
    } else {
      console.log("NOT VERIFIED");
      return false;
    }
  }

  checkUser() {
    if(localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
