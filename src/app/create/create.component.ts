import { Component, OnInit, Injectable, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
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
import { PathGenerator } from '../trajectory/path-gen';

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

  pathGenerator: PathGenerator;

  constructor(public dialog: MatDialog, waypointService: WaypointService) {
    this.waypointService = waypointService;
  }

  displayedColumns = ['id', 'x', 'y', 'theta', 'actionsColumn'];

  @Input() waypointList = [ ];

  @Output() waypointListChange = new EventEmitter<Waypoint[]>();

  dataSource: TableDataSource<Waypoint>;

  ngOnInit() {
    this.dataSource = new TableDataSource<any>(this.waypointList, Waypoint);
    this.waypointList.forEach(waypoint => this.child.drawWaypoint(waypoint.x, waypoint.y));
    this.dataSource.datasourceSubject.subscribe(waypointList => {
      this.waypointListChange.emit(waypointList);
      console.log(waypointList);
      waypointList.forEach(item => {
        this.child.drawWaypoint(item.x, item.y)
        this.waypointService.updateWaypoint({id: waypointList.length - 1, x: item.x, y: item.y, theta: item.theta} as Waypoint)
        .subscribe(waypoint => {
          this.waypoints.push(waypoint);
          console.log("done");
        })
      })
    });
  }

  clear(): void{
    this.child.clear();
  }

  generate(): void {
    let dialogRef = this.dialog.open(GenerationDialog, {
      width: '250px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {})
    this.sendToGenerator();
  }

  sendToGenerator(): void{
    this.waypointService.getWaypoints().subscribe(response => {
      console.log(response);
      this.pathGenerator = new PathGenerator(response, () => console.log("makepathgenerator callback succeeded"));
      this.pathGenerator.makePath(() => console.log("makepath callback succeeded"));
    });
  }
}

@Component({
  selector: 'generate-dialog',
  templateUrl: 'generate-dialog.html',
})
export class GenerationDialog {

  constructor(
    public dialogRef: MatDialogRef<GenerationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}
