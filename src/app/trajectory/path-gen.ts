import { Waypoint } from '../waypoint';
const {Matrix} = require('ml-matrix');
var math = require('mathjs');

/**
  see notes.txt under src/app/trajectory/notes.txt
**/

export class PathGenerator {
  waypoints: Waypoint[];
  waypoint1: Waypoint;
  waypoint2: Waypoint;
  pathPoints: PathPoint[] = [];
  sampleRate: number = .1; //gets new point every .1 meters

  constructor(waypoints: Waypoint[], callback: () => void) {
    this.waypoints = waypoints;
    //console.log("pathgen got the waypoints");
    this.waypoints.forEach(item => console.log(item));
    callback();
  }

  makePath(callback: () => void){
    //console.log("make path was called");
    var i;
    for (i = 0; i < this.waypoints.length - 1; i++) {
      //console.log(this.waypoints[i].id + ", " + this.waypoints[i+1].id);
      //ax^3 + bx^2 + cx + d
      var coeffs = this.makeMatrices(this.waypoints[i],this.waypoints[i+1]);
      this.createPathPoints(this.waypoints[i].x, this.waypoints[i+1].x, coeffs);
    }
    console.log("pathpoints")
    console.log(this.pathPoints);
    callback();
  }

  //[A][coeffs] = [B]
  makeMatrices(waypoint1: Waypoint, waypoint2: Waypoint){
    var A = new Matrix([
      [Math.pow(waypoint1.x, 3), Math.pow(waypoint1.x, 2), waypoint1.x, 1],
      [Math.pow(waypoint2.x, 3), Math.pow(waypoint2.x, 2), waypoint2.x, 1],
      [3*Math.pow(waypoint1.x, 2), 2*waypoint1.x, 1, 0],
      [3*Math.pow(waypoint2.x, 2), 2*waypoint2.x, 1, 0]
    ]);
    var B = new Matrix([
      [waypoint1.y],
      [waypoint2.y],
      [Math.tan(waypoint1.theta)],
      [Math.tan(waypoint2.theta)]
    ]);
    console.log("coeffs");
    console.log(A.pseudoInverse().mmul(B));
    return A.pseudoInverse().mmul(B);
  }

  createPathPoints(xpos1: number, xpos2: number, coeffs) {
    //console.log("from " + xpos1 + "to " + xpos2);
    var i;
    for (i = 0; i*this.sampleRate + xpos1 < xpos2; i++) {
      //console.log(i*this.sampleRate + xpos1);
      //ax^3 + bx^2 + cx + d
      var x = i*this.sampleRate + xpos1;
      var y = coeffs[0]*math.pow(x, 3) + coeffs[1]*math.pow(x, 2) + coeffs[2]*x + coeffs[3];
      this.pathPoints.push({x, y} as PathPoint);
    }
    //console.log("stop!");
  }
}

export class PathPoint {
  x: number;
  y: number;
}
