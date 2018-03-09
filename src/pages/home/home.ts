import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';

import { ConfigService } from '../../services/config.service';
import { IAMService } from '../../services/iam.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  constructor(private httpClient: HttpClient, private config: ConfigService, private iam: IAMService) {
  }
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    });
  }
}
