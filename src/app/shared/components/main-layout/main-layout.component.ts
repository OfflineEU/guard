import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {interval, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  date$: Observable<Date> = interval(1000)
    .pipe(
      map(() => new Date())
    );
  date: Date = new Date();
  sub: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    this.sub = this.date$.subscribe(date => {
      this.date = date;
    });
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
