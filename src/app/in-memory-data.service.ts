import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const waypoints = [
      //{ id: 0, x: 1, y: 2, theta: 3 }
    ];
    const settings = [
      { id: 0, wheelbase_width: 0, max_vel: 1, max_accel: 2 }
    ];
    return {waypoints, settings};
  }
}
