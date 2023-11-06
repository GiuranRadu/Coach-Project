import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/Services/player-service.service';
import { LoadingService } from 'src/app/Services/loading.service';



@Component({
  selector: 'add-players',
  templateUrl: './add-players.component.html',
  styleUrls: ['./add-players.component.css']
})
export class AddPlayersComponent implements OnInit {

  playersForm: FormGroup;
  @ViewChild('addedPlayer') addedPlayer: ElementRef;

  constructor(private route:Router, private playerService: PlayerService,  public dialog: MatDialog, private loadingService: LoadingService ){  }


  spinner:boolean ;

  testSpinner(){
    this.spinner = !this.spinner;     
    setTimeout(() => {
      this.spinner = !this.spinner;
    }, 1000)
  }

  ngOnInit(): void {
     this.playersForm = new FormGroup({
      id: new FormControl(this.generateRandomId()), 
      playerFullName: new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z ]{2,}$')]),
      age: new FormControl('',[Validators.required, this.ageRangeValidator]),
      salary: new FormControl('',[Validators.required]),
      goals: new FormControl('',[Validators.required]),
      continent: new FormControl('',[Validators.required]),
     });
  }



  redirect(){
    this.route.navigateByUrl('mainPage');
    
  }

  // .......................Register Function..................................

  async registerPlayer(){   

    const player = {
      id: this.playersForm.value.id,
      playerFullName: this.playersForm.value.playerFullName,
      age: this.playersForm.value.age,
      salary: this.playersForm.value.salary,
      goals: this.playersForm.value.goals,
      continent: this.playersForm.value.continent,
    };

    

    (await this.playerService.addNewPlayer(player)).subscribe(()=>{
      console.log('Added player');
      console.log(this.generateRandomId());
      this.playersForm.reset();
      this.addedPlayer.nativeElement.innerHTML = '&#10003 Player Added Successfully &#10003';
      this.addedPlayer.nativeElement.style.backgroundColor = '#bbb24b';
      this.testSpinner()
      setTimeout(() => {
        location.reload();
      }, 2000)
    }),

    (error)=>{
      console.log(error);
    }
  }

// .......................Generate Random Id Function..................................

  generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for(let i = 0; i < 6; i++){
      const randomIndex = Math.floor((Math.random() * charactersLength));
      result += characters.charAt(randomIndex);
    }
    return result;
  }

// .......................VALIDATORS..................................

  ageRangeValidator(control: AbstractControl): ValidationErrors  {
    const age = control.value;
    if ( age < 15 || age > 45) {
      return { ageRange: true };
    }
    return null;
  }


}
