import { Component, OnInit, Injectable, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/table'
import { HttpClient } from '@angular/common/http';

import { Waypoint } from '../waypoint';
import { WaypointService } from '../waypoint.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { InMemoryDataService } from '../in-memory-data.service';

import { TableDataSource } from 'angular4-material-table';
import { CanvasComponent } from './canvas.component';

@Component({
  selector: 'app-create',
  providers: [],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
  @ViewChild(CanvasComponent) child;

  waypointService: WaypointService;
  waypoints: Waypoint[] = [];

  constructor(waypointService: WaypointService) {
    this.waypointService = waypointService;
  }

  displayedColumns = ['id', 'x', 'y', 'theta', 'actionsColumn'];

  @Input() waypointList = [
    { id: 0, x: 1, y: 2, theta: 3 }
  ];

  @Output() waypointListChange = new EventEmitter<Waypoint[]>();

  dataSource: TableDataSource<Waypoint>;

  ngOnInit() {
    this.dataSource = new TableDataSource<any>(this.waypointList, Waypoint);
    this.dataSource.datasourceSubject.subscribe(waypointList => {
      this.waypointListChange.emit(waypointList);
      console.log(waypointList);
      waypointList.forEach(item => {
        this.child.drawWaypoint(item.x, item.y);
        this.waypointService.updateWaypoint({id: waypointList.length - 1, x: item.x, y: item.y, theta: item.theta} as Waypoint)
        .subscribe(waypoint => {
          this.waypoints.push(waypoint);
        })
      })
    });
  }
}
