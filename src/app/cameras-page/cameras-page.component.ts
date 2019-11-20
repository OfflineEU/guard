import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatabaseService} from '../shared/services/database.service';
import {interval, Subscription, timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {AlertService} from '../shared/services/alert.service';
import * as $ from 'jquery';
import {Cameras, Fire, Report} from '../../environments/interface';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cameras-page',
  templateUrl: './cameras-page.component.html',
  styleUrls: ['./cameras-page.component.scss'],
})

export class CamerasPageComponent implements OnInit, OnDestroy {

  cameras: Cameras = {'camera-one': true, 'camera-two': true, 'camera-three': true, 'camera-four': true,};
  streamCameras$: Subscription;
  camerasLoading = true;
  fire: Fire = {'sensor-1': true, 'sensor-2': true, 'sensor-3': true};
  streamFire$: Subscription;
  fireLoading = true;
  form: FormGroup;
  submitted = false;


  constructor(
    private database: DatabaseService,
    public alert: AlertService,
  ) {
  }

  ngOnInit() {
    this.streamCameras$ = interval(3000)
      .pipe(
        map(() => {
          this.getCamerasInfo();
        })
      ).subscribe(() => {
        this.camerasLoading = false;
      });
    this.streamFire$ = interval(3000)
      .pipe(
        map(() => {
          this.getFireInfo();
        })
      ).subscribe(() => {
        this.fireLoading = false;
      });
    $('.warningBtn').on('click', () => {
      $('.modal').css('display', 'block');
    });
    $('.close').on('click', () => {
      $('.modal').css('display', 'none');
      this.form.reset();
    });

    this.form = new FormGroup({
      camera: new FormControl(null, [
        Validators.required,
      ]),
      date: new FormControl(null, [
        Validators.required,
      ]),
      time: new FormControl(null, [
        Validators.required,
      ]),
      text: new FormControl(null, [
        Validators.required,
        Validators.minLength(10)
      ])
    });

  }

  ngOnDestroy() {
    this.streamCameras$.unsubscribe();
    this.streamFire$.unsubscribe();
  }

  getCamerasInfo() {
    this.database.getCamerasData().subscribe(data => {
      this.cameras = {...data};
    });
  }

  reloadCamerasStatus() {
    this.streamCameras$.unsubscribe();
    this.camerasLoading = true;
    this.streamCameras$ = timer(2000, 5000)
      .pipe(
        map(() => this.getCamerasInfo())
      ).subscribe(() => {
        this.camerasLoading = false;
      });
  }

  reloadCamsBtn() {
    setTimeout(() => this.alert.success('Дані камер оновлено'), 2000);
  }


  getFireInfo() {
    this.database.getFireData().subscribe(data => {
      this.fire = {...data};
    });
  }

  reloadFireStatus() {
    this.streamFire$.unsubscribe();
    this.fireLoading = true;
    this.streamFire$ = timer(2000, 5000)
      .pipe(
        map(() => this.getFireInfo())
      ).subscribe(() => {
        this.fireLoading = false;
      });
  }

  reloadFireBtn() {
    setTimeout(() => this.alert.success('Дані ПБ оновлено'), 2000);
  }

  submit() {
    if (this.form.valid) {
      this.submitted = true;
      const formData: Report = {
        ...this.form.value,
        reportTime: `${new Date().getDate()}.${new Date().getMonth() + 1}.${new Date().getFullYear()}; ${new Date().getHours()}:${new Date().getMinutes() + 1}`
      };
      this.database.sendReport(formData).subscribe(() => {
        $('.modal').css('display', 'none');
        this.form.reset();
        this.submitted = false;
      });
      this.alert.success('Звіт відправлено');

    }
  }
}
