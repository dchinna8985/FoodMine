import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { tap } from 'rxjs';

let pendingRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.showLoading();
  pendingRequests += 1;

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          handleHideLoading(loadingService);
        }
      },
      error: (_) => {
        handleHideLoading(loadingService);
      }
    })
  );
};

function handleHideLoading(loadingService: LoadingService) {
  pendingRequests -= 1;
  if (pendingRequests === 0) {
    loadingService.hideLoading();
  }
}
