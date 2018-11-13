import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';

@Component({
  selector: 'page-safety',
  templateUrl: 'safety.html'
})
export class SafetyPage {
  constructor(private viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss({"unlock": false});
  }

  unlock() {
    console.log("unlock");
    this.viewCtrl.dismiss({"unlock": true});
  }
}
