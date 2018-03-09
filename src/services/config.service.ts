import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  // simple config file to store data that can be easily changed

  api_location = "http://localhost:3000";

  constructor() {}

  getAPILocation() {
    return this.api_location;
  }
}