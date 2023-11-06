import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  updatedUserDetails: FormGroup;


  constructor(private firestore: Firestore, private auth: AuthService, private snackBar: MatSnackBar) { }

  currentUser: {
    fname: string,
    lname: string,
    email: string,
    age: number,
    password: string,
    confirmPassword: string,
  };

  ngOnInit(): void {
    this.updatedUserDetails = new FormGroup({
      fname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]{2,}$')]),
      lname: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]{2,}$')]),
      email: new FormControl('', [Validators.required, this.emailFormat]),
      age: new FormControl('', [Validators.required, this.ageRangeValidator]),
      password: new FormControl('', [Validators.required, this.passwordFormat]),
      confirmPassword: new FormControl('', Validators.required),
    })

    this.auth.getCurrentUser().subscribe((data) => {
      this.currentUser = {
        fname: data['fname'],
        lname: data['lname'],
        email: data['email'],
        age: data['age'],
        password: data['password'],
        confirmPassword: data['password']
      };
    })
  }



  // -- Switch between Show Info and Update Info --
  Switch: boolean = true;

  showCurrentInfo() {
    console.log(this.currentUser.password);
    const passwordPrompt = prompt('To confirm it is you, Re-enter password:');
    if(passwordPrompt ===  this.currentUser.password){
      this.updatedUserDetails.setValue({
        fname: this.currentUser['fname'],
        lname: this.currentUser['lname'],
        email: this.currentUser['email'],
        age: this.currentUser['age'],
        password: this.currentUser['password'],
        confirmPassword: this.currentUser['password']
      });
      this.Switch = false;
    }else{
      console.log('wrong password');
      this.snackBar.open('WRONG PASSWORD❌', 'Close', {  
        duration: 3000, // Time in milliseconds
      });
    }    
  }


  async updateInfo() {
    console.log(this.currentUser);
    console.log(this.updatedUserDetails.valid);
    console.log(this.updatedUserDetails.value);
    (await this.auth.updateProfile(this.currentUser['id'], this.updatedUserDetails.value)).subscribe(()=>{
      this.updatedUserDetails.reset();
    })
    this.Switch = true;
    this.snackBar.open('Details Updated Successfully ✅', 'Close', {  
      duration: 3000, // Time in milliseconds
    });
  }




  // ------------Cancel button ------------
  cancel() {
    this.updatedUserDetails.reset();
    this.Switch = true;
    this.snackBar.open('Nothing changed!', 'Close', {  
      duration: 3000, // Time in milliseconds
    });
  }


  // ------------VALIDATORS ------------
  emailFormat(control: FormControl) {
    let myRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!myRegex.test(control.value)) {
      // validMail = VALIDATOR!!!!! 
      return { validMail: true }
    }
    return null;
  }

  passwordFormat(control: FormControl) {
    let myRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!myRegex.test(control.value)) {
      // validPassword = VALIDATOR!!!!! 
      return { validPassword: true }
    }
    return null;
  }

  ageRangeValidator(control: AbstractControl): ValidationErrors {
    const age = control.value;
    if (age < 18 || age > 85) {
      return { ageRange: true };
    }
    return null;
  }


}
