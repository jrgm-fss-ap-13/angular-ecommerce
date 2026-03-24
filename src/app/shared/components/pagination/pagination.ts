import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { PaginationSkeletonComponent } from "../../../utils/pagination-skeleton/pagination-skeleton.component";

@Component({
  selector: 'app-pagination',
  imports: [RouterLink, PaginationSkeletonComponent, NgClass],
  templateUrl: './pagination.html',
})
export class Pagination {

  className = input('');
  pages = input(0);
  currentPage = input<number>(1)

  activatePage = linkedSignal(this.currentPage);

  getPagesList = computed(( ) => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  })
 }
