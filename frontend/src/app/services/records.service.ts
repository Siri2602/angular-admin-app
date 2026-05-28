import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecordsResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class RecordsService {
  private apiUrl = 'http://localhost:3000/api/records';

  constructor(private http: HttpClient) {}

  /** Get records with configurable delay (showcases async processing). */
  getRecords(delay: number = 0): Observable<RecordsResponse> {
    return this.http.get<RecordsResponse>(`${this.apiUrl}?delay=${delay}`);
  }
}
