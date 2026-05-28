import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  /** Get all users (Admin only). delay param showcases async processing. */
  getUsers(delay: number = 0): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?delay=${delay}`);
  }

  updateUser(id: number, data: Partial<User & { password?: string }>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/register', data);
  }
}
