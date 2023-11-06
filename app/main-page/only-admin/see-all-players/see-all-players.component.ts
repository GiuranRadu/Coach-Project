import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { EditPlayersService } from 'src/app/Services/edit-players.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-see-all-players',
  templateUrl: './see-all-players.component.html',
  styleUrls: ['./see-all-players.component.css']
})
export class SeeAllPlayersComponent implements OnInit {

  //Ca sa afisez doar ceilalti antrenori, trebuie sa mai fac o variabila cu loggedUser, si la array-ul de allCoaches ii dau splice de loggedUser. Si asa afisam doar ceilalti antrenori.
  allCoaches: any;
  selectedCoachId: any;
  updatedPlayerDetails: FormGroup;
  selectedPlayer: any;
  allPlayers: any;

  constructor(private auth: AuthService, private route: Router, private snackBar: MatSnackBar, public dialog: MatDialog, private editAndDelete: EditPlayersService) {

  }

  async ngOnInit(): Promise<void> {

    this.updatedPlayerDetails = new FormGroup({
      playerFullName: new FormControl(''),
      age: new FormControl(''),
      salary: new FormControl(''),
      goals: new FormControl(''),
      continent: new FormControl(''),
      id: new FormControl(''),
    });


    this.auth.getCoaches().subscribe((data) => {
      this.allCoaches = data;
    });
  }



  // ----------- DELETE button which deletes any player selected  -----------  
  async deletePlayer(coachId: any, playerId: any) {
    // AICI TREBUIE SA PUN INTREBARE de confirmare
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation',
        message: `Proceed deleting selected player ? `
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        (await this.auth.deletePlayer(coachId, playerId)).subscribe((data) => {
          this.allPlayers = data
        });
        this.snackBar.open('Deleted! 🗑️', 'Close', {
          duration: 2000, // Time in milliseconds
        });
      }
    })






  }



  // ----------- EDIT button which displays info in form ----------- 
  Switch: boolean = false;
  showInfo: boolean = true;
  displayInfo(playerId: any) {
    this.Switch = true;
    // console.log(this.allCoaches);
    // console.log(playerId);
    this.allCoaches.forEach((coach) => {
      coach.players.find((player) => {
        if (player.id == playerId) {
          this.selectedPlayer = player;
          console.log(this.selectedPlayer);
        }
      })
    })
    this.updatedPlayerDetails.setValue({
      playerFullName: this.selectedPlayer.playerFullName,
      age: this.selectedPlayer.age,
      salary: this.selectedPlayer.salary,
      goals: this.selectedPlayer.goals,
      continent: this.selectedPlayer.continent,
      id: this.selectedPlayer.id,
    })
  }


  // ----------- CANCEL button -----------  
  cancel() {
    this.Switch = false;
    this.updatedPlayerDetails.reset();
    this.snackBar.open('Nothing changed!', 'Close', {
      duration: 2000, // Time in milliseconds
    });
  }

  // ----------- UPDATE button which updates info  -----------  
  async update() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation',
        message: `Proceed editing ${this.selectedPlayer.playerFullName}?  `
      }
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.auth.editPlayer(this.updatedPlayerDetails.value.id, this.updatedPlayerDetails.value).subscribe(() => {
          console.log('Player updated', this.updatedPlayerDetails.value);
        })
        this.updatedPlayerDetails.reset();
        this.snackBar.open('Successfully changed! ✅', 'Close', {
          duration: 2000, // Time in milliseconds
        });
        this.Switch = false;
      }
    })

    console.log(this.updatedPlayerDetails.value.id);
  }




  redirect() {
    this.route.navigateByUrl('only-admin');
  }

  totiJucatorii = [];
  test() {
    // console.log(this.allCoaches);
    this.allCoaches.forEach(coach=>{
      // console.log(coach.players);
      this.totiJucatorii.push(...coach.players);
    })
    console.log(this.totiJucatorii);
  }
}
