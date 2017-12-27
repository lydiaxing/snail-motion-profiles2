import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';

import { Waypoint } from '../waypoint';
import { WaypointService } from '../waypoint.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { TableDataSource } from 'angular4-material-table';

@Component({
  selector: 'app-create',
  providers: [ ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
  waypoints: Waypoint[] = [];

  constructor(private waypointService: WaypointService) { }

  displayedColumns = ['id', 'x', 'y', 'theta', 'actionsColumn'];

  @Input() waypointList = [
    { id: 15, x: 5, y: 6, theta: 2},
    { id: 50, x: 3, y: 3, theta: 1},
    ] ;

  @Output() waypointListChange = new EventEmitter<Waypoint[]>();

  dataSource: TableDataSource<Waypoint>;

  ngOnInit() {
    this.dataSource = new TableDataSource<any>(this.waypointList, Waypoint);
    this.dataSource.datasourceSubject.subscribe(waypointList => this.waypointListChange.emit(waypointList));
  }

  getWaypoints(): void {
    this.waypointService.getWaypoints()
      .subscribe(waypoints => this.waypoints = waypoints.slice(1, 5));
  }

  add(x: number, y: number, theta: number): void {
    //name = name.trim();
    //if (!name) { return; }
    this.waypointService.addWaypoint({ id: 15, x: x, y: y, theta: theta} as Waypoint)
      .subscribe(waypoint => {
        this.waypoints.push(waypoint);
      });
  }

  delete(waypoint: Waypoint): void {
    this.waypoints = this.waypoints.filter(h => h !== waypoint);
    this.waypointService.deleteWaypoint(waypoint).subscribe();
  }

}
