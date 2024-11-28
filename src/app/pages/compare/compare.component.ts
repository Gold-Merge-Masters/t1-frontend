import { NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CsvStorageService } from '../../services/csv-storage.service';
import { CsvService } from '../../services/csv.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'compare',
  standalone: true,
  imports: [NzTableModule, NgFor, NgIf, NzGridModule, NzButtonModule, NgClass, RouterLink],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css',
})
export class Compare implements AfterViewInit {
  constructor(
    public csvService: CsvService,
    public csvStorage: CsvStorageService,
  ) {}

  @ViewChild('fixedTable1', { static: false })
  table1!: any;
  @ViewChild('fixedTable2', { static: false })
  table2!: any;

  ngAfterViewInit() {
    if (this.csvStorage.originalData.length > 0 && this.csvStorage.goldenRecords.length > 0) {
      this.addScrollListeners();
    }
  }

  private addScrollListeners() {
    if (this.table1 && this.table2) {
      const table1Scroll = this.table1.elementRef.nativeElement.querySelector('.ant-table-body');
      const table2Scroll = this.table2.elementRef.nativeElement.querySelector('.ant-table-body');

      if (table1Scroll && table2Scroll) {
        table1Scroll.addEventListener('scroll', (event: any) => {
          return this.onScroll(event, table2Scroll);
        });
        table2Scroll.addEventListener('scroll', (event: any) => this.onScroll(event, table1Scroll));
      }
    }
  }

  onScroll(event: any, targetTable: HTMLElement | null): void {
    if (targetTable) {
      targetTable.scrollTop = event.target.scrollTop;
      targetTable.scrollLeft = event.target.scrollLeft;
    }
  }
}
