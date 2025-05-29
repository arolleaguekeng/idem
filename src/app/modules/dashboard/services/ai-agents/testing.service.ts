import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

// Define a basic interface for Test items
export interface TestItem {
  id?: string;
  name: string;
  status?: string; // e.g., 'pending', 'running', 'passed', 'failed'
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class TestingService {
  private apiUrl = `${environment.services.api.url}/project/tests`; // Placeholder API URL

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private getAuthHeaders(): Observable<HttpHeaders> {
    return authState(this.auth).pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return throwError(() => new Error('User not authenticated for TestingService operation'));
        }
        return from(user.getIdToken());
      }),
      map(token => {
        if (!token) {
          // Corrected: throw a direct error
          throw new Error('Failed to retrieve ID token. User authenticated but token is null.');
        }
        return new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      }),
      catchError(error => {
        // Log the original error message for better debugging
        console.error('Error in getAuthHeaders:', error.message);
        // Re-throw a new error that includes the original message
        return throwError(() => new Error('Authentication header could not be generated: ' + error.message));
      })
    );
  }

  // Create a new test item
  createTestItem(item: TestItem): Observable<TestItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.post<TestItem>(this.apiUrl, item, { headers });
      }),
      tap(response => console.log('createTestItem response:', response)),
      catchError(error => {
        console.error('Error in createTestItem:', error);
        return throwError(() => error); // Ensure error is re-thrown
      })
    );
  }

  // Get all test items
  getTestItems(): Observable<TestItem[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<TestItem[]>(this.apiUrl, { headers });
      }),
      tap(response => console.log('getTestItems response:', response)),
      catchError(error => {
        console.error('Error in getTestItems:', error);
        return throwError(() => error);
      })
    );
  }

  // Get a specific test item by ID
  getTestItemById(id: string): Observable<TestItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<TestItem>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap(response => console.log('getTestItemById response:', response)),
      catchError(error => {
        console.error(`Error in getTestItemById for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Update a specific test item
  updateTestItem(id: string, item: Partial<TestItem>): Observable<TestItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.put<TestItem>(`${this.apiUrl}/${id}`, item, { headers });
      }),
      tap(response => console.log('updateTestItem response:', response)),
      catchError(error => {
        console.error(`Error in updateTestItem for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Delete a specific test item
  deleteTestItem(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap(response => console.log(`deleteTestItem response for ID ${id}:`, response)),
      catchError(error => {
        console.error(`Error in deleteTestItem for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
