import { Component } from '@angular/core';
import { Tag } from '../../../shared/models/Tags';
import { FoodService } from '../../../services/food.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {
  tags?:Tag[];

  constructor(foodService:FoodService){
    foodService.getAllTags().subscribe(serverTags => {
      this.tags=serverTags;
    });
  }

  ngOnInit() : void {
    
  }
}
