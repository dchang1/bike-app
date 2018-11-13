import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, NavController, LoadingController, ViewController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';

import  moment from 'moment';

@Component({
  selector: 'page-ridehistory',
  templateUrl: 'ridehistory.html'
})
export class RideHistoryPage implements OnInit {
  public rides = [];
  public response: any = {};
  public unregisterBackButtonAction: any;
  public ridePage = 1;
  public pagingEnabled = true;

  constructor(public platform: Platform, public viewCtrl: ViewController, private navCtrl: NavController, private httpClient: HttpClient, private config: ConfigService, private loadingCtrl: LoadingController) {}

  ionViewDidEnter() {
        this.initializeBackButtonCustomHandler();
    }
  ionViewWillLeave() {
        // Unregister the custom back button action for this page
      this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
      this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
          this.customHandleBackButton();
      }, 10);
  }

  private customHandleBackButton(): void {
    this.navCtrl.pop();
  }

  public pad(num) {
    var s = "0" + num;
    return s.substr(s.length-2);
  }

  ngOnInit() {
    // for(var i=0; i<5; i++) {
    //   let ride = {"ridePath": this.ridePath, "currentLatitude": this.currentLatitude, "currentLongitude": this.currentLongitude, "rideInfo": this.rideInfo}
    //   this.rides.push(ride);
    // }
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    loading.present();
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/user/rides/0', {headers: headers}).subscribe(data => {
      this.response = data;
      this.rides = this.response.rides;
      console.log(this.rides);
      if(this.rides) {
        for(var i=0; i<this.rides.length; i++) {
          this.rides[i].startTime = moment(this.rides[i].startTime).format('MM/DD/YYYY');
          this.rides[i].distance = Math.round(this.rides[i].distance * 100)/100;
          this.rides[i].rideHours = Math.floor(this.rides[i].time).toString();
          this.rides[i].rideMinutes = this.pad(Math.floor((this.rides[i].time % 1) * 60));
          this.rides[i].rideSeconds = this.pad(Math.floor((((this.rides[i].time % 1) * 60) % 1) * 60));
        }
      } else {
        this.pagingEnabled = false;
      }
    })
    loading.dismiss();
  }

  back() {
    this.navCtrl.pop();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    setTimeout(() => {
      let headers = new HttpHeaders({
        'Authorization': localStorage.getItem('token')
      });
      this.httpClient.get(this.config.getAPILocation() + '/user/rides/' + this.ridePage, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.rides) {
          for(var i=0; i<this.response.rides.length; i++) {
            this.response.rides[i].startTime = moment(this.response.rides[i].startTime).format('MM/DD/YYYY');
            this.response.rides[i].distance = Math.round(this.response.rides[i].distance * 100)/100;
            this.response.rides[i].rideHours = Math.floor(this.response.rides[i].time).toString();
            this.response.rides[i].rideMinutes = this.pad(Math.floor((this.response.rides[i].time % 1) * 60));
            this.response.rides[i].rideSeconds = this.pad(Math.floor((((this.response.rides[i].time % 1) * 60) % 1) * 60));
            console.log(this.response.rides[i]);
            this.rides.push(this.response.rides[i]);
          }
        } else {
          this.pagingEnabled = false;
        }
        this.ridePage++;
      })
      infiniteScroll.complete();
    }, 1500);
  }


}
