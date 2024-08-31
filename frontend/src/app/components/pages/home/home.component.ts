import { Component, OnInit } from '@angular/core';
import { Food } from '../../../shared/models/Food';
import { FoodService } from '../../../services/food.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from "../../partials/search/search.component";
import { TagsComponent } from "../../partials/tags/tags.component";
import { NotFoundComponent } from "../../partials/not-found/not-found.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, TagsComponent, NotFoundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  foods:Food[] = [];

  constructor(private foodService:FoodService, private activatedRoute:ActivatedRoute) {
    activatedRoute.params.subscribe((params) => {
      let foodsObservable: Observable<Food[]>;
      if(params.searchTerm){
        foodsObservable=this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
      } else if(params.tag){
        foodsObservable=this.foodService.getAllFoodsByTag(params.tag);
      }
      else {
        foodsObservable=foodService.getAll();
      }

      foodsObservable.subscribe((serverFoods) => {
        this.foods = serverFoods;
      });
    });
  }

  ngOnInit():void {
  }
}
