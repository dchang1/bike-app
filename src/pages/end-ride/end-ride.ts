import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController, ViewController, NavParams } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { RegisterPage } from '../register/register';
import { HomePage } from '../../pages/home/home';
import  moment from 'moment';

@Component({
  selector: 'page-end-ride',
  templateUrl: 'end-ride.html'
})

export class EndRidePage implements OnInit {

  constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private httpClient: HttpClient, private config: ConfigService, private iam: IAMService, public viewCtrl: ViewController, public params: NavParams) {
  }
  public one = false;
  public two = false;
  public three = false;
  public four = false;
  public five = false;
  public rideSummary = false;
  public ride = {startTime: '1:00', endTime: '2:00', time: '1:00', distance: 2.53, calories: 200, rating: 4};
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
  startTime = this.ride.startTime;
  endTime = this.ride.endTime;
  time = this.ride.time;
  distance = this.ride.distance;
  calories = this.ride.calories;
  rating = this.ride.rating;
  public response: any = {};

  /*
  public rideInfo: any = {};
  public response: any = {};
  startTime;
  endTime;
  time;
  distance;
  calories;
  rating;
  currentLatitude;
  currentLongitude;
  ridePath;*/
  ngOnInit() {
    /*
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.get(this.config.getAPILocation() + '/ride/' + localStorage.getItem('rideID'), {headers: headers}).subscribe(data => {
      this.rideInfo = data;
      this.startTime = moment(this.rideInfo.ride.startTime).format('LT');
      this.endTime = moment(this.rideInfo.ride.startTime).format('LT');
      this.time = (this.rideInfo.ride.time*60).toFixed(2);
      this.distance = this.rideInfo.ride.distance.toFixed(2);
      this.calories = (650*this.time / 60).toFixed(2);
      this.rating = this.rideInfo.ride.rating;
      this.currentLatitude = this.rideInfo.ride.endPosition[0];
      this.currentLongitude = this.rideInfo.ride.endPosition[1];
      this.ridePath = this.rideInfo.ride.route;
    }, error => {
      console.log("can't connect to server");
    });
    */
  }
  public dismiss() {
    this.viewCtrl.dismiss();
  }
  public oneStar() {
    this.one = true;
    var timeout = setTimeout(() => {
      this.rideSummary = true;
      let headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': localStorage.getItem('token')
      });
      this.httpClient.post(this.config.getAPILocation() + '/rating', {ride: localStorage.getItem('rideID'), rating: 1}, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.success==true) {
          console.log("rating");
        } else {
          console.log("error");
        }
      }, error => {
        console.log("can't connect to server");
      })
    }, 1000)
  }
  public twoStar() {
    this.one = true;
    this.two = true;
    var timeout = setTimeout(() => {
      this.rideSummary = true;
      let headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': localStorage.getItem('token')
      });
      this.httpClient.post(this.config.getAPILocation() + '/rating', {ride: localStorage.getItem('rideID'), rating: 2}, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.success==true) {
          console.log("rating");
        } else {
          console.log("error");
        }
      }, error => {
        console.log("can't connect to server");
      })
    }, 1000)
  }
  public threeStar() {
    this.one = true;
    this.two = true;
    this.three = true;
    var timeout = setTimeout(() => {
      this.rideSummary = true;
      let headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': localStorage.getItem('token')
      });
      this.httpClient.post(this.config.getAPILocation() + '/rating', {ride: localStorage.getItem('rideID'), rating: 3}, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.success==true) {
          console.log("rating");
        } else {
          console.log("error");
        }
      }, error => {
        console.log("can't connect to server");
      })
    }, 1000)
  }
  public fourStar() {
    this.one = true;
    this.two = true;
    this.three = true;
    this.four = true;
    var timeout = setTimeout(() => {
      this.rideSummary = true;
      let headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': localStorage.getItem('token')
      });
      this.httpClient.post(this.config.getAPILocation() + '/rating', {ride: localStorage.getItem('rideID'), rating: 4}, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.success==true) {
          console.log("rating");
        } else {
          console.log("error");
        }
      }, error => {
        console.log("can't connect to server");
      })
    }, 1000)
  }
  public fiveStar() {
    this.one = true;
    this.two = true;
    this.three = true;
    this.four = true;
    this.five = true;
    var timeout = setTimeout(() => {
      this.rideSummary = true;
      let headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': localStorage.getItem('token')
      });
      this.httpClient.post(this.config.getAPILocation() + '/rating', {ride: localStorage.getItem('rideID'), rating: 5}, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.success==true) {
          console.log("rating");
        } else {
          console.log("error");
        }
      }, error => {
        console.log("can't connect to server");
      })
    }, 1000)
  }
  public skip() {
    this.rideSummary = true;
  }

}
