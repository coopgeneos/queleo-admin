import { Component, OnInit } from '@angular/core';
import { Community } from '../../models/community';
import { CommunitiesService } from '../../communities.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.scss']
})
export class CommunityListComponent implements OnInit {

  communities: Observable<Community[]>;

  constructor(private communitiesService: CommunitiesService) { }

  ngOnInit() {
    this.communities = this.communitiesService.getAllCommunities("ibgomezo@gmail.com");
    this.communities.subscribe();
  }

}
