import {Component, OnInit} from '@angular/core';
import {
  concatMap,
  delay,
  map,
  mergeMap,
  switchMap,
  exhaustMap,
  concatMapTo, finalize
} from "rxjs/operators";
import {from, Observable, of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rxjs-playground';

  public mapData = [];
  public mergeMapData = [];
  public switchMapData = [];
  public concatMapData = [];
  public concatMapToData = [];
  public exhaustMapData = [];

  private source$ = from([1, 2, 3, 4, 5, 6]);

  private getData$ = (index: number): Observable<string> => {
    const delayTime = Math.floor(Math.random() * 600) + 100;
    return of(`retrieved new data with index: ${index} and delay: ${delayTime}`).pipe(
      delay(delayTime)
    )
  };

  ngOnInit(): void {
    this.mapSubscribe();
  }

  /**
   * The observables subscriptions
   */

  private mapSubscribe() {
    this.map$().pipe(finalize(() => {
      this.mergeMapSubscribe();
    })).subscribe((value: Observable<string>) => {
      value.pipe().subscribe((valueMapped: string) => {
        this.mapData.push(valueMapped);
      });
    });
  }

  private mergeMapSubscribe() {
    this.mergeMap$().pipe(finalize(() => {
      this.switchMapSubscribe();
    })).subscribe((value: string) => {
      this.mergeMapData.push(value);
    });
  }

  private switchMapSubscribe() {
    this.switchMap$().pipe(finalize(() => {
      this.concatMapSubscribe();
    })).subscribe((value: string) => {
      this.switchMapData.push(value);
    });
  }

  private concatMapSubscribe() {
    this.concatMap$().pipe(finalize(() => {
      this.concatMapToSubscribe();
    })).subscribe((value: number | string) => {
      this.concatMapData.push(value);
    });
  }

  private concatMapToSubscribe() {
    this.concatMapTo$().pipe(finalize(() => {
      this.exhaustMapToSubscribe();
    })).subscribe((value: number | string) => {
      this.concatMapToData.push(value);
    });
  }

  private exhaustMapToSubscribe() {
    this.exhaustMap$().pipe(finalize(() => {
    })).subscribe((value: string) => {
      this.exhaustMapData.push(value);
    });
  }

  /**
   * Observables with different operators for comparison
   */

  private map$(): Observable<Observable<string>> {
    return this.source$.pipe(
      map((index: number) => this.getData$(index))
    );
  }

  private mergeMap$(): Observable<string> {
    return this.source$.pipe(
      mergeMap((index: number) => this.getData$(index))
    );
  }

  private switchMap$(): Observable<string> {
    return this.source$.pipe(
      switchMap((index: number) => this.getData$(index))
    )
  }

  private concatMap$(): Observable<number | string> {
    return this.source$.pipe(
      concatMap((index: number) => this.getData$(index))
    )
  }

  private concatMapTo$(): Observable<string> {
    return this.source$.pipe(
      concatMapTo(this.getData$(null), (index: number, str: string) => {
        return `${index} - ${str}`;
      })
    )
  }

  private exhaustMap$(): Observable<string> {
    return this.source$.pipe(
      exhaustMap((index: number) => this.getData$(index))
    )
  }
}
