import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class SessionService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getLiveKitToken(room: string, role: string) {
    return this.http
      .get<{ token: string; wsUrl: string }>(`${this.apiUrl}/sessions/token`, {
        params: { room, role }
      })
      .toPromise();
  }
}