import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatamuseSynonym } from '../types/datamuse-synonym';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://api.datamuse.com';

  constructor(private http: HttpClient) {}

  getSynonyms(text: string): Observable<DatamuseSynonym[]> {
    const url = `${this.apiUrl}/words?ml=${encodeURIComponent(text)}`;
    return this.http.get<DatamuseSynonym[]>(url);
  }
}
