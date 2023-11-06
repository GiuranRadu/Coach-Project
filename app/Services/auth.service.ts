import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from '@angular/fire/auth';
import { Firestore, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  subscribe(arg0: (data: any) => void) {
    throw new Error('Method not implemented.');
  }


  constructor(private firestore: Firestore) { }



  async register(fname: string, lname: string, email: string, age: number, password: string, isAdmin: boolean, players: any) {
    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const userUid = userCredentials.user.uid;

      const userDoc = doc(this.firestore, 'coaches', userUid);
      await setDoc(userDoc, {
        fname,
        lname,
        email,
        age,
        password,
        isAdmin,
        players,
      })
    } catch (err) {
      console.log('Error in creating new account');
    }
  }

  async login(email: any, password: any) {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw err;
    }
  }

  getCurrentUser() {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userRef = doc(this.firestore, 'coaches', user.uid);
            const userDoc = getDoc(userRef);
            const userMergedData = { ...user, ...(await userDoc).data() };
            observer.next(userMergedData);
          } catch (err) {
            console.log(err);
          }
        }
      })
    })
  }

  async logout() {
    try {
      const auth = getAuth();
      await signOut(auth)
    } catch (err) {
      console.log('logout error');
    }
  }


  async updateProfile(id: any, updateData: any) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (user) {
            const userId = user.uid;

            if (updateData.email) {
              await updateEmail(user, updateData.email);
            }

            if (updateData.password) {
              await updatePassword(user, updateData.password);
            }

            const userDocRef = doc(this.firestore, 'coaches', userId);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            // console.log(userData);
            // observer.next(userData);
            const updatedUserData = {
              ...userData,
              ...updateData
            };

            // Update the document in Firestore
            await updateDoc(userDocRef, updatedUserData);

            observer.next(userData);

          } else {
            console.log('No User');
          }
        } catch (err) {
          console.log('err', err);
        }
      })
    })
  }

  // ------ WHY THIS?? -------------
  async getAllCoachesIfAdmin() {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            console.log('no user is logged in');
          } else {
            const userDocRef = doc(this.firestore, 'coaches', user.uid);
            const userDoc = getDoc(userDocRef);
            const userInfo = (await userDoc).data();
            const coachUid = userDocRef.firestore['_authCredentials'].currentUser.uid
            // console.log(coachUid);

            if (userInfo['isAdmin'] === true) {
              const usersCollection = collection(this.firestore, 'coaches');
              const userQuery = query(usersCollection);
              const userDocs = getDocs(userQuery);
              const usersInfo = (await userDocs).docs.map((document) => {
                return document.data();
              })
              observer.next(usersInfo);

            } else {
              console.log('Current user is not admin');
            }
          }
        } catch (err) {
          console.log('Error getting users', err);
        }
      })
    })
  }

  //------ AND NOT THIS ? -------
  // pe asta am folosit-o pentru afisare ID antrenor
  getCoaches() {
    let coachesRef = collection(this.firestore, 'coaches');
    return collectionData(coachesRef, { idField: 'id' }) as Observable<any[]>
  }


  deleteCoach(id: any) {
    let coachesRef = doc(this.firestore, `coaches/${id}`);
    return deleteDoc(coachesRef);
  }


  editCoach(coach:any,id: any) {
    let coachesRef = doc(this.firestore, `coaches/${id}`);
    return setDoc(coachesRef, coach)
  }


  async deletePlayer(coachId: any, playerId: any) {
    const auth = getAuth();
    return new Observable((observer)=>{
      auth.onAuthStateChanged(async (user)=>{
        try{
          if(!user){
            console.log('No user is logged in');
          }

          const userDocRef = doc(this.firestore,'coaches', user.uid);
          const userDoc = getDoc(userDocRef)
          const userData = (await userDoc).data();

          if(!userData['isAdmin']){
            console.log('You are not an admin');
          }

          const userRecordRef = doc(this.firestore,'coaches', coachId);
          const userRecord = getDoc(userRecordRef);
          const userDataRecord = (await userRecord).data();
          if(userDataRecord['players']){
            const playerIndex = userDataRecord['players'].findIndex((element)=> element.id === playerId);
            userDataRecord['players'].splice(playerIndex, 1);
          }

          updateDoc(userRecordRef, {
            players: userDataRecord['players']
          })

          const usersCollection = collection(this.firestore,'coaches');
          const userQuery = query(usersCollection);
          const userDocs = getDocs(userQuery);
          const usersInfo = (await userDocs).docs
            .filter((document)=> document.id !== coachId)
            .map((document)=>({
              ...document.data(),
              uid:document.id
            }))

          observer.next(usersInfo);
            
        }catch(err){
          console.log('error', err);
        }
      })
    })
  }
  
 
  editPlayer(playerId:any, updatedPlayerData:any){
    const auth = getAuth();
    return new Observable((observer)=>{
      auth.onAuthStateChanged(async (user)=>{
        try{
          if(!user){
            console.log('No user is logged in');
          }

          const userDocRef = doc(this.firestore,'coaches', user.uid);
          const userDoc = getDoc(userDocRef)
          const userData = (await userDoc).data();

          if(!userData['isAdmin']){
            console.log('You are not an admin');
          }

          const usersCollection = collection(this.firestore,'coaches');
          const userQuery = query(usersCollection);
          const userDocs = await getDocs(userQuery);

          const usersInfo = userDocs.docs
          //asta de sub este sa excludem ADMINUL (nu-mi trebuie)
          // .filter((document)=> document.id !== user.uid) 
            .map((document)=> ({
              ...document.data(),
              uid: document.id
            }))

            for(const regularUser of usersInfo){
              if(regularUser['players']){
                const playerToFindIndex = regularUser['players'].findIndex((player)=> player.id === playerId);
                regularUser['players'][playerToFindIndex] = {...regularUser['players'][playerToFindIndex], ...updatedPlayerData};
                const userDocRef = doc(this.firestore,'coaches', regularUser.uid);
                updateDoc(userDocRef, {
                  players:  regularUser['players']
                })

                observer.next(usersInfo);
              }
            }
        }catch(err){
          console.log('error', err);
        }
      })
    })

  }









}
