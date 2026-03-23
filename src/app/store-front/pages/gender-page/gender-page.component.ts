import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductsService } from '../../../products/services/products.service';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { SkeletonComponent } from '../../../utils/skeleton/skeleton.component';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent,Pagination, SkeletonComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  
  private productsService = inject(ProductsService);
  route = inject(ActivatedRoute);
  paginationService = inject(PaginationService);

  gender = toSignal(
    this.route.params.pipe(
      map(  ({ gender }) =>  gender)
    )
  );

  productsResorce = rxResource({
    request: () => ({ gender: this.gender(), page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        gender: request.gender,
        offset: request.page * 9
      });
    }
  })

 }

