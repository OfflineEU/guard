import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Cameras} from '../../../environments/interface';

@Injectable({
  providedIn: 'root'
})

export class CamerasService {

  constructor(private http: HttpClient) {}

    getInfo():Observable<Cameras> {
      return this.http.get<Cameras>(`${environment.fbDBUrl}/cameras.json`);
    }

}
