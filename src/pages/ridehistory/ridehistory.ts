import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController, ViewController } from 'ionic-angular';

import { IAMService } from '../../services/iam.service';
import { ConfigService } from '../../services/config.service';

import { HomePage } from '../../pages/home/home';
import  moment from 'moment';

@Component({
  selector: 'page-ridehistory',
  templateUrl: 'ridehistory.html'
})
export class RideHistoryPage implements OnInit {
  public rideInfo = {startTime: '08/25/2018', endTime: '2:00', time: '12.53', distance: 2.53, calories: 200, rating: 4};
  public ridePath = [
{
  "lat": 39.90668,
  "lng": -75.35538
},
{
  "lat": 39.9065,
  "lng": -75.35518
},
{
  "lat": 39.90643,
  "lng": -75.35499
},
{
  "lat": 39.90637,
  "lng": -75.35495
},
{
  "lat": 39.90631,
  "lng": -75.35491
},
{
  "lat": 39.90628,
  "lng": -75.35487
},
{
  "lat": 39.90624,
  "lng": -75.35482
},
{
  "lat": 39.90621,
  "lng": -75.35478
},
{
  "lat": 39.90612,
  "lng": -75.3546
},
{
  "lat": 39.90607,
  "lng": -75.3545
},
{
  "lat": 39.906,
  "lng": -75.35438
},
{
  "lat": 39.90596,
  "lng": -75.35431
},
{
  "lat": 39.90594,
  "lng": -75.35427
},
{
  "lat": 39.90588,
  "lng": -75.35421
},
{
  "lat": 39.90583,
  "lng": -75.35415
},
{
  "lat": 39.9058,
  "lng": -75.35411
},
{
  "lat": 39.90577,
  "lng": -75.35407
},
{
  "lat": 39.90573,
  "lng": -75.35398
},
{
  "lat": 39.9057,
  "lng": -75.35389
},
{
  "lat": 39.90567,
  "lng": -75.35381
}];
public currentLatitude = this.ridePath[19].lat;
public currentLongitude = this.ridePath[19].lng;
public rides = [];

  constructor(public viewCtrl: ViewController, private navCtrl: NavController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService) {}

  ngOnInit() {
    for(var i=0; i<5; i++) {
      let ride = {"ridePath": this.ridePath, "currentLatitude": this.currentLatitude, "currentLongitude": this.currentLongitude, "rideInfo": this.rideInfo}
      this.rides.push(ride);
    }
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/user/rides', {headers: headers}).subscribe(data => {
      console.log(data);
      let test = data;
      test = test.rides;
    })
  }

  back() {
    this.navCtrl.setRoot(HomePage);
  }

}
