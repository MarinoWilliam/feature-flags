import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private activeRequests = signal(0);

  isLoading = computed(() => this.activeRequests() > 0);

  start() {
    this.activeRequests.update(v => v + 1);
  }

  stop() {
    this.activeRequests.update(v => Math.max(0, v - 1));
  }
}
