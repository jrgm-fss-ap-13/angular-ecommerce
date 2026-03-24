import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

interface Options {

    limit?: number;
    offset?: number;
    gender?: string;
}

const emptyProduct : Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    private http = inject(HttpClient)
    private productsCache = new Map<string, ProductsResponse>();
    private productsByIdSlugCache = new Map<string, Product>();



    getProducts(options: Options): Observable<ProductsResponse> {

        const { limit = 9, offset = 0, gender = '' } = options

        const key = `${limit}-${offset}-${gender}`;
        if (this.productsCache.has(key)) {
            return of({ ...this.productsCache.get(key)! });
        }

        return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
            params: {
                limit,
                offset,
                gender
            }
        })
            .pipe(
                delay(2000),
                //tap( (resp) =>console.log(resp))
                tap((resp) => this.productsCache.set(key, resp))
            );
    }


    getProductByIdSlug(idSlug: string): Observable<Product> {

        if (this.productsByIdSlugCache.has(idSlug)) {
            return of({ ...this.productsByIdSlugCache.get(idSlug)! });
        }

        return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
            .pipe(
                tap((product) => this.productsByIdSlugCache.set(idSlug, product))
            );
    }

    getProductById(id: string): Observable<Product> {

        if (id === 'new') {
            return of(emptyProduct);
        }

        if (this.productsByIdSlugCache.has(id)) {
            return of({ ...this.productsByIdSlugCache.get(id)! });
        }

        return this.http.get<Product>(`${baseUrl}/products/${id}`)
            .pipe(
                tap((product) => this.productsByIdSlugCache.set(id, product))
            );
    }

    updateProduct(id: string, productLike: Partial<Product>, ImageFileList? : FileList): Observable<Product> {

        const currentImages = productLike.images ?? [];

        return this.uploadImages(ImageFileList)
        .pipe(
            map( imagesNames => ({
                ...productLike,
                images: [...currentImages,...imagesNames]
            })),
            switchMap((updateProduct) => 
                this.http.patch<Product>(`${baseUrl}/products/${id}`, updateProduct)
            ),
            tap((product) => this.updateProductCache(product))
        )      
    // return this.http
    //   .patch<Product>(`${baseUrl}/products/${id}`, productLike)
    //   .pipe(tap((product) => this.updateProductCache(product)));
  }

      createProduct(productLike : Partial<Product>, ImageFileList?: FileList): Observable<Product> {
      return this.http
        .post<Product>(`${baseUrl}/products`, productLike)
        .pipe(tap((product) => this.updateProductCache(product)));
    }


    updateProductCache(product: Product) {
        const productId = product.id;

        this.productsByIdSlugCache.set(productId, product);

        this.productsCache.forEach((productsResponse) => {
            productsResponse.products = productsResponse.products.map((currentProduct) => {
                return currentProduct.id === productId ? product : currentProduct;

            }
            );
        });
        console.log('Producto actualizado en cache');
    }
    
    uploadImages(images? : FileList): Observable<string[]> {
        if(!images ) return of([]);

        const uploadObservables = Array.from(images).map( imageFile => this.uploadImage(imageFile) 
        );

        return forkJoin(uploadObservables);
    }

    uploadImage(imageFile : File): Observable<string> {
        const formData = new FormData();
        formData.append('file', imageFile);
        return this.http.post<{ FileName: string }>(`${baseUrl}/files/product`, formData)
        .pipe(
            map( (resp) => resp.FileName)
        )

    }
}