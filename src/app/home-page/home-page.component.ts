import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {DatabaseService} from '../shared/services/database.service';
import {Staff} from '../../environments/interface';
import {interval, Subscription, timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  ready: boolean = false;
  staffArr: Staff[];
  subColumns: string[] = ['personal number', 'employee', 'arrival', 'leaving', 'demand'];
  columns: string[] = ['Персональний номер', 'Робітник', 'Почав роботу', 'Закінчив роботу', 'Норма'];
  stream$: Subscription;
  staffLoading = true;

  constructor(
    public auth: AuthService,
    private database: DatabaseService,
    public alert: AlertService,
  ) {
  }

  ngOnInit() {
    this.stream$ = interval(3000)
      .pipe(
        map(() => this.getStaffInfo())
      ).subscribe(() => {
        this.ready = true;
        this.staffLoading = false;
      });
  }

  getStaffInfo() {
    this.database.getStaffData().subscribe(data => this.staffArr = data);
    setTimeout(() => {
      this.ready = true;
    }, 1000);
  }

  reloadStaffStatus() {
    this.stream$.unsubscribe();
    this.staffLoading = true;
    this.stream$ = timer(2000, 5000)
      .pipe(
        map(() => this.getStaffInfo())
      ).subscribe(() => {
        this.staffLoading = false;
      });
  }
  reloadStaffBtn() {
    setTimeout(() => this.alert.success('Дані обліку персоналу оновлено'), 2000);
  }

  ngOnDestroy() {
    this.stream$.unsubscribe();
  }

}
