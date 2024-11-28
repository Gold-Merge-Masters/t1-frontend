import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  private baseUrl: string = `http://localhost:3001/demo`;

  public upload(file: File, description: string) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('description', description);
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      responseType: 'text',
      observe: 'body',
    });
  }

  public getData() {
    return this.http.get(`${this.baseUrl}/clients`);
  }
}
