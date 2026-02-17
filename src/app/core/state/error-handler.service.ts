import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private _errorMessage = signal<string | null>(null);

  errorMessage = this._errorMessage.asReadonly();

  showError(message: string) {
    this._errorMessage.set(message);

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear() {
    this._errorMessage.set(null);
  }
}
