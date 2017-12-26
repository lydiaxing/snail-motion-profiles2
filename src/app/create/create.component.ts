import { Component, OnInit, Injectable, Input, Output, EventEmitter } from '@angular/core';

import { Waypoint } from '../waypoint';
import { WaypointService } from '../waypoint.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { TableDataSource, ValidatorService } from 'angular4-material-table';

@Injectable()
export class WaypointValidatorService implements ValidatorService {
  getRowValidator(): FormGroup {
    return new FormGroup({
      'id': new FormControl(null, Validators.required),
      'name': new FormControl(),
      });
  }
}

@Component({
  selector: 'app-create',
  providers: [
    {provide: ValidatorService, useClass: WaypointValidatorService }
  ],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {
  waypoints: Waypoint[] = [];

  constructor(private waypointService: WaypointService, private waypointValidator: ValidatorService) { }

  displayedColumns = ['id', 'name', 'actionsColumn'];

  @Input() waypointList = [
    { id: 15, name: 'Mark'},
    { id: 50, name: 'Brad'},
    ] ;

  @Output() waypointListChange = new EventEmitter<Waypoint[]>();

  dataSource: TableDataSource<Waypoint>;

  ngOnInit() {
    this.dataSource = new TableDataSource<any>(this.waypointList, Waypoint, this.waypointValidator);
    this.dataSource.datasourceSubject.subscribe(waypointList => this.waypointListChange.emit(waypointList));
  }

  getWaypoints(): void {
    this.waypointService.getWaypoints()
      .subscribe(waypoints => this.waypoints = waypoints.slice(1, 5));
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.waypointService.addWaypoint({ name } as Waypoint)
      .subscribe(waypoint => {
        this.waypoints.push(waypoint);
      });
  }

  delete(waypoint: Waypoint): void {
    this.waypoints = this.waypoints.filter(h => h !== waypoint);
    this.waypointService.deleteWaypoint(waypoint).subscribe();
  }

}
