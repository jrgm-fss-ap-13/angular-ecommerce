import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'util-pagination-skeleton',
  imports: [ NgClass ],
  templateUrl: './pagination-skeleton.component.html',
})
export class PaginationSkeletonComponent {

  className = input('');
  
 }
