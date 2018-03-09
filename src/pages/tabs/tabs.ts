import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../../pages/home/home';
/*import { LocationsPage } from '../../pages/locations/locations';
import { HistoryPage } from '../../pages/history/history';
*/
import { LandingPage } from '../../pages/landing/landing';

import { IAMService } from '../../services/iam.service';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;

  constructor(private navCtrl: NavController, private iam: IAMService) {}

  logout() {
    // remove the user from localStorage and move them to the landing page
    this.iam.setCurrentUser(null);
    this.navCtrl.setRoot(LandingPage);
  }
}
