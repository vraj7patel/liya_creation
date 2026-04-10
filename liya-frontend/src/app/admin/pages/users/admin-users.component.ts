import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-users">
      <h1>User Management</h1>
      
      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span [class]="user.isBlocked ? 'blocked' : 'active'">
                  {{ user.isBlocked ? 'Blocked' : 'Active' }}
                </span>
              </td>
              <td>
                <button 
                  class="btn-toggle" 
                  (click)="toggleBlock(user)"
                  [class.btn-unblock]="user.isBlocked"
                  [class.btn-block]="!user.isBlocked">
                  {{ user.isBlocked ? 'Unblock' : 'Block' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-users { padding: 20px; }
    .users-table table { width: 100%; border-collapse: collapse; }
    .users-table th, .users-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .blocked { color: red; font-weight: bold; }
    .active { color: green; font-weight: bold; }
    .btn-toggle { padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; }
    .btn-block { background: #dc3545; color: white; }
    .btn-unblock { background: #198754; color: white; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any>(`${this.apiUrl}/users`).subscribe({
      next: (res) => this.users = res.data,
      error: (err) => console.error(err)
    });
  }

  toggleBlock(user: any) {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.http.put<any>(`${this.apiUrl}/users/${user._id}/block`, {}).subscribe({
        next: () => this.loadUsers(),
        error: (err: any) => console.error(err)
      });
    }
  }
}
