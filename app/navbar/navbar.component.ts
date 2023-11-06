import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { set } from '@angular/fire/database';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private route: Router, private auth: AuthService, public dialog: MatDialog) { }

  currentUser: any;
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe((data) => {
      this.currentUser = `${data['fname']}  ${data['lname']}`
      console.log(this.currentUser);      
    });

    this.auth.getCurrentUser().subscribe((data) => {
      this.isAdmin = data['isAdmin'];     
      console.log("Is admin: " + this.isAdmin);      
 
    });

    
  }

 

  logoutUser() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to Log Out ?'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {

        this.auth.logout().then(() => {
          console.log('Logged out');
          this.route.navigate(['info']);

        })
          .catch((err) => {
            console.log('Logout error', err);
          })
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    })

  }




}
