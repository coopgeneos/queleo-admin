import { Component, OnInit } from '@angular/core';
import { Community } from '../../models/community';
import { RSS } from '../../../news/models/rss';
import { ActivatedRoute } from '@angular/router';
import { CommunitiesService } from '../../communities.service';
import { NewsService } from '../../../news/news.service';
import { Observable } from 'rxjs';
import { Category } from '../../../news/models/category';
import { NbDialogService, NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AddMemberFormComponent } from './add-member-form/add-member-form.component';
import { AddRssFormComponent } from './add-rss-form/add-rss-form.component';
import { ToastAlertService } from '../../../../services/toast-alert.service';

@Component({
  selector: 'ngx-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  private id: string;
  private community: Community;

  private rssPath: string;
  private sourcesPath: string;

  constructor(
    private activatedRouter: ActivatedRoute,
    private communityService: CommunitiesService,
    private dialogService: NbDialogService,
    private toastService: ToastAlertService) { 
    this.activatedRouter.params.subscribe(
      params => { 
        this.id = params['id']; 
      }
    );
    this.community = new Community();
  }

  ngOnInit() {
    this.rssPath = `/communities/${this.id}/rss`;
    this.sourcesPath = `/communities/${this.id}/sources`;

    this.communityService.getCommunity(this.id).subscribe(
      data => {
        this.community = data
      },
      error => {
        this.toastService.showAlert('danger', 'Error', error)
      }
    );
  }

  openAddMemberForm() {
    this.dialogService.open(AddMemberFormComponent)
      .onClose.subscribe(email => {
        if(email) {
          this.addMember(email)
        }
      });
  }

  private addMember(email: string) : void {
    this.communityService.getUserByEmail(email).subscribe(
      user => {
        if(user) {
          this.community.members.push(email);
          this.communityService.setMembers(this.id, this.community.members);
        } else {
          this.toastService.showAlert('danger', 'Error', "El correo no pertence a un usuario registrado")
        }
      }
    )
  }

  removeMember(email: string) : void {
    let index = this.community.members.findIndex((member, index) => {
      return member == email;
    });
    this.community.members.splice(index,1)
    this.communityService.setMembers(this.id, this.community.members)
  }

  openAddRssForm() {
    this.dialogService.open(AddRssFormComponent)
      .onClose.subscribe(rss => {
        if(rss) {
          this.addRss(rss);
        }
      });
  }

  private addRss(newRss: RSS) : void {
    if(!newRss || !newRss.source || !newRss.category || !newRss.url ) {
      this.toastService.showAlert('danger', 'Error', "El RSS esta mal formado")
      return
    }
    let rss = this.community.rss.find(elem => {
      return elem.url.toLowerCase() == newRss.url.toLowerCase();
    });
    if(!rss && newRss.source && newRss.category) {
      this.community.rss.push(newRss);
      this.communityService.setRss(this.id, this.community.rss);
      this.addSource(newRss.source)
    } else {
      this.toastService.showAlert('danger', 'Error', "El RSS ya existe")
      return
    } 
  }

  removeRss(rss: RSS) {
    let index = this.community.rss.findIndex((elem, index) => {
      return elem.url == rss.url;
    });
    this.community.rss.splice(index,1);
    this.communityService.setRss(this.id, this.community.rss);

    let source = this.community.rss.find(_rss => {
      return _rss.source.toLowerCase() == rss.source.toLowerCase()
    })
    if(source == undefined) {
      this.removeSource(rss.source)
    }
  }

  private addSource(source: string) {
    let found = this.community.sources.filter(s => {
      return s.toLowerCase() == source.toLowerCase()
    });
    if(found.length == 0){
      this.community.sources.push(source);
      this.communityService.setSources(this.id, this.community.sources)
    }
  }

  private removeSource(source: string) {
    let index = this.community.sources.findIndex(s => {
      return s.toLowerCase() == source.toLowerCase()
    });
    if(index != -1){
      this.community.sources.splice(index, 1);
      this.communityService.setSources(this.id, this.community.sources)
    }
  }

}
