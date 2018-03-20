import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  // simple config file to store data that can be easily changed

  api_location = "https://ft-hlee6.oraclecloud2.dreamfactory.com/api/v2";

  constructor() {}

  getAPILocation() {
    return this.api_location;
  }
}
