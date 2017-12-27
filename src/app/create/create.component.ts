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
  //dataChange: BehaviorSubject<Waypoint[]> = new BehaviorSubject<Waypoint[]>([]);
  //get data(): Waypoint[] { return this.dataChange.value; }
  //exampleDatabase = new ExampleDatabase();
  //dataSource: ExampleDataSource | null;
  waypointService: WaypointService;
  //dataStream: Observable<Waypoint>;


  waypoints: Waypoint[] = [];

  constructor(waypointService: WaypointService) {
    this.waypointService = waypointService;
  }

  displayedColumns = ['id', 'x', 'y', 'theta', 'actionsColumn'];

  @Input() waypointList = [
    { id: 15, x: 5, y: 6, theta: 2 },
    { id: 50, x: 3, y: 3, theta: 1 },
  ];

  @Output() waypointListChange = new EventEmitter<Waypoint[]>();

  dataSource: TableDataSource<Waypoint>;

  ngOnInit() {
    //console.log(this.waypoints);
    this.dataSource = new TableDataSource<any>(this.waypointList, Waypoint);
    this.dataSource.datasourceSubject.subscribe(waypointList => this.waypointListChange.emit(waypointList));
    this.waypointListChange.asObservable().subscribe(data => {
      data.forEach(item => {
        this.waypointService.updateWaypoint(item as Waypoint)
        .subscribe(waypoint => {
          this.waypoints.push(waypoint);
        })
      })
      /**this.waypointService.updateWaypoints(data as Waypoint[])
      .subscribe(waypoints => {
        this.waypoints.push(waypoints);
      });**/
      this.waypointService.getWaypoints().subscribe(data => console.log(data));
    });
      /**{ data
      .forEach(item => {
        this.waypointService.addWaypoint(item as Waypoint)
        .subscribe(waypoint => {
          this.waypoints.push(waypoint);
        })
      });
    });**/
  }

  getWaypoints(): void {
    this.waypointService.getWaypoints()
      .subscribe(waypoints => this.waypoints = waypoints.slice(1, 5));
  }

  add(params: any): void {
    //x: number, y: number, theta: number
    //name = name.trim();
    //if (!name) { return; }
    this.dataSource.createNew();
    //console.log(this.waypointList);



    //console.log(this.waypointList);

    //this.update(5);

  }

  delete(waypoint: Waypoint): void {
    this.waypoints = this.waypoints.filter(h => h !== waypoint);
    this.waypointService.deleteWaypoint(waypoint).subscribe();
  }

  edit(params: any) {
    params.confirmEditCreate()
    //console.log(params);
  }

  update(params: any){
    this.waypointService.addWaypoint({ id: 3, x: 5, y: 4, theta: 2} as Waypoint)
      .subscribe(waypoint => {
        this.waypoints.push(waypoint);
      });
  }

}
