import { Component } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'gold',
  standalone: true,
  imports: [NzTableModule, NgFor, NgIf, AsyncPipe],
  templateUrl: './gold.component.html',
  styleUrl: './gold.component.css',
})
export class Gold {
  constructor(private request: RequestService) {}

  public readonly dataReq$ = this.request.getData();
  public readonly data$: Observable<any> = this.dataReq$.pipe(
    map((data) => {
      if (!data) return [];
      return data;
    }),
  );

  public columnOrder = [
    'clientFioFull',
    'clientFirstName',
    'clientMiddleName',
    'clientLastName',
    'clientBday',
    'clientBplace',
    'clientCityzen',
    'clientResidentCd',
    'clientGender',
    'clientMaritalCd',
    'clientGraduate',
    'clientChildCnt',
    'clientMilCd',
    'clientZagranCd',
    'clientInn',
    'clientSnils',
    'clientVipCd',
    'contactEmail',
    'contactPhone',
    'addrRegion',
    'addrCountry',
    'addrZip',
    'addrStreet',
    'addrHouse',
    'addrFlat',
    'addrCity',
    'finRating',
    'finLoanLimit',
    'finLoanValue',
    'finLoanDebt',
    'finLoanPercent',
    'streamFavoriteShow',
    'streamDuration',
  ];
}
