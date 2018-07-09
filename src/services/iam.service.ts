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
    }
  }

  getTokens() {
    let data = "api_key=36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88&session_token=" + localStorage.getItem('token');
    return data;
  }
}
