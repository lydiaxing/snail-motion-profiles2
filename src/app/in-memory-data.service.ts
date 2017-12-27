/**import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const waypoints = [
      { id: 11, x: 5, y: 6, theta: 90 },
      { id: 11, x: 5, y: 7, theta: 90 },
      { id: 11, x: 5, y: 8, theta: 90 }
    ];
    return {waypoints};
  }
}
**/

import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const waypoints = [
      { id: 11, x: 5, y: 6, theta: 90 },
      { id: 11, x: 5, y: 7, theta: 90 },
      { id: 11, x: 5, y: 8, theta: 90 }
    ];
    return {waypoints};
  }

}
