import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as Papa from 'papaparse';
import * as stringSimilarity from 'string-similarity';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  public columnOrder = [
    'client_id',
    'client_first_name',
    'client_middle_name',
    'client_last_name',
    'client_bday',
    'client_gender',
    'client_marital_cd',
    'client_child_cnt',
    'client_graduate',
    'client_mil_cd',
    'client_zagran_cd',
    'client_inn',
    'client_snils',
    'client_vip_cd',
    'contact_vc',
    'contact_tg',
    'contact_email',
    'contact_phone',
    'addr_region',
    'addr_country',
    'addr_city',
    'addr_zip',
    'addr_street',
    'addr_house',
    'addr_body',
    'addr_flat',
    'addr_area',
    'addr_loc',
    'addr_reg_dt',
    'addr_str',
    'fin_rating',
    'fin_loan_limit',
    'fin_loan_value',
    'fin_loan_debt',
    'fin_loan_percent',
    'fin_loan_begin_dt',
    'fin_loan_end_dt',
    'stream_favorite_show',
    'stream_duration',
    'create_date',
    'update_date',
    'source_cd',
  ];

  constructor() {}

  public uploadCsv(file: File): Observable<any> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvData = Papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
        });

        observer.next(csvData.data);
        observer.complete();
      };
      reader.readAsText(file);
    });
  }

  public createGoldenRecords(csvData: any[]): {
    original: any[];
    goldenRecords: any[];
  } {
    const groupedData = this.groupByUser(csvData);
    const goldenRecords: any[] = [];
    const originalData: any[] = [];

    groupedData.forEach((group) => {
      const mostFrequent = this.getMostFrequentFio(group);
      goldenRecords.push(this.createGoldenRecord(mostFrequent));

      group.forEach((record: any) => {
        if (record.client_fio_full !== mostFrequent.client_fio_full) {
          originalData.push(this.createEmptyRecord());
        } else {
          originalData.push(record);
        }
      });

      while (goldenRecords.length < originalData.length) {
        goldenRecords.push(this.createEmptyRecord());
      }
    });

    while (goldenRecords.length < originalData.length) {
      goldenRecords.push(this.createEmptyRecord());
    }

    return { original: originalData, goldenRecords };
  }

  private normalizeData(data: any): any {
    const normalized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        normalized[key] = data[key]
          ? data[key]
              .toString()
              .trim()
              .toLowerCase()
              .replace(/[^\w\sа-яё]/gi, '')
              .replace(/\s+/g, ' ')
          : '';

        if (key.includes('date') || key.includes('bday')) {
          normalized[key] = this.normalizeDate(data[key]);
        }
      }
    }
    return normalized;
  }

  private normalizeDate(date: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().split('T')[0];
  }

  private groupByUser(csvData: any[]): any[] {
    const grouped: { [key: string]: any[] } = {};
    const normalizedData = csvData.map((record) => this.normalizeData(record));

    normalizedData.forEach((record) => {
      const key = `${record.client_fio_full}_${record.client_bday}_${record.client_inn}_${record.client_snils}_${record.contact_phone}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(record);
    });

    return Object.values(grouped);
  }

  private getMostFrequentFio(group: any[]): any {
    const fioSimilarityThreshold = 0.85;
    const frequencyMap: { [key: string]: { record: any; count: number } } = {};

    group.forEach((record) => {
      const fio = record.client_fio_full;
      let matched = false;

      for (const key in frequencyMap) {
        if (stringSimilarity.compareTwoStrings(fio, key) >= fioSimilarityThreshold) {
          frequencyMap[key].count++;
          matched = true;
          break;
        }
      }

      if (!matched) {
        frequencyMap[fio] = { record, count: 1 };
      }
    });

    const sortedByFrequency = Object.values(frequencyMap).sort((a, b) => b.count - a.count);
    if (sortedByFrequency.length > 1 && sortedByFrequency[0].count === sortedByFrequency[1].count) {
      return this.getMostCompleteRecord(group);
    }

    return sortedByFrequency[0].record;
  }

  private getMostCompleteRecord(group: any[]): any {
    return group.reduce((prev, current) => {
      const prevScore = this.calculateCompletenessScore(prev);
      const currentScore = this.calculateCompletenessScore(current);
      return currentScore > prevScore ? current : prev;
    });
  }

  private calculateCompletenessScore(record: any): number {
    const importantFields = [
      'client_inn',
      'client_snils',
      'client_phone',
      'client_email',
      'addr_region',
      'addr_city',
      'addr_street',
      'client_bday',
      'fin_rating',
      'fin_loan_limit',
    ];
    let score = 0;

    importantFields.forEach((field) => {
      if (record[field] && record[field] !== '') {
        score++;
      }
    });

    if (record.contact_phone || record.contact_email) {
      score += 2;
    }
    return score;
  }

  private createGoldenRecord(record: any): any {
    return { ...record, golden: true };
  }

  private createEmptyRecord(): any {
    return {};
  }
}
