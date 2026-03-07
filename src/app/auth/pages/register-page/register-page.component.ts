import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent { 

  fb = inject(FormBuilder);

  registerForm = this.fb.group({
    fullName: ['',[Validators.required, Validators.minLength(3)]],
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(6)]],
    confirmPassword: ['',[Validators.required, Validators.minLength(6)]],
  });


  
}
