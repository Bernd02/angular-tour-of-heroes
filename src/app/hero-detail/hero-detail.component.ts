import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../models/hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../services/hero.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-hero-detail',
    templateUrl: './hero-detail.component.html',
    styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
    @Input() hero?: Hero;

    constructor(
        private route: ActivatedRoute,
        private heroService: HeroService,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.getHero();
    }

    // --------------------------------------------------
    getHero(): void {
        const id = Number(this.route.snapshot.paramMap.get("id"));
        this.heroService.getHero(id)
            .subscribe(value => {
                this.hero = value;
            });
    }

    goBack(): void {
        this.location.back();
    }
}
