import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

const httpOtions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes'; // URL to web api

  constructor (
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  private log (message: string) {
    this.messageService.add('HeroService:' + message);
  }
  private handleError<T> (operation = 'operateion', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(() => this.log('featched heroes')),
      catchError(this.handleError('getHeroes', []))
    );
  }
  getHero (id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`featched hero id=${id}`)), catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOtions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)), catchError(this.handleError<any>('updateHero'))
    );
  }
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOtions).pipe(
      tap((heroReslut: Hero) => this.log(`added hero w/id=${heroReslut.id}`)), catchError(this.handleError<Hero>('addHero'))
    );
  }
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOtions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)), catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  searchHeroes (term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`), catchError(this.handleError<Hero[]>('searchHeroes', [])))
    );
  }
}
