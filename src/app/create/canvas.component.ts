import {
  Component, Input, ElementRef, AfterViewInit, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Waypoint } from '../waypoint';
import { WaypointService } from '../waypoint.service';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-canvas',
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { border: 1px solid #000; }'],
  providers: []
})

export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas') private canvas: ElementRef;

  @Input() private width = 468;
  @Input() private height = 750;

  private fieldwidth = 10; //meters
  private fieldheight = 20; //meters

  private metersToPxW = this.width/this.fieldwidth;
  private metersToPxH = this.height/this.fieldheight;

  private cx: CanvasRenderingContext2D;
  private radius = 10;
  public waypoints: Waypoint[] = [];

  constructor(
    private waypointService: WaypointService
  ) { }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 2;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.drawBackground(canvasEl);
  }

  private drawWaypoint(xpos: number, ypos: number) {
    var x = xpos*this.metersToPxW;
    var y = this.height - ypos*this.metersToPxH;
    console.log("called drawWaypoint" + x + "ypos" + y);
    if (!this.cx) { return; }
    this.cx.moveTo(x, y);
    this.cx.ellipse(x, y, this.radius, this.radius, 0, 0, 2 * Math.PI)
    this.cx.moveTo(x - this.radius, y);
    this.cx.lineTo(x + this.radius, y);
    this.cx.moveTo(x, y - this.radius);
    this.cx.lineTo(x, y + this.radius);
    this.cx.stroke();
  }

  private drawBackground(canvasEl: HTMLCanvasElement) {
    var img = new Image();

    img.onload = function() {
      var cx = canvasEl.getContext('2d');
      cx.drawImage(img, 0, 0);
    };
    img.src = 'assets/img/field.jpg';
  }

  private clear(){
    this.drawBackground(this.canvas.nativeElement);
    this.waypoints.forEach(waypoint => this.drawWaypoint(waypoint.x, waypoint.y));
  }

  private redraw(waypoints: Waypoint[]){
    console.log("i got the waypoints" + waypoints.entries().next());
    this.waypoints = waypoints;
    waypoints.forEach(waypoint => this.drawWaypoint(waypoint.x, waypoint.y));
  }
}
