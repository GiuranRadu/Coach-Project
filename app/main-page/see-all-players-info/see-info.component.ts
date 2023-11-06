import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EditPlayersService } from 'src/app/Services/edit-players.service';
import { PlayerService } from 'src/app/Services/player-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-see-info',
  templateUrl: './see-info.component.html',
  styleUrls: ['./see-info.component.css']
})
export class SeeInfoComponent  implements OnInit {

  constructor(private route:Router, private playerService: PlayerService, private editAndDelete: EditPlayersService, public dialog: MatDialog){}
  
  editPlayerForm : FormGroup;
  players:any;
  sortBy:any;
  coaches:any;
  playerId:any;


  async ngOnInit(): Promise<void> {

    this.playerService.getPlayers().subscribe((data)=>{
      this.coaches = data      
    })

    this.editPlayerForm = new FormGroup({
      playerFullName: new FormControl(''),
      age : new FormControl(''),
      salary : new FormControl(''),
      goals : new FormControl(''),
      continent : new FormControl(''),
    });

  
    (await this.playerService.getPlayersForCurrentUser()).subscribe((players)=>{
      this.players = players;
    })
    
  }

  redirect(){
    this.route.navigateByUrl('mainPage');
  }

    // ...................Sort Player Function...........................
    sortPlayers() {
      if (this.sortBy === 'name') {
        this.players.sort((a, b) => a.playerFullName.localeCompare(b.playerFullName));
      }else if (this.sortBy === 'continent'){
        this.players.sort((a, b) => a.continent.localeCompare(b.continent));
      }
       else {
        this.players.sort((b, a) => a[this.sortBy] - b[this.sortBy]);
      }
    }

  // ...................Delete Player Function...........................
 
  async delete(playerId: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation',
        message: `Are you sure you want to delete? `
      }
    });
  
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        (await this.editAndDelete.deletePlayer(playerId)).subscribe(async (data) => {
          this.coaches = data;
          (await this.playerService.getPlayersForCurrentUser()).subscribe((players)=>{
            this.players = players;
          })
        });
      }
    });    
  }

  // ............Populate form with selected user FUNCTION.................

  async populateForm(playerId: any){
    this.playerId = playerId;    
    const selectedPlayerToEdit = this.players.find((p: any) => p.id === this.playerId);  
    console.log(selectedPlayerToEdit);
    this.showCancelButton =  true;

    this.editPlayerForm.patchValue({
      playerFullName: selectedPlayerToEdit['playerFullName'],
      age : selectedPlayerToEdit['age'],
      salary : selectedPlayerToEdit['salary'],
      goals : selectedPlayerToEdit['goals'],
      continent : selectedPlayerToEdit['continent'],
      id: selectedPlayerToEdit['id']
    });

    // this.playerService.scrollPageToBottom()    //aici sunt folosite din service
    this.scrollPageToBottom()    
  }

  // ...................UPDATE Player Function............................

  async updatePlayerInfo(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation',
        message: `Are you sure you want to update? `
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result){
        (await this.editAndDelete.updatePlayer(this.playerId, this.editPlayerForm.value)).subscribe(async ()=>{
          console.log('updated');
          (await this.playerService.getPlayersForCurrentUser()).subscribe((players)=>{
            this.players = players;
            this.editPlayerForm.reset();
            this.scrollPageToTop();
            // this.playerService.scrollPageToTop(); //aici sunt folosite din service 
          })
        });
      }
    });          
  }
  showCancelButton: boolean = false;

  cancelButton(){
    this.showCancelButton =  false;
    this.editPlayerForm.reset();
    this.scrollPageToTop();
  }


  // ...................Scroll UP/DOWN Functions............................

  scrollPageToTop() {
    const scrollToTop = () => {
      const scrollStep = window.scrollY / 50;
      if (window.scrollY > 0) {
        requestAnimationFrame(scrollToTop);
        window.scrollTo(0, window.scrollY - scrollStep);
      }
    }
    scrollToTop();
  }
  scrollPageToBottom() {
    const scrollStep = (document.body.scrollHeight - window.scrollY) / 250;
  
    const scrollToBottom = () => {
      if (window.scrollY < document.body.scrollHeight - window.innerHeight) {
        requestAnimationFrame(scrollToBottom);
        window.scrollTo(0, window.scrollY + scrollStep);
      }
    }
  
    scrollToBottom();
  }
  


}
