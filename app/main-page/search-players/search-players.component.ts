import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/Services/player-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-search-players',
  templateUrl: './search-players.component.html',
  styleUrls: ['./search-players.component.css']
})
export class SearchPlayersComponent implements OnInit {

  constructor(private route:Router, private playerService : PlayerService, private _snackBar: MatSnackBar){}

  players:any;
  userInput:'';
  startingAge: number;
  endingAge: number;
  continent: '';
  // playerFound : {};
  playersFound:any[] = [];



  async ngOnInit(): Promise<void> {
    (await this.playerService.getPlayersForCurrentUser()).subscribe((players)=>{
      this.players = players;
    })
  }

  showSnackbar() {
    this._snackBar.open('⚠️  No player found with this info!' , 'Close', {
      duration: 7000, 
      panelClass: ['centered-snackbar']
    });
  }

 

  findPlayerByName(){
    this.resetTable()
    const userInputNormalized = this.userInput?.toLowerCase().replace(/\s/g, '');
    const playerExist = this.players.find(player => player.playerFullName.toLowerCase().replace(/\s/g, '') === userInputNormalized);
  
    if(playerExist) {
      console.log(`Player ${playerExist.playerFullName} exists`);      
      this.playersFound.push(playerExist);
    } else{
      console.log('player dont exist');
      this.showSnackbar()
    }
    this.userInput = ''
  }

  findPlayerbyAge(minAge : number = this.startingAge, maxAge:number = this.endingAge){
    this.resetTable()
    console.log(minAge,maxAge);
    const playersInRange = this.players.filter(player => player.age >= minAge && player.age <= maxAge);

    if(playersInRange.length > 0) {
      console.log(`Players found within the age range:`);
      playersInRange.forEach(player => {
        console.log(player);
        this.playersFound.push(player);
        console.log(this.playersFound);
        this.startingAge =null;
        this.endingAge =null;
      });
      // You can do something with the playersInRange array if needed
    } else {
      console.log('No players found within the age range');
      this.showSnackbar();
    }
  }

  findPlayerbyContinent(){
    this.resetTable()
    const playersInRange = this.players.filter(player => player.continent === this.continent);

    if(playersInRange.length > 0){
      playersInRange.forEach(player => {
        this.playersFound.push(player);
        this.continent = '';
      })
    }else {
      console.log('No players found within the age range');
      this.showSnackbar();
    }
    
  }

  

  resetTable(){
    this.playersFound = []
  }




  redirect(){
    this.route.navigateByUrl('mainPage');
  }


}
