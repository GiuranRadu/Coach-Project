import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, doc } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-see-all-coaches',
  templateUrl: './see-all-coaches.component.html',
  styleUrls: ['./see-all-coaches.component.css']
})
export class SeeAllCoachesComponent implements OnInit {
  allCoaches: any;
  selectedCoach:any;
  selectedCoachId:any;
  showMessage:boolean;
  constructor(private auth: AuthService, private snackBar: MatSnackBar, public dialog: MatDialog , private route:Router) {
  }

  updatedUserDetails: FormGroup;


  async ngOnInit(): Promise<void> {

    this.updatedUserDetails = new FormGroup({
      fname: new FormControl(''),
      lname: new FormControl(''),
      email: new FormControl(''),
      age: new FormControl(''),
      password : new FormControl(''),
      isAdmin: new FormControl(''),
      players: new FormControl('')
    })

    //------ WHY ?? -------------
    // (await this.auth.getAllCoachesIfAdmin()).subscribe((usersFromService)=>{
    //   this.allCoaches = usersFromService;
    //   console.log(this.allCoaches);
    // })  

    this.auth.getCoaches().subscribe((data) => {
      this.allCoaches = data;
      // console.log(this.allCoaches);
    })
  }
  
  test(){
    console.log(this.allCoaches);
  }
  


  deleteCoach(coachId: any) {
    console.log(coachId);
    if (window.confirm('Are you sure you want to delete this coach?')) {
      this.auth.deleteCoach(coachId).then(() => {
        console.log('delete successfully');
      })
    }
  }



  // Here we are displaying the current coach information
  Switch = false;
  displayInfo(coachId: any) {
    // console.log(coachId);
    this.Switch = true;
    this.selectedCoachId = coachId;
    const selectedCoach = this.allCoaches.find(coach => coach.id === coachId);
    this.selectedCoach = selectedCoach;
    console.log(this.selectedCoach);
    //Asta de jos imi face campul "disabled" si nu-mi permite sa mai trimi datele din email
    // this.updatedUserDetails.get('email').disable();


    this.updatedUserDetails.setValue({
      fname: this.selectedCoach.fname,
      lname: this.selectedCoach.lname,
      email: this.selectedCoach.email,
      age: this.selectedCoach.age,
      password: this.selectedCoach.password,
      isAdmin: this.selectedCoach.isAdmin,
      players: this.selectedCoach.players
    });
  }


  cancel(){
    this.updatedUserDetails.reset();
    this.Switch = false;
    this.snackBar.open('Nothing changed!', 'Close', {  
      duration: 2000, // Time in milliseconds
    });
    console.log(this.updatedUserDetails.value);

  }


  
  update() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation',
        message: `Are you sure you want to update? `
      }
    });

    dialogRef.afterClosed().subscribe(async result=>{
      if(result){
        this.auth.editCoach(this.updatedUserDetails.value, this.selectedCoachId).then(()=>{
          console.log('Coach updated successfully');
          this.updatedUserDetails.reset();
          this.snackBar.open('Changes Saved! ✅', 'Close', {  
            duration: 2000, // Time in milliseconds
          });
          this.Switch = false;

        })
      }
    })   
  }


  redirect(){
    this.route.navigateByUrl('only-admin');
  }


}
