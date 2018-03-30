import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { NavController, Slides, LoadingController, AlertController } from 'ionic-angular';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html'
})
export class HelpPage {
  @ViewChild(Slides) slides: Slides;

  constructor(private navCtrl: NavController) {}
  ngOnInit() {
    // lock the slides so the user can't swipe them
    this.slides.lockSwipes(true);
  }
  back() {
    if(this.slides.getActiveIndex()==0) {
      console.log("home");
      this.navCtrl.setRoot(HomePage);
    } else {
      console.log("here");
      this.slides.slidePrev();
    }
  }
}
