import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SavedAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth/address`;

  getAddress(): Observable<{ success: boolean; data: SavedAddress }> {
    return this.http.get<{ success: boolean; data: SavedAddress }>(this.apiUrl);
  }

  saveAddress(address: SavedAddress): Observable<{ success: boolean; message: string; data: SavedAddress }> {
    return this.http.put<{ success: boolean; message: string; data: SavedAddress }>(this.apiUrl, address);
  }
}
