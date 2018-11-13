import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, ViewController, NavParams } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'page-end-ride',
  templateUrl: 'end-ride.html'
})

export class EndRidePage {
  public one = false;
  public two = false;
  public three = false;
  public four = false;
  public five = false;
  comment = "";
  public ride = {startTime: '1:00', endTime: '2:00', time: '1:00', distance: 2.53, calories: 200, rating: 4};
  public ridePath = [{"lat":39.90668,"lng":-75.35538},{"lat":39.9065,"lng":-75.35518},{"lat":39.90643,"lng":-75.35499},{"lat":39.90637,"lng":-75.35495},{"lat":39.90631,"lng":-75.35491},{"lat":39.90628,"lng":-75.35487},{"lat":39.90624,"lng":-75.35482},{"lat":39.90621,"lng":-75.35478},{"lat":39.90612,"lng":-75.3546},{"lat":39.90607,"lng":-75.3545},{"lat":39.906,"lng":-75.35438},{"lat":39.90596,"lng":-75.35431},{"lat":39.90594,"lng":-75.35427},{"lat":39.90588,"lng":-75.35421},{"lat":39.90583,"lng":-75.35415},{"lat":39.9058,"lng":-75.35411},{"lat":39.90577,"lng":-75.35407},{"lat":39.90573,"lng":-75.35398},{"lat":39.9057,"lng":-75.35389},{"lat":39.90567,"lng":-75.35381}];
  public currentLatitude;
  public currentLongitude;
  public response: any = {};
  public rideHours = '0';
  public rideDistance = 0;
  public rideCalories = 0;
  public rideMinutes = '00';
  public rideSeconds = '00';
  public rideCost = '0.00';
  public rideDistanceDecimal = '00';
  public bikeType;

  constructor(private alertCtrl: AlertController, private httpClient: HttpClient, private config: ConfigService, public viewCtrl: ViewController, public params: NavParams) {
    this.rideSeconds = params.get('rideSeconds');
    this.rideMinutes = params.get('rideMinutes');
    this.rideHours = params.get('rideHours');
    this.rideDistance = params.get('rideDistance');
    this.rideDistanceDecimal = params.get('rideDistanceDecimal');
    this.ridePath = params.get('ridePath');
    this.bikeType = params.get('bikeType');
    this.currentLatitude = this.ridePath[this.ridePath.length-1][0];
    this.currentLongitude = this.ridePath[this.ridePath.length-1][1];
  }
  public dismiss() {
    this.viewCtrl.dismiss();
  }
  public oneStar() {
    this.one = true;
    this.two = false;
    this.three = false;
    this.four = false;
    this.five = false;
  }
  public twoStar() {
    this.one = true;
    this.two = true;
    this.three = false;
    this.four = false;
    this.five = false;
  }
  public threeStar() {
    this.one = true;
    this.two = true;
    this.three = true;
    this.four = false;
    this.five = false;
  }
  public fourStar() {
    this.one = true;
    this.two = true;
    this.three = true;
    this.four = true;
    this.five = false;
  }
  public fiveStar() {
    this.one = true;
    this.two = true;
    this.three = true;
    this.four = true;
    this.five = true;
  }
  public done() {
    let rating = 0;
    if(this.five) {
      rating = 5;
    } else if(this.four) {
      rating = 4;
    } else if(this.three) {
      rating = 3;
    } else if(this.two) {
      rating = 2;
    } else if(this.one) {
      rating = 1;
    }
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.post(this.config.getAPILocation() + '/rating', {ride: localStorage.getItem('rideID'), rating: rating, comment: this.comment}, {headers: headers}).subscribe(data => {
      this.response = data;
      this.viewCtrl.dismiss();
      if(this.response.success==true) {
        this.viewCtrl.dismiss();
        console.log("rating");
      } else {
        console.log("error");
      }
    }, error => {
      this.viewCtrl.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Could not connect to server.',
        buttons: ['OK']
      });
      alert.present();
    })
  }
}
