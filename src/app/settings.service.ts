import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Settings } from './settings';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SettingsService {

  private settingsUrl = 'api/settings';  // URL to web api

  constructor(
    private http: HttpClient) { }

  getSettings(): Observable<Settings> {
    const url = `${this.settingsUrl}/${0}`;
    return this.http.get<Settings>(url).pipe(
      tap(_ => console.log(`fetched settings`)),
      catchError(this.handleError<Settings>(`getSettings`))
    );
  }

  getSettingsNo404<Data>(): Observable<Settings> {
    const url = `${this.settingsUrl}/?id=${0}`;
    return this.http.get<Settings[]>(url)
      .pipe(
        map(settings => settings[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          console.log(`${outcome} settings`);
        }),
        catchError(this.handleError<Settings>(`getSettings id=${0}`))
      );
  }

  updateSettings (settings: Settings): Observable<any> {
    return this.http.put(this.settingsUrl, settings, httpOptions).pipe(
      tap(_ => console.log(`updated settings` + JSON.stringify(settings))),
      catchError(this.handleError<any>('updateSettings'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
