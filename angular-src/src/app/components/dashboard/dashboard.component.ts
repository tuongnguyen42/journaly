import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {ValidateService} from '../../services/validate.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  body: String;
  tags: String;
  date: Date;
  user:Object;
  posts[]:Object;
  currPosts[]:Object;
  index:Number = 5;

  constructor(
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private validateService: ValidateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile =>{

      this.user = profile.user;
      this.posts = profile.user.posts;
      // console.log(this.posts);
    },
  err =>{
    console.log(err);
    return false;
  })


  }

  onLoadSubmit(){
    if (this.index > this.posts.length){
            this.flashMessage.show('All posts are loaded!', {cssClass: 'alert-info', timeout: 3000});
            return true;
    }
    for (;this.index <= this.posts.length;this.num++){
      this.currPosts.push(this.posts[this.index]);
    }

    this.index = this.index + 5;

  }

  onPostSubmit(){
    const entry = {
      body: this.body,
      tags: this.tags,
      date: this.date
    }

    if(!this.validateService.validatePost(entry)){
      this.flashMessage.show('Entry is empty!', {cssClass: 'alert-warning', timeout: 3000});
      return false;
    }

    this.authService.addEntry(entry).subscribe(data => {
      if(data.success){
        this.flashMessage.show('Post Added!', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/']);
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});

      }
    });



  }

}
