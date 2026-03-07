import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '../../../../products/interfaces/product.interface';
import { ProductCarouselComponent } from "../../../../products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../utils/form-utils';
import { FormErrorLabel } from "../../../../shared/components/form-error-label/form-error-label";
import { ProductsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements  OnInit{ 
  
  product = input.required<Product>();
  private prodocutService = inject(ProductsService);
  wasSaved = signal(false);

  tempImages = signal<string[]>([]);
  imageFileList : FileList | undefined = undefined;

  imagesToCarousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImages()];
    return currentProductImages;
  })

  router = inject(Router);
  fb = inject(FormBuilder);

  sizes = ['XS','S','M','L','XL','XXL'];

  productForm = this.fb.group({
    title: [ '', Validators.required],
    description: [ '', Validators.required],
    slug: [ '', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [ 0, [Validators.required, Validators.min(0)]],
    stock: [ 0, [Validators.required, Validators.min(0)]],
    sizes: [ [''], Validators.required ],
    images: [[]],
    tags: [''],
    gender: [ 'men', [Validators.required,Validators.pattern(/men|women|kid|unisex/)]],


  });

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    // this.productForm.patchValue(formLike as any);
  }

  onSizeClicked(size: string){
    const currentSizes = this.productForm.value.sizes ?? [];
    if( currentSizes.includes(size) ){
      currentSizes.splice( currentSizes.indexOf(size), 1 );
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit(){
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };
    
    if (this.product().id === 'new') {
      //crear producto
      const product = await firstValueFrom( 
        this.prodocutService.createProduct( productLike, this.imageFileList )
      );
      console.log('Producto creado', product);
      this.router.navigateByUrl(`/admin/products/${product.id}`);
    }
    else {
      await firstValueFrom(
        this.prodocutService.updateProduct(this.product().id, productLike, this.imageFileList )
      );
    }
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }


  //images
  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;
    
    const imageUrl = Array.from(fileList ?? []).map((file) => URL.createObjectURL(file));
    this.tempImages.set(imageUrl);
  }

}
