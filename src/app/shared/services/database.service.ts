import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Cameras, FbCreateResponse, Fire, Report, Staff} from '../../../environments/interface';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(private http: HttpClient) {
  }

  getCamerasData(): Observable<Cameras> {
    return this.http.get<Cameras>(`${environment.fbDBUrl}/cameras.json`);
  }

  getStaffData(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${environment.fbDBUrl}/2/data.json`);
}
  getFireData(): Observable<Fire> {
    return this.http.get<Fire>(`${environment.fbDBUrl}/fire.json`);
  }
  sendReport(report: Report): Observable<Report> {
    return this.http.post(`${environment.fbDBUrl}/reports.json`, report)
      .pipe(map((response: FbCreateResponse) => {
        return {
          ...report,
          id: response.name,
          currentDate: new Date(report.date),
        }
      }))
  }


}
