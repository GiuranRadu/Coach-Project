import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-reveal-winner',
  templateUrl: './reveal-winner.component.html',
  styleUrls: ['./reveal-winner.component.css']
})
export class RevealWinnerComponent implements OnInit {

  constructor(private auth: AuthService) {

  }

  allCoaches: any;
  allPlayers = [];
  theBestPlayer: any;
  secondBestPlayer: any;
  thirdBestPlayer: any;
  revealSwitch: boolean = false;
  @ViewChild('revealButton') revealButton: ElementRef;

  ngOnInit(): void {
    this.auth.getCoaches().subscribe((data) => {
      this.allCoaches = data;
      this.allCoaches.forEach(coach => {
        this.allPlayers.push(...coach.players);
      })
    });
  };

  revealFunction() {
    this.theBestPlayer = this.allPlayers.reduce((maxPlayer, currentPlayer) => {
      return (maxPlayer.goals > currentPlayer.goals) ? maxPlayer : currentPlayer;
    });

    this.secondBestPlayer = this.allPlayers.reduce((secondMaxPlayer, currentPlayer) => {
      if (currentPlayer !== this.theBestPlayer) {
        return (secondMaxPlayer.goals > currentPlayer.goals) ? secondMaxPlayer : currentPlayer;
      } else {
        return secondMaxPlayer;
      }
    });

    this.thirdBestPlayer = this.allPlayers.reduce((thirdMaxPlayer, currentPlayer) => {
      if (currentPlayer !== this.theBestPlayer && currentPlayer !== this.secondBestPlayer) {
        return (thirdMaxPlayer.goals > currentPlayer.goals) ? thirdMaxPlayer : currentPlayer;
      } else {
        return thirdMaxPlayer;
      }
    });
    this.revealButton.nativeElement.innerHTML = 'Winner! 🏆'
    console.log(this.theBestPlayer);
  }




}
