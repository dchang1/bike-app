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
import { BikeProfilePage } from '../pages/bike-profile/bike-profile';
import { EndRidePage } from '../pages/end-ride/end-ride';
import { ResetPage } from '../pages/reset/reset';

import { IAMService } from '../services/iam.service';
import { ConfigService } from '../services/config.service';

//QR scanner
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { QRScanner } from '@ionic-native/qr-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LandingPage,
    RegisterPage,
    RideHistoryPage,
    SettingsPage,
    BikeProfilePage,
    EndRidePage,
    ResetPage
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
    BikeProfilePage,
    EndRidePage,
    ResetPage
  ],
  providers: [
    IAMService,
    ConfigService,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    Geolocation,
    Diagnostic,
    QRScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
