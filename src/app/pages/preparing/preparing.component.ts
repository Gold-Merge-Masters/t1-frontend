import { AfterViewInit, Component } from '@angular/core';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { RequestService } from '../../services/request.service';
import { tap, mergeMap, from, delay, map, catchError, EMPTY } from 'rxjs';
import { CsvStorageService } from '../../services/csv-storage.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'preparing',
  standalone: true,
  imports: [NzProgressModule, NzButtonModule, RouterLink],
  templateUrl: './preparing.component.html',
  styleUrl: './preparing.component.css',
})
export class Preparing implements AfterViewInit {
  constructor(
    private request: RequestService,
    private csvStorage: CsvStorageService,
    private notification: NzNotificationService,
  ) {}
  public progress = 0;
  public status: 'success' | 'exception' | 'active' | 'normal' = 'active';

  ngAfterViewInit(): void {
    if (this.csvStorage.goldenRecords) this.customRequest();
  }

  private customRequest() {
    const file = this.csvStorage.getCsvFile();
    this.status = 'active';
    this.request
      .upload(file, 'newcsv')
      .pipe(
        tap(() => (this.progress = 0)),
        mergeMap((response: string) => {
          const chunks = response.split('}{').map((chunk, index, array) => {
            if (index === 0) return `${chunk}}`;
            if (index === array.length - 1) return `{${chunk}`;
            return `{${chunk}}`;
          });
          return from(chunks);
        }),
        delay(1000),
        map((chunk: string) => JSON.parse(chunk)),
        tap((chunk) => (this.progress = Math.round((chunk.current / chunk.total) * 100))),
        catchError(() => {
          this.status = 'exception';
          this.createNotification();
          return EMPTY;
        }),
      )
      .subscribe({
        next: (res) => {
          this.status = 'success';
        },
        error: () => {
          this.status = 'exception';
        },
      });
  }

  createNotification(): void {
    this.notification.error('Упс, что-то пошло не по плану', 'Загрузка была прерванна из-за непредвиденной ошибки', {
      nzPlacement: 'bottom',
    });
  }
}
