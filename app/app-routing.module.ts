import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AddPlayersComponent } from './main-page/add-players/add-players.component';
import { SearchPlayersComponent } from './main-page/search-players/search-players.component';
import { SeeInfoComponent } from './main-page/see-all-players-info/see-info.component';
import { EditProfileComponent } from './main-page/edit-profile/edit-profile.component';
import { OnlyAdminComponent } from './main-page/only-admin/only-admin.component';
import { SeeAllCoachesComponent } from './main-page/only-admin/see-all-coaches/see-all-coaches.component';
import { SeeAllPlayersComponent } from './main-page/only-admin/see-all-players/see-all-players.component';
import { RevealWinnerComponent } from './main-page/only-admin/reveal-winner/reveal-winner.component';

const routes: Routes = [
  { path: 'info', component: InfoComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'mainPage', component: MainPageComponent},
  { path: 'editProfile', component: EditProfileComponent},
  { path: 'only-admin', component: OnlyAdminComponent},
  { path: 'only-admin/seeAllCoaches', component: SeeAllCoachesComponent},
  { path: 'only-admin/seeAllPlayers', component: SeeAllPlayersComponent},
  { path: 'only-admin/revealWinner', component: RevealWinnerComponent},
  { path: 'mainPage/addPlayers', component: AddPlayersComponent},
  { path: 'mainPage/searchPlayers', component: SearchPlayersComponent},
  { path: 'mainPage/seeInfo', component: SeeInfoComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
