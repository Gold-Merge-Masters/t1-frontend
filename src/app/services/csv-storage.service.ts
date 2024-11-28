import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvStorageService {
  public originalData: any[] = [];
  public goldenRecords: any[] = [];

  public clearData() {
    this.originalData = [];
    this.goldenRecords = [];
  }

  private headers = [
    'client_id',
    'client_first_name',
    'client_middle_name',
    'client_last_name',
    'client_fio_full',
    'client_bday',
    'client_bplace',
    'client_cityzen',
    'client_resident_cd',
    'client_gender',
    'client_marital_cd',
    'client_graduate',
    'client_child_cnt',
    'client_mil_cd',
    'client_zagran_cd',
    'client_inn',
    'client_snils',
    'client_vip_cd',
    'contact_vc',
    'contact_tg',
    'contact_other',
    'contact_email',
    'contact_phone',
    'addr_region',
    'addr_country',
    'addr_zip',
    'addr_street',
    'addr_house',
    'addr_body',
    'addr_flat',
    'addr_area',
    'addr_loc',
    'addr_city',
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

  private quoutes = [
    'client_bday',
    'client_inn',
    'client_snils',
    'addr_zip',
    'addr_house',
    'addr_flat',
    'addr_str',
    'create_date',
    'update_date',
  ];

  private quotedHeaders = this.headers.map((header) => `"${header}"`);

  private csvRows = [this.quotedHeaders.join(',')];

  public getCsvFile() {
    const cleanedData = this.goldenRecords.filter((item) => !!item.client_fio_full);

    this.csvRows.push('\n');

    cleanedData.forEach((item) => {
      const row = this.headers
        .map((field) => {
          let value = item[field] || '';
          if (this.quoutes.includes(field) || !value) {
            value = `"${value}"`;
          }
          return value;
        })
        .join(',');
      this.csvRows.push(row);
      this.csvRows.push('\n');
    });

    const csvString = this.csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const file = new File([blob], 'data.csv', { type: 'text/csv' });
    
    return file;
  }
}

