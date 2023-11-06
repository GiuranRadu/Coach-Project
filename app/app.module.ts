import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { InfoComponent } from './info/info.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddPlayersComponent } from './main-page/add-players/add-players.component';
import { SearchPlayersComponent } from './main-page/search-players/search-players.component';
import { SeeInfoComponent } from './main-page/see-all-players-info/see-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EditProfileComponent } from './main-page/edit-profile/edit-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OnlyAdminComponent } from './main-page/only-admin/only-admin.component';
import { SeeAllPlayersComponent } from './main-page/only-admin/see-all-players/see-all-players.component';
import { SeeAllCoachesComponent } from './main-page/only-admin/see-all-coaches/see-all-coaches.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RevealWinnerComponent } from './main-page/only-admin/reveal-winner/reveal-winner.component';





@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    LoginComponent,
    MainPageComponent,
    RegisterComponent,
    NavbarComponent,
    AddPlayersComponent,
    SearchPlayersComponent,
    SeeInfoComponent,
    EditProfileComponent,
    ConfirmationDialogComponent,
    OnlyAdminComponent,
    SeeAllPlayersComponent,
    SeeAllCoachesComponent,
    RevealWinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [
    ScreenTrackingService,UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
