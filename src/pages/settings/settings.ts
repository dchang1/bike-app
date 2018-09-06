import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { Navbar, NavController, Slides, LoadingController, AlertController } from 'ionic-angular';
import { ConfigService } from '../../services/config.service';

import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Navbar) navBar: Navbar;
  firstName = "";
  lastName = "";
  email = "";
  campus = "";
  campuses: Array<string>;
  password: string;
  new_password1: string;
  new_password2: string;
  error_message: string;
  public response: any = {};
  constructor(private navCtrl: NavController, private httpClient: HttpClient, private config: ConfigService) {}

  ngOnInit() {
    // lock the slides so the user can't swipe them
    this.slides.lockSwipes(true);
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
    this.email = localStorage.getItem('email');
    this.campus = localStorage.getItem('campus');
    this.campuses = new Array<string>();
    this.campuses.push("Swarthmore");
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      if(this.slides.getActiveIndex() == 0) {
        this.navCtrl.pop();
      } else {
        this.slides.lockSwipes(false);
        this.slides.slideTo(0, 0);
        this.slides.lockSwipes(true);
      }
    }
  }

  back() {
    if(this.slides.getActiveIndex() == 0) {
      this.navCtrl.pop();
    } else {
      this.slides.lockSwipes(false);
      this.slides.slideTo(0, 0);
      this.slides.lockSwipes(true);
    }
  }

  public updateFirstNamePage() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1, 0);
    this.slides.lockSwipes(true);
  }

  public updateLastNamePage() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(2, 0);
    this.slides.lockSwipes(true);
  }

  public updateEmailPage() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(3, 0);
    this.slides.lockSwipes(true);
  }

  public updateCampusPage() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(4, 0);
    this.slides.lockSwipes(true);
  }

  public verifyPasswordPage() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(5, 0);
    this.slides.lockSwipes(true);
  }

  public verify() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.post(this.config.getAPILocation() + '/verify', {password: this.password}, {headers: headers}).subscribe(data => {
      this.response = data;
      if(this.response.success==true) {
        this.error_message = "";
        this.slides.lockSwipes(false);
        this.slides.slideTo(6, 0);
        this.slides.lockSwipes(true);
        this.password = "";
      } else {
        this.error_message = this.response.message;
      }
    });
  }

  public updateFirstName() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    if(this.firstName==localStorage.getItem('firstName')) {
      this.error_message = "";
      this.slides.lockSwipes(false);
      this.slides.slideTo(0, 0);
      this.slides.lockSwipes(true);
    } else {
      this.httpClient.post(this.config.getAPILocation() + '/updateFirstName', {firstName: this.firstName}, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.success==true) {
          this.error_message = "";
          this.slides.lockSwipes(false);
          this.slides.slideTo(0, 0);
          this.slides.lockSwipes(true);
          localStorage.setItem('firstName', this.firstName);
        } else {
          this.error_message = this.response.message;
        }
      });
    }
  }

  public updateLastName() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    if(this.lastName==localStorage.getItem('lastName')) {
      this.error_message = "";
      this.slides.lockSwipes(false);
      this.slides.slideTo(0, 0);
      this.slides.lockSwipes(true);
    } else {
      this.httpClient.post(this.config.getAPILocation() + '/updateLastName', {lastName: this.lastName}, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.success==true) {
          this.error_message = "";
          this.slides.lockSwipes(false);
          this.slides.slideTo(0, 0);
          this.slides.lockSwipes(true);
          localStorage.setItem('lastName', this.lastName);
        } else {
          this.error_message = this.response.message;
        }
      });
    }
  }

  public updateEmail() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    if(this.email==localStorage.getItem('email')) {
      this.error_message = "";
      this.slides.lockSwipes(false);
      this.slides.slideTo(0, 0);
      this.slides.lockSwipes(true);
    } else {
      this.httpClient.post(this.config.getAPILocation() + '/updateEmail', {email: this.email}, {headers: headers}).subscribe(data => {
        this.response = data;
        if(this.response.success==true) {
          this.error_message = "";
          this.slides.lockSwipes(false);
          this.slides.slideTo(0, 0);
          this.slides.lockSwipes(true);
          localStorage.setItem('email', this.email);
        } else {
          this.error_message = this.response.message;
        }
      });
    }
  }

  public updateCampus() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0, 0);
    this.slides.lockSwipes(true);
  }

  public updatePassword() {
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
    this.httpClient.post(this.config.getAPILocation() + '/updatePassword', {newPassword: this.new_password1, confirmNewPassword: this.new_password2}, {headers: headers}).subscribe(data => {
      this.response = data;
      if(this.response.success==true) {
        this.error_message = "";
        this.slides.lockSwipes(false);
        this.slides.slideTo(0, 0);
        this.slides.lockSwipes(true);
        this.new_password1 = "";
        this.new_password2 = "";
      } else {
        this.error_message = this.response.message;
      }
    });
  }
}
