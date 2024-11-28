import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { Download } from '../pages/download/download.component';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { CsvStorageService } from '../services/csv-storage.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    Download,
    NzCheckboxModule,
    NzGridModule,
    RouterLink,
    NzStepsModule,
    AsyncPipe,
    NgClass,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class Layout implements OnInit {
  constructor(
    private router: Router,
    private csvStorage: CsvStorageService,
  ) {}

  isCollapsed = false;
  public step: number = 0;

  public url$ = new BehaviorSubject('');

  ngOnInit(): void {
    this.router.events.pipe().subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateStepBasedOnRoute(event.urlAfterRedirects);
        if (event.urlAfterRedirects.includes('gold')) {
        } else if (!event.urlAfterRedirects.includes('upload') && !this.csvStorage.originalData.length) {
          this.router.navigateByUrl('/');
        }

        this.url$.next(event.urlAfterRedirects);
      }
    });
  }

  private updateStepBasedOnRoute(url: string): void {
    if (url.includes('upload')) {
      this.step = 0;
    } else if (url.includes('compare')) {
      this.step = 1;
    } else if (url.includes('preparing')) {
      this.step = 2;
    } else if (url.includes('gold')) {
      this.step = 3;
    }
  }
}
