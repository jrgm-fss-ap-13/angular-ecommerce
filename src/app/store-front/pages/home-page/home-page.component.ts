import { Component, inject } from '@angular/core';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { ProductsService } from '../../../products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pagination } from "../../../shared/components/pagination/pagination";
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import { SkeletonComponent } from '../../../utils/skeleton/skeleton.component';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, Pagination, SkeletonComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent { 

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  
  // activatedRoute = inject(ActivatedRoute);

  // currentPage = toSignal(
  //   this.activatedRoute.queryParamMap.pipe(
  //     map(params => (params.get('page') ? +params.get('page')! : 1)),
  //     map(page => (isNaN(page) ? 1 : page))
  // ), {
  //   initialValue: 1
  // }
  // );

  productsResorce = rxResource({
    request: () => ({  page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9
      });
    }
  })

}
