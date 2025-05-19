import { Component, OnInit } from '@angular/core';
import { AdminUserService } from '../../core/services/admin-user.service';
import { UserResponse } from '../../core/models/user-response.model';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: UserResponse[] = [];

  constructor(private adminUserService: AdminUserService) {}

  ngOnInit(): void {
    this.adminUserService.getAllUsers().subscribe(data => {
      console.log('Kullanıcılar geldi:', data); // debug
      this.users = data;
    });
  }
  deleteUser(id: number): void {
    if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      this.adminUserService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
      });
    }
  }

  toggleStatus(user: UserResponse, index: number): void {
    this.adminUserService.toggleUserStatus(user.id!).subscribe({
      next: () => {
        this.users[index] = {
          ...this.users[index],
          active: !this.users[index].active
        };
      },
      error: err => {
        console.error('Durum güncellenemedi:', err);
      }
    });
  }


}
