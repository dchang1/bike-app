import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage implements OnInit {
  @ViewChild(Slides) slides: Slides;
  public response: any = {};

  constructor(private navCtrl: NavController, private loadingCtrl: LoadingController, private httpClient: HttpClient, private alertCtrl: AlertController, private config: ConfigService, private iam: IAMService) {}

  ngOnInit() {
    // lock the slides so the user can't swipe them
    this.slides.lockSwipes(true);
  }
  next() {
    // unlock slides temporarily so we can manually move them
    this.slides.lockSwipes(false);

    // if we are on the first slide, attempt to verify access code
    if (this.slides.getActiveIndex() == 0) {
      this.slides.slideNext();
      /*
      // if the input isn't blank
      if (this.access_code) {
        // clear error message
        this.error_message = "";

        // display loading
        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });
        loading.present();

        // make request to verify access code
        this.httpClient.post(this.config.getAPILocation() + '/accessCodes', {code: this.access_code}, {responseType: 'text'}).subscribe(data => {
          loading.dismiss();

          // if the response is what we want, move to next part of signup
          if (data == "valid code") {
            this.slides.slideNext();
          } else {
            // otherwise, display error message
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'Your access code was not valid.',
              buttons: ['OK']
            });
            alert.present();
          }
          this.slides.lockSwipes(true);
        });
      } else {
        this.error_message = "Please fill out all fields";
      }*/
    }
  }
  /*
  back() {
    if(this.slides.getActiveIndex()==0) {
      console.log("home");
      this.navCtrl.setRoot(HomePage);
    } else {
      console.log("here");
      this.slides.slidePrev();
    }
  }
  getBikeData() {
    this.httpClient.get(this.config.getAPILocation() + '/rock/_table/bikeList?fields=*&filter=bikeNumber%20=%20%27' + "731053" + "%27&" + this.iam.getTokens()).subscribe(data => {
      this.response = data;
      localStorage.setItem('bike', JSON.stringify(this.response.resource[0]));
      console.log(JSON.parse(localStorage.getItem('bike')));
      console.log(JSON.parse(localStorage.getItem('bike')).id);
    })
  }
  getCampus() {
    let headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    console.log(localStorage.getItem('token'));
    console.log(headers);
    this.httpClient.get(this.config.getAPILocation() + '/user/campus', {headers: headers}).subscribe(data => {
      console.log(data);
    })
  }

  newRide() {
    let rideID = (Math.random()*0xFFFFFFFFFF<<0).toString(16);
    console.log(rideID);
    let body = {
      "resource": [
        {
          "id": rideID.toString(),
          "userId": localStorage.getItem('userID'),
          "bikeId": JSON.parse(localStorage.getItem('bike')).id
        }
      ]
    }
    this.httpClient.post(this.config.getAPILocation() + '/rock/_table/rideList?' + this.iam.getTokens(), body).subscribe(data => {
      this.response = data;
      localStorage.setItem('rideID', this.response.resource[0].id);
      console.log(JSON.parse(localStorage.getItem('geofence')));
      console.log(JSON.parse(localStorage.getItem('bike')).id);
    })
  }

  unlockBike() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let body = "arg=" + localStorage.getItem('rideID') + "&access_token=" + localStorage.getItem('particleToken');
    console.log(body);
    console.log("lockID", JSON.parse(localStorage.getItem('bike')).lockId);
    this.httpClient.post("https://api.particle.io/v1/devices/" + JSON.parse(localStorage.getItem('bike')).lockId + "/unlock", body, {headers: headers}).subscribe(data => {
      console.log(data);
      localStorage.setItem('inRide', "true");
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Bike is unlocked',
        subTitle: 'Begin riding!',
        buttons: ['OK']
      });

    }, error => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Did not unlock bike',
        buttons: ['OK']
      });
      alert.present();
    })
  }
  */
}
