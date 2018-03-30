import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  // simple config file to store data that can be easily changed

  api_location = "https://ft-hlee6.oraclecloud2.dreamfactory.com/api/v2";
  particle_api_location = "https://api.particle.io/oauth/token"
  constructor() {}

  getAPILocation() {
    return this.api_location;
  }

  getParticleAPILocation() {
    return this.particle_api_location;
  }
}
