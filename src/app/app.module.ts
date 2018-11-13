import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { QRCodeModule } from 'angular2-qrcode';
import { AgmCoreModule } from '@agm/core';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { RegisterPage } from '../pages/register/register';
import { RideHistoryPage } from '../pages/ridehistory/ridehistory';
import { SettingsPage } from '../pages/settings/settings';
import { EndRidePage } from '../pages/end-ride/end-ride';
import { ResetPage } from '../pages/reset/reset';
import { SafetyPage } from '../pages/safety/safety';
import { ReportPage } from '../pages/report/report';

import { IAMService } from '../services/iam.service';
import { ConfigService } from '../services/config.service';

//QR scanner
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Deeplinks } from '@ionic-native/deeplinks';
import { BLE } from '@ionic-native/ble';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LandingPage,
    RegisterPage,
    RideHistoryPage,
    SettingsPage,
    EndRidePage,
    ResetPage,
    SafetyPage,
    ReportPage
  ],
  imports: [
    BrowserModule,
    QRCodeModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md'
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA0AHHZf_YsX00Iz1od2uMyeA5SlSxWXic'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LandingPage,
    RegisterPage,
    RideHistoryPage,
    SettingsPage,
    EndRidePage,
    ResetPage,
    SafetyPage,
    ReportPage
  ],
  providers: [
    IAMService,
    ConfigService,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Geolocation,
    Diagnostic,
    ScreenOrientation,
    Deeplinks,
    BLE,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
