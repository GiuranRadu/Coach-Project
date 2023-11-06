import { Injectable, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditPlayersService  {

  constructor(private firestore: Firestore) { }
   
  async deletePlayer(id: any) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (user) {
            const userId = user.uid;
            const userDocRef = doc(this.firestore, 'coaches', userId);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data()

            if (userData['players']) {
              const playerIndex = userData['players'].findIndex((player) => player.id === id);
              userData['players'].splice(playerIndex, 1);
            }

            await updateDoc(userDocRef, {
              players: userData['players'],
            })

            observer.next(userData['coaches'])

          } else {
            console.log('No user');
          }

        } catch (err) {
          console.log('error', err);
        };
      })
    })
  }

  async updatePlayer(id:any, updateData:any){
    const auth = getAuth();
    return new Observable((observer)=>{
      auth.onAuthStateChanged(async (user)=>{
        try{
          if(user){
            const userId = user.uid;
            const userDocRef = doc(this.firestore, 'coaches', userId);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            const userPlayers = userData['players'];
            const userFilteredPlayer = userPlayers.find((el:any)=> el.id ===id);

            if(userFilteredPlayer){
              Object.assign(userFilteredPlayer,updateData);
              await updateDoc(userDocRef, {players: userPlayers});
              observer.next(userPlayers);
            }else{
              observer.error('Player not found');
            }
          }else{
            console.log('No User');
          }
        }catch(err){
          console.log('err', err);
        }
      })
    })
  }

  



}
