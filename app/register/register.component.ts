import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn }  from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  userForm: FormGroup;

  constructor(private authService: AuthService, private route: Router){

  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      fname: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z]{2,}$')]),
      lname: new FormControl('',[Validators.required, Validators.pattern('^[a-zA-Z]{2,}$')]),
      email: new FormControl('',[Validators.required, this.emailFormat]),
      age: new FormControl('',[Validators.required, this.ageRangeValidator]),
      password: new FormControl('', [Validators.required, this.passwordFormat]),
      confirmPassword: new FormControl('', [Validators.required]),     
      isAdmin: new FormControl(false),
      players: new FormControl([]),      
    },{
      validators: this.matchPassword
    })
  }

  async register(){
   const {fname, lname, email,age, password,isAdmin,players} = this.userForm.value;
   console.log(email)
   this.authService.register(fname, lname, email,age ,password, isAdmin ,players).then(()=>{
    console.log('coach added');
    this.userForm.reset();
    this.route.navigate(['/mainPage']);

   }).catch((err)=>{
    console.error('Error adding user', err)
   })
  }


  get fname(){
    return this.userForm.get('fname');
  }

  get lname(){
    return this.userForm.get('lname');
  }

  get email(){
    return this.userForm.get('email');
  }

  get age(){
    return this.userForm.get('age');
  }

  get password(){
    return this.userForm.get('password');
  }

  get confirmPassword(){
    return this.userForm.get('confirmPassword');
  }

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

  matchPassword : ValidatorFn = (control: AbstractControl):ValidationErrors|null => {
    let password = control.get('password');
    let confirmPassword = control.get('confirmPassword');
    if(password && confirmPassword && password?.value != confirmPassword?.value){
      return{
        passwordMatchError : true,
      }
    }
    return null
  }



   ageRangeValidator(control: AbstractControl): ValidationErrors  {
    const age = control.value;
    if ( age < 18 || age > 85) {
      return { ageRange: true };
    }
    return null;
  }
  

  // test(){
  //   console.log('testing');
   
  // }

}
