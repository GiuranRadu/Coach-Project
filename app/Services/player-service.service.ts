import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, arrayUnion, collection, collectionData, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  deleteProduct(i: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private firestore: Firestore) { }
 

  async addNewPlayer(player: any){
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try{
          if(!user){
            console.log('No user is logged in!')
          }else{
            const userDocRef = doc(this.firestore, 'coaches', user.uid);
            await updateDoc(userDocRef, {
              players: arrayUnion(player),
            })
          }
          observer.next();
        }catch(err){
          console.log('add player err',err)
        }
      })
    })
  }

  async getPlayersForCurrentUser(){
    const auth = getAuth();
    return new Observable((observer)=>{
      auth.onAuthStateChanged(async (user)=>{
        try{
          if(user){
            const userDocRef = doc(this.firestore, 'coaches', user.uid);
            const userDoc = getDoc(userDocRef);
            const playerInfo = (await userDoc).data();
            observer.next(playerInfo['players']);
          }else{
            console.log('User document not found');
            observer.next(null);
          }
        }catch(err){
          console.log('error', err);
        }
      })
    })
  }

  // ----------------------------------------------------------------
  getPlayers(){
    let coachesRef = collection(this.firestore, 'coaches');
    return collectionData(coachesRef, {idField: 'id'}) as Observable<any[]>
  }




  deletePlayer(id: any){
    let productRef = doc(this.firestore, `coaches/${id}`);
    return deleteDoc(productRef);
  }


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




