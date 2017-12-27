import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Waypoint } from './waypoint';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WaypointService {

  private waypointsUrl = 'api/waypoints';  // URL to web api

  constructor(
    private http: HttpClient) { }

  getWaypoints (): Observable<Waypoint[]> {
    return this.http.get<Waypoint[]>(this.waypointsUrl)
      .pipe(
        tap(waypoints => this.log(`fetched waypoints`)),
        catchError(this.handleError('getWaypoints', []))
      );
  }

  getWaypointNo404<Data>(id: number): Observable<Waypoint> {
    const url = `${this.waypointsUrl}/?id=${id}`;
    return this.http.get<Waypoint[]>(url)
      .pipe(
        map(waypoints => waypoints[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} waypoint id=${id}`);
        }),
        catchError(this.handleError<Waypoint>(`getWaypoint id=${id}`))
      );
  }

  getWaypoint(id: number): Observable<Waypoint> {
    const url = `${this.waypointsUrl}/${id}`;
    return this.http.get<Waypoint>(url).pipe(
      tap(_ => this.log(`fetched waypoint id=${id}`)),
      catchError(this.handleError<Waypoint>(`getWaypoint id=${id}`))
    );
  }

  addWaypoint (waypoint: Waypoint): Observable<Waypoint> {
    return this.http.post<Waypoint>(this.waypointsUrl, waypoint, httpOptions).pipe(
      tap((waypoint: Waypoint) => this.log(`added waypoint w/ id=${waypoint.id}`)),
      catchError(this.handleError<Waypoint>('addWaypoint'))
    );
  }

  deleteWaypoint (waypoint: Waypoint | number): Observable<Waypoint> {
    const id = typeof waypoint === 'number' ? waypoint : waypoint.id;
    const url = `${this.waypointsUrl}/${id}`;

    return this.http.delete<Waypoint>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted waypoint id=${id}`)),
      catchError(this.handleError<Waypoint>('deleteWaypoint'))
    );
  }

  updateWaypoint (waypoint: Waypoint): Observable<any> {
    return this.http.put(this.waypointsUrl, waypoint, httpOptions).pipe(
      tap(_ => this.log(`updated waypoint id=${waypoint.id}`)),
      catchError(this.handleError<any>('updateWaypoint'))
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
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    //
  }
}
