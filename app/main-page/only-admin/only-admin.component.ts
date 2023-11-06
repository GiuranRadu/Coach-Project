import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'only-admin',
  templateUrl: './only-admin.component.html',
  styleUrls: ['./only-admin.component.css']
})
export class OnlyAdminComponent implements OnInit {

  allCoaches:any

  constructor(private auth: AuthService, private router: Router){
    
  }

  async ngOnInit(): Promise<void> {
    (await this.auth.getAllCoachesIfAdmin()).subscribe((usersFromService)=>{
      this.allCoaches = usersFromService;
      // console.log(this.allUsers);
    })
    
  }


}
