import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'content',
  templateUrl: 'follow.component.html'
})

export class FollowComponent implements OnInit {

  //constructor(private heroService: HeroService) { }

  ngOnInit(): void {
//    this.heroService.getHeroes()
//      .then(heroes => this.heroes = heroes.slice(1, 5));
  }
}