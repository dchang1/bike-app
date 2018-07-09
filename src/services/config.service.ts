import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  // simple config file to store data that can be easily changed
  api_location = "http://localhost:3000";
  //api_location = "http://renecycle-env.av7huk4ush.us-west-2.elasticbeanstalk.com";
  particle_api_location = "https://api.particle.io/oauth/token"
  constructor() {}

  getAPILocation() {
    return this.api_location;
  }

  getParticleAPILocation() {
    return this.particle_api_location;
  }
}
