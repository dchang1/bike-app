import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../services/config.service';
import { NavController, AlertController } from 'ionic-angular';

@Injectable()
export class IAMService {

  constructor(private httpClient: HttpClient, private config: ConfigService) {}

  // set the current user in localStorages
  setCurrentUser(data) {
    if (data == null) {
      console.log("logged out");
      localStorage.clear();
    } else {
      localStorage.setItem('firstName', data.first_name);
      localStorage.setItem('lastName', data.last_name);
      localStorage.setItem('name', data.name);
      localStorage.setItem('token', data.session_token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('session', "true");
      localStorage.setItem('userID', data.id);
    }
  }

  // retrieve the current user from localStorage
  getCurrentSession() {
    this.httpClient.put(this.config.getAPILocation() + '/user/session?session_token=' + localStorage.getItem('token') + "&api_key=36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88").subscribe(data => {
      localStorage.setItem('token', data.session_token);
      console.log("here");
      return true;
    }, error => {
      console.log("invalid session");
      return false;
    }
  )}

  getParticleToken() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let body = "grant_type=password&client_id=app-3617&client_secret=5244c2ed81bb4873de96bd82ffaa5f44de3384f2&username=hlee6%40swarthmore.edu&password=bikebike";
    this.httpClient.post("https://api.particle.io/oauth/token", body, {headers: headers}).subscribe(data => {
      localStorage.setItem('particleToken', data.access_token);
      console.log("particle");
      console.log(localStorage.getItem('particleToken'));
      return true;
    }, error => {
      console.log("invalid particle");
      return false;
    }
  )}

  getTokens() {
    let data = "api_key=36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88&session_token=" + localStorage.getItem('token');
    return data;
  }
}
