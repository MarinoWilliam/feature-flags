import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../../core/state/error-handler.service';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="errorService.errorMessage() as msg"
      class="alert alert-danger position-fixed top-0 end-0 m-3 shadow"
      style="z-index: 9999; min-width: 300px;"
    >
      {{ msg }}
    </div>
  `
})
export class ErrorMessageComponent {
  errorService = inject(ErrorHandlerService);
}
