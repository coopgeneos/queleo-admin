import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


import { NewsService } from '../../../news/news.service';
import { UsersService } from '../../../news/users.service';
import { AuthService } from '../../../../auth/auth.service';
import { ProfilesService } from '../../profiles.service';
import { ActivatedRoute } from '@angular/router';

import { RSS } from '../../../news/models/rss';
import { User } from '../../../news/models/user';
import { Profile } from '../../models/profile';
import { Category } from '../../../news/models/category';
import { ToastAlertService } from '../../../../services/toast-alert.service';

@Component({
  selector: 'ngx-profile-stepper',
  templateUrl: './profile-stepper.component.html',
  styleUrls: ['./profile-stepper.component.scss']
})
export class ProfileStepperComponent implements OnInit {

  firstForm: FormGroup;
  // secondForm: FormGroup;
  // thirdForm: FormGroup;

  categories = [];
  rssList: RSS[] = [];
  rssFilteredList: RSS[] = [];

  logged: User;
  id: string;
  profile: Profile = new Profile();

  disableStep: boolean = false;

  constructor(private fb: FormBuilder, 
    private newsService: NewsService,
    private userService: UsersService,
    private authService: AuthService,
    private profileService: ProfilesService,
    private activatedRouter: ActivatedRoute,
    private toastAlertService: ToastAlertService) {
      this.activatedRouter.params.subscribe(
        params => { 
          this.id = params['id']; 
        }
      );
  }

  ngOnInit() {
    this._init();

    this.firstForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    });
  }

  async _init() {
    try {
      this.categories = await this.toPromise(this.newsService.getAllCategories());
      this.rssList = await this.toPromise(this.newsService.loadRss('/rssx'));
      this.logged = await this.toPromise(this.userService.getUserByEmail(this.authService.getLoggedUser().email));
      if(this.id) {
        let _profiles = await this.toPromise(this.profileService.getProfiles(this.logged.id));
        this.profile = _profiles.find(prof => {return prof.id == this.id});

        this.firstForm.controls['firstCtrl'].setValue(this.profile.name);
        // Marco las categorias como seleccionadas
        this.profile.categories.forEach(_cat => {
          let found = this.categories.find(_el => {return _el.name == _cat});
          if(found) { found.selected = true }
        });

      }
    } catch(err) {
      alert(err);
    }
  }

  onFirstSubmit() {
    console.log("onFirstSubmit",this.firstForm.value.firstCtrl)
    this.profile.name = this.firstForm.value.firstCtrl;
    this.disableStep = false;
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    console.log("onSecondSubmit")
    
    let selectedCategories = this.categories.filter(category => {return category.selected && category.selected == true})
                                            .map(category => {return category.name});
    if(selectedCategories.length == 0) {
      this.toastAlertService.showAlert('danger', 'Error', 'Seleccione una categoría');
      this.disableStep = true;
      return;
    }
    this.disableStep = false;
    this.rssFilteredList = this.rssList.filter(rss => {
      return selectedCategories.includes(rss.category)
    });
    this.profile.categories = selectedCategories;
    console.log(this.profile)
  }

  onThirdSubmit() {
    console.log("onThirdSubmit")
    let _rss = this.rssFilteredList
      .filter(item => {return item['selected']})
      .map(item => {delete item['selected']; return item});

    this.profile.rss = [..._rss];

    this.profile.sources =  this.deleteDuplicated(_rss, "source")
                              .map(_elem => {return _elem['source']});

    console.log("profile", this.profile)

    this.id ? 
      this.profileService.updateProfileToUser(this.logged.id, this.profile) : 
      this.profileService.addProfileToUser(this.logged.id, this.profile);
  }

  backStep() {
    this.disableStep = false;
  }

  touchCategory(index, category) {
    this.categories[index].selected = !this.categories[index].selected;
  }

  addRssToProfile(rss) {
    // this.thirdForm.controls["thirdCtrl"].markAsDirty();
    // this.thirdForm.controls["thirdCtrl"].markAsTouched();
    rss.selected = true;
  }

  removeRssFromProfile(rss) {
    rss.selected = false;
  }

  /**
   * Hago este método porque Observable.toPromise() no me funciona.
   * Sabrá Dios por qué!
   */
  toPromise(obs: Observable<any>) : Promise<any> {
    return new Promise((resolve, reject) => {
      obs.subscribe(
        data => { resolve(data) },
        error => { reject(error) }
      )
    })
  }

  private deleteDuplicated(original_array: any[], field: string) : any[] {
    let array = [... original_array];
    for(let i=0; i<array.length; i++){
      for(let j=i+1; j<array.length; j++){
        if(array[i][field] == array[j][field]) {
          array.splice(j, 1);
          j -= 1;
        }
      }
    }
    return array;
  }
}
