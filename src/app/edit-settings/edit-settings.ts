import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'edit-settings',
  templateUrl: 'edit-settings.html'
})
export class EditSettings {

  wheelbase_width: number = 1.2;
  max_vel: number = 18;
  max_accel: number = 4;

  result:{
    wheelbase_width: number;
    max_vel: number;
    max_accel: number;
  }

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    let dialogRef = this.dialog.open(EditSettingsDialog, {
      width: '250px',
      data: { wheelbase_width: this.wheelbase_width, max_vel: this.max_vel, max_accel: this.max_accel }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.wheelbase_width = result.wheelbase_width;
      this.max_vel = result.max_vel;
      this.max_accel = result.max_accel;
      //console.log(result);
    });
  }

}

@Component({
  selector: 'edit-settings-dialog',
  templateUrl: 'edit-settings-dialog.html',
})
export class EditSettingsDialog {

  constructor(
    public dialogRef: MatDialogRef<EditSettingsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
