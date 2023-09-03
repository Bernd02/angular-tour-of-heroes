import { Injectable } from '@angular/core';
import { HEROES } from '../models/mock-heroes';
import { Hero } from '../models/hero';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HeroService {
    // pattern url HttpClientInMemoryWebApiModule
    // :base/:collection
    private heroesUrl = "api/heroes";

    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
    };

    constructor(
        private http: HttpClient,
        private messageService: MessageService) { }

    // --------------------------------------------------
    getHeroes(): Observable<Hero[]> {
        // const heroes = of(HEROES);
        // this.log(`Fetched heroes`);
        // return heroes;
        // -----
        return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
                // https://angular.io/tutorial/tour-of-heroes/toh-pt6#tap-into-the-observable
                // tap() bekijkt de waarden van de observable, en doet er iets mee.
                tap(_ => this.log("Fetched Heroes")),

                // https://angular.io/tutorial/tour-of-heroes/toh-pt6#error-handling
                catchError(this.handleError<Hero[]>("getHeroes"))
            );
    }

    // -----
    getHero(id: number): Observable<Hero> {
        // const hero = HEROES.find(h => h.id === id)!;
        // this.log(`Fetched hero id=${id}`);
        // return of(hero);
        // -----

        const url = `${this.heroesUrl}/${id}`;
        return this.http.get<Hero>(url)
            .pipe(
                tap(_ => this.log(`Fetched Hero id=${id}`)),
                catchError(this.handleError<Hero>("getHero"))
            );
    }

    // -----
    updateHero(hero: Hero): Observable<any> {
        return this.http.put(this.heroesUrl, hero, this.httpOptions)
            .pipe(
                tap(_ => this.log(`Updated Hero id=${hero.id}`)),
                catchError(this.handleError<any>("updateHero"))
            );
    }

    // -----
    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
            .pipe(
                tap((newHero: Hero) => this.log(`Added hero w/ id=${newHero.id}`)),
                catchError(this.handleError<Hero>("addHero"))
            );
    }

    // -----
    deleteHero(id: number): Observable<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.delete<Hero>(url, this.httpOptions)
            .pipe(
                tap(_ => this.log(`Deleted hero id=${id}`)),
                catchError(this.handleError<Hero>("deleteHero"))
            );
    }

    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) return of([]);

        const url = `${this.heroesUrl}/?name=${term}`;
        return this.http.get<Hero[]>(url)
            .pipe(
                tap((values) => {
                    values.length
                        ? this.log(`Found heroes matching ${term}`)
                        : this.log(`No heroes matching ${term}`)
                }),
                catchError(this.handleError<Hero[]>("searchHeroes"))
            );
    }

    // --------------------------------------------------
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = "operation", result?: T) {
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
        this.messageService.add(`HeroService: ${message}`);
    }
}
