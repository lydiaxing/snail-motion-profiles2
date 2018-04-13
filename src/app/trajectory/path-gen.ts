import { Waypoint } from '../waypoint';
const {Matrix} = require('ml-matrix');
var math = require('mathjs');
var FileSaver = require('file-saver');

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
    console.log("pathgen got the waypoints");
    this.waypoints.forEach(item => console.log(item));
    console.log("--------------------------")
    callback();
  }

  makePath(callback: () => void){
    //console.log("make path was called");
    var i;
    for (i = 0; i < this.waypoints.length - 1; i++) {
      //console.log(this.waypoints[i].id + ", " + this.waypoints[i+1].id);
      //ax^3 + bx^2 + cx + d
      var coeffs = this.makeMatrices(this.waypoints[i],this.waypoints[i+1]);
      //console.log("coeffs ");
      //console.log(typeof(coeffs[3]*1));
      this.createPathPoints(this.waypoints[i].x, this.waypoints[i+1].x, coeffs);
    }
    var blob = new Blob([JSON.stringify(this.pathPoints)], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "trajectory.txt");
    //console.log("pathpoints: ")
    //console.log(this.pathPoints);
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
      [Math.tan(waypoint1.theta * Math.PI/180)],
      [Math.tan(waypoint2.theta * Math.PI/180)]
    ]);
    console.log("B");
    console.log(B);
    console.log("--------------------------");
    console.log("coeffs");
    console.log("--------------------------");
    /**console.log("coeffs");
    console.log(A.pseudoInverse().mmul(B));
    console.log("A");
    console.log(A)
    console.log("B");
    console.log(B);
    console.log("A inverse");
    console.log(A.pseudoInverse())**/
    return A.pseudoInverse().mmul(B);
  }

  createPathPoints(xpos1: number, xpos2: number, coeffs) {
    //console.log("from " + xpos1 + "to " + xpos2);
    var i;
    if(xpos1 < xpos2){
      //console.log("xpos1 < xpos2" + " xpos1: " + xpos1 + " xpos2: " + xpos2);
      for (i = 0; i*this.sampleRate + xpos1 < xpos2; i++) {
        var x = i*this.sampleRate + xpos1;
        var a = coeffs[0]*math.pow(x, 3);
        var b = coeffs[1]*math.pow(x, 2);
        var c = coeffs[2]*x;
        var d = coeffs[3]*1;
        var y = a+b+c+d;
        this.pathPoints.push({x, y} as PathPoint);
      }
    }else if(xpos2 < xpos1){
      //console.log("xpos1 > xpos2" + " xpos1: " + xpos1 + " xpos2: " + xpos2);
      for (i = 0; xpos1 - i*this.sampleRate > xpos2; i++) {
        //console.log("xpos1 - i*this.sampleRate: " + (xpos1 - i*this.sampleRate));
        var x = xpos1 - i*this.sampleRate;
        var a = coeffs[0]*math.pow(x, 3);
        var b = coeffs[1]*math.pow(x, 2);
        var c = coeffs[2]*x;
        var d = coeffs[3]*1;
        var y = a+b+c+d;
        this.pathPoints.push({x, y} as PathPoint);
      }
    }
  }
}

export class PathPoint {
  x: number;
  y: number;
}
