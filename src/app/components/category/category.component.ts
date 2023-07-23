import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  category: Category = new Category();
  submitted = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
  }

  saveCategory(): void {
    this.categoryService.create(this.category).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }

  newCategory(): void {
    this.submitted = false;
    this.category = new Category();
  }

}
