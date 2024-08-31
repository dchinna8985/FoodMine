import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm='';
  constructor(activatedRoute:ActivatedRoute, private router:Router) {
    activatedRoute.params.subscribe((params) => {
      if(params.searchTerm) {
        this.searchTerm=params.searchTerm;
      }
    });
  }

  ngOnInit() : void {

  }

  search(term:string) : void {
    if(term){
      this.router.navigateByUrl('/search/'+term);
    }
  }
}
