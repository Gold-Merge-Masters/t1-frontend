import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { of } from 'rxjs';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { CsvService } from '../../services/csv.service';
import { CsvStorageService } from '../../services/csv-storage.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'download',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzUploadModule, NzTypographyModule, NzProgressModule, RouterLink],
  templateUrl: './download.component.html',
  styleUrl: './download.component.css',
})
export class Download {
  constructor(
    private messageService: NzMessageService,
    public csvService: CsvService,
    public csvStorage: CsvStorageService,
  ) {}

  public file: File | null = null;
  isDisabled = false;

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    if (fileList.length > 0) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }

    const status = file.status;
    if (status === 'done') {
      this.messageService.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.messageService.error(`${file.name} file upload failed.`);
    }
  }

  public preventRequest = (item: any) => {
    this.file = item.file;

    if (this.file) {
      const fileName = this.file.name;
      this.csvService.uploadCsv(this.file).subscribe(
        (csvData: any) => {
          this.csvStorage.clearData();
          const { original, goldenRecords } = this.csvService.createGoldenRecords(csvData);
          this.csvStorage.originalData = original;
          this.csvStorage.goldenRecords = goldenRecords;

          item.onSuccess({}, item.file);
          this.messageService.success(`${fileName} file uploaded and processed successfully.`);
        },
        (error) => {
          item.onError(error, item.file);
          this.messageService.error(`${fileName} file upload failed.`);
        },
      );
    }
    return of({}).subscribe();
  };
}
