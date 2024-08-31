import { Component } from '@angular/core';
import { TitleComponent } from "../../partials/title/title.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PasswordsMatchValidator } from '../../../shared/validators/password_match_validator';
import { IUserRegister } from '../../../shared/interfaces/IUserRegister';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from "../../partials/text-input/text-input.component";
import { DefaultButtonComponent } from "../../partials/default-button/default-button.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, TitleComponent, TextInputComponent, DefaultButtonComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  registerForm! : FormGroup;
  isSubmitted = false;

  returnUrl = '';

  constructor(
    private formBuilder : FormBuilder,
    private userService : UserService,
    private activatedRoute : ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]]
    },{
      validators: PasswordsMatchValidator('password', 'confirmPassword')
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit(){
    this.isSubmitted = true;
    if(this.registerForm.invalid) return;

    const fv = this.registerForm.value;
    const user : IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address
    };

    this.userService.register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
