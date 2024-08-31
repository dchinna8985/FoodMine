import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject ;
  public userObservable:Observable<User>;

  constructor(private http:HttpClient, private toastrService:ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User{
    return this.userSubject.value;
  }

  login(userLogin:IUserLogin):Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.userSubject.next(user);
          this.setUserToLocalStorage(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.name}`,
            'Login Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }

  register(userRegister:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          this.userSubject.next(user);
          this.setUserToLocalStorage(user);
          this.toastrService.success(
            `Welcome to the FoodMine ${user.name}`,
            'Register Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed');
        }
      })
    );
  }

  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage():User{

    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem(USER_KEY);
      if(userJson) return JSON.parse(userJson) as User;
      return new User();
    }
    return new User();
  }
}
