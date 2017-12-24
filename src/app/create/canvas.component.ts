import {
  Component, Input, ElementRef, AfterViewInit, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { Waypoint } from './waypoint';
//import { WaypointsService } from './waypoints.service';

import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-canvas',
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { border: 1px solid #000; }'],
  //providers: [WaypointsService]
})

export class CanvasComponent implements AfterViewInit {

  @ViewChild('canvas') private canvas: ElementRef;

  @Input() private width = 468;
  @Input() private height = 750;

  private cx: CanvasRenderingContext2D;
  private radius = 10;
  //public waypoints: Waypoint[] = [];

  constructor(
    //private waypointsService: WaypointsService
  ){}

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx =  canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.drawBackground(canvasEl);
    this.captureEvents(canvasEl);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    Observable
      .fromEvent(canvasEl, 'click')
      .subscribe((res: MouseEvent) => {
        const rect = canvasEl.getBoundingClientRect();

        const pos = {
          x: res.clientX - rect.left,
          y: res.clientY - rect.top
        };

        //this.waypoints.push(new Waypoint(pos.x, pos.y));
        //this.waypointsService.update(this.waypoints)
        this.drawWaypoint(pos);
      });
  }

  private drawWaypoint(pos: { x: number, y: number }) {
    if (!this.cx) { return; }
    this.cx.moveTo(pos.x, pos.y);
    this.cx.ellipse(pos.x, pos.y, this.radius, this.radius,  0, 0, 2 * Math.PI)
    this.cx.moveTo(pos.x - this.radius, pos.y);
    this.cx.lineTo(pos.x + this.radius, pos.y);
    this.cx.moveTo(pos.x, pos.y - this.radius);
    this.cx.lineTo(pos.x, pos.y + this.radius);
    this.cx.stroke();
  }

  private drawBackground(canvasEl: HTMLCanvasElement){
    var img = new Image();

    img.onload = function(){
       var cx =  canvasEl.getContext('2d');
       cx.drawImage(img,0,0);
    };
    img.src = 'assets/img/field.jpg';
  }
}
