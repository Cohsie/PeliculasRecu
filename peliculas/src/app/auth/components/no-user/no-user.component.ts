import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-no-user',
  templateUrl: './no-user.component.html',
  styleUrls: ['./no-user.component.scss']
})
export class NoUserComponent {


  constructor(
    public dialogRef: MatDialogRef<NoUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
