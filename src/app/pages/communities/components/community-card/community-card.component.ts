import { Component, OnInit, Input } from '@angular/core';
import { Community } from '../../models/community';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.scss']
})
export class CommunityCardComponent implements OnInit {

  @Input() community: Community;
  
  constructor(private router: Router) { }

  ngOnInit() { }

  goToCommunity() : void {
    console.log("click", this.community.id)
    this.router.navigate(["/pages/community/"+this.community.id]);
  }

}
