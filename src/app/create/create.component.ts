import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/table'
import { HttpClient } from '@angular/common/http';

import { Waypoint } from '../waypoint';
import { WaypointService } from '../waypoint.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { InMemoryDataService } from '../in-memory-data.service';

import { TableDataSource } from 'angular4-material-table';

@Component({
  selector: 'app-create',
  providers: [],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
  waypointService: WaypointService;
  waypoints: Waypoint[] = [];

  constructor(waypointService: WaypointService) {
    this.waypointService = waypointService;
  }

  displayedColumns = ['id', 'x', 'y', 'theta', 'actionsColumn'];

  @Input() waypointList = [
    { id: 0, x: 5, y: 6, theta: 2 }
  ];

  @Output() waypointListChange = new EventEmitter<Waypoint[]>();

  dataSource: TableDataSource<Waypoint>;

  ngOnInit() {
    this.dataSource = new TableDataSource<any>(this.waypointList, Waypoint);
    this.dataSource.datasourceSubject.subscribe(waypointList => this.waypointListChange.emit(waypointList));

    this.waypointListChange.asObservable().subscribe(data => {
      data.forEach(item => {
        this.waypointService.updateWaypoint({id: data.length, x: item.x, y: item.y, theta: item.theta} as Waypoint)
        .subscribe(waypoint => {
          this.waypoints.push(waypoint);
        })
      })
      this.waypointService.getWaypoints().subscribe(data => console.log(data));
    });
  }
}
