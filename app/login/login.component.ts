import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  @ViewChild('forgotButton') forgotButton: ElementRef;
  resetInput: boolean = false;
  resetInputValue;
  allCoaches;
  selectedCoachEmail;
  selectedCoachId;
  showMessage: boolean = false;


  constructor(private authService: AuthService, private route: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('')
    })
    this.authService.getCoaches().subscribe((data) => {
      this.allCoaches = data;
      // console.log(this.allCoaches);
    })
  }

  forgot() {
    this.resetInput = !this.resetInput
    if (this.resetInput) {
      this.forgotButton.nativeElement.innerHTML = 'Maybe I remember'
    } else {
      this.forgotButton.nativeElement.innerHTML = 'Forgot Password'
    }
  }

  resetUser() {
    this.allCoaches.forEach(coach => {
      if (this.resetInputValue === coach.email) {
        this.selectedCoachId = coach.id;
        this.selectedCoachEmail = coach.email;
      }
    });
    if (this.selectedCoachEmail) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirmation',
          message: `Proceed deleting from database ? `
        }
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          this.authService.deleteCoach(this.selectedCoachId).then(() => {
            this.snackBar.open('Deleted! 🗑️', 'Close', {
              duration: 6000, // Time in milliseconds
            });
            this.resetInputValue = '';

          })
        } else {
          this.resetInputValue = '';
        }
      })
    } else {
      this.snackBar.open('No email found ❌', 'Close', {
        duration: 6000, // Time in milliseconds
      });
      this.resetInputValue = '';
    }
  }




  @ViewChild('shakeContainer') shakeContainer: ElementRef;
  startShake() {
    const shakeContainer = this.shakeContainer.nativeElement;
    shakeContainer.classList.add('shake');
    setTimeout(() => {
      shakeContainer.classList.remove('shake');
    }, 700);
  }

  @ViewChild('zoomInContainer') zoomInContainer: ElementRef;


  @ViewChild('submitButton') submitButton: ElementRef;

  async loginUser() {
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.login(email, password);
      console.log('user login successful');
      this.submitButton.nativeElement.innerHTML = '✅ Login Succes ✅'
      // Call startZoom and wait for it to complete
      await this.startZoom();

      this.route.navigate(['/mainPage']);
      setTimeout(() => {
        location.reload();
      }, 500);

    } catch (err) {
      this.snackBar.open('Invalid email or password. Please try again.', 'Dismiss', {
        duration: 7000,
      });
      this.startShake()
      this.loginForm.reset();
    }
  }

  // loginUser() {
  //   const { email, password } = this.loginForm.value;
  //   this.authService.login(email, password)
  //     .then(() => {
  //       console.log('user login successful');
  //       this.route.navigate(['/mainPage']);
  //       setTimeout(() => {
  //         location.reload();
  //       }, 500);
  //     })
  //     .catch((err) => {
  //       this.snackBar.open('Invalid email or password. Please try again.', 'Dismiss', {
  //         duration: 7000, // Duration in milliseconds
  //       });
  //       this.startShake()
  //       this.loginForm.reset();
  //     });
  // }

  async startZoom() {
    return new Promise<void>(resolve => {
      const zoomInContainer = this.zoomInContainer.nativeElement;
      zoomInContainer.classList.add('zoom');
      setTimeout(() => {
        zoomInContainer.classList.remove('zoom');
        resolve(); // Resolve the promise when animation completes
      }, 1500);
    });
  }

  // startZoom(){
  //   const zoomInContainer = this.zoomInContainer.nativeElement;
  //   zoomInContainer.classList.add('zoom');
  //   setTimeout(() => {
  //     zoomInContainer.classList.remove('zoom');
  //   }, 700);
  // }
}
