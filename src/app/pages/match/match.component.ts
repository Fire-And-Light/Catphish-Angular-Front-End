import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
  username : any;
  nav : any;
  section : any;
  cover : any;
  pic : any;
  candidate : any;
  bio : any;
  message : any;
  times : any;
  check : any;
  faTimes = faTimes;
  faCheck = faCheck;
  canClick = true;

  constructor(private http : HttpClient, private route : ActivatedRoute, private router : Router) {

  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get("username");
    this.nav = document.getElementById("nav");
    this.section = document.getElementById("section");
    this.cover = document.getElementById("cover");
    this.pic = document.getElementById("pic");
    this.candidate = document.getElementById("candidate");
    this.bio = document.getElementById("bio");
    this.message = document.getElementById("message");
    this.times = document.getElementById("times");
    this.check = document.getElementById("check");

    this.loadCandidate();
  }

  loadCandidate() : void {
    this.http.get("https://catphish-back-end.azurewebsites.net/match/" + this.username).subscribe((response : any) : void => {
      if (response === null) {
          this.cover.className ="cover-off";
          this.message.className = "empty";
          this.message.innerHTML = "There are no people";
          return;

      } else {
          this.cover.className = "cover-on";
      }

      this.pic.src = "data:image/jpeg;base64," + response.pictureBlob;
      this.candidate.innerHTML = response.username;
      this.bio.value = response.bio;
    });
  }

  reject() : void {
    if (this.canClick) {
      let relationship = {
        user: {username: this.username},
        checked: {username: this.candidate.innerHTML},
        liked: false
      }

      this.http.post("https://catphish-back-end.azurewebsites.net/match/" + this.username, relationship).subscribe();

      this.loadCandidate();
    }
  }

  like() : void {
    if (this.canClick) {
      let relationship = {
        user: {username: this.username},
        checked: {username: this.candidate.innerHTML},
        liked: true
      }

      this.http.post("https://catphish-back-end.azurewebsites.net/match/" + this.username, relationship, {responseType: "text"}).subscribe((response : string) : void => {
        let matched = response === "Matched";

        if (matched) {
          this.notifyMatched();
          setTimeout(() : void => {
            this.http.get("https://catphish-back-end.azurewebsites.net/match/" + this.username).subscribe((response : any) : void => {
              if (response === null) {
                  this.cover.className = "cover-off";
                  this.message.className = "empty";
                  this.message.innerHTML = "There are no people";
                  return;
        
              } else {
                  this.cover.className = "cover-on";
              }
        
              this.pic.src = "data:image/jpeg;base64," + response.pictureBlob;
              this.candidate.innerHTML = response.username;
              this.bio.value = response.bio;
            });
          }, 1500);

        } else {
          this.loadCandidate();
        }
      });
    }
  }

  notifyMatched() : void {
    this.canClick = false;

    let options = document.getElementsByTagName("a");

    for (let i = 0; i < options.length; i++) {
      options[i].style.cursor = "default";

      if (options[i].id != "match") {
        options[i].className = "matched";
      }
    }

    this.times.style.cursor = "default";
    this.check.style.cursor = "default";
    
    this.nav.style.filter = "brightness(65%)";
    this.section.style.filter = "brightness(65%)";
    this.message.className = "message-on";

    setTimeout(() => { 
      let options = document.getElementsByTagName("a");

      for (let i = 0; i < options.length; i++) {
        options[i].style.cursor = "pointer";

        if (options[i].id != "match") {
          options[i].className = "unmatched";
        }
      }

      this.times.style.cursor = "pointer";
      this.check.style.cursor = "pointer";
  
      this.message.className = "message-off";
  
      this.nav.style.filter = "brightness(100%)";
      this.section.style.filter = "brightness(100%)";

      this.canClick = true;
    }, 1500);
  }

  enterProfile() : void {
    if (this.canClick) {
      this.router.navigate(["/profile", this.username]);
    }
  }

  reload() : void {
    if (this.canClick) {
      window.location.reload();
    }
  }

  enterMatches() : void {
    if (this.canClick) {
      window.open("/#/matches/" + this.username, "_self");
    }
  }

  enterMain() : void {
    if (this.canClick) {
      this.router.navigate(["/"]);
    }
  }

  enterDelete() : void {
    if (this.canClick) {
      this.router.navigate(["/delete", this.username]);
    }
  }
}