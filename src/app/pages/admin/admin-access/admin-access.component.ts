import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolePermissionsService, PageItem } from '../../../shared/services/role-permissions.service';

@Component({
  selector: 'app-admin-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-access.component.html',
  styles: []
})
export class AdminAccessComponent implements OnInit {
  private rolePermissionsService = inject(RolePermissionsService);

  availablePages: PageItem[] = [];
  teacherPermissions: Record<string, boolean> = {};
  studentPermissions: Record<string, boolean> = {};
  savedMessage = '';

  ngOnInit(): void {
    this.availablePages = this.rolePermissionsService.getAvailablePages();
    this.loadPermissions();
  }

  private loadPermissions(): void {
    this.rolePermissionsService.fetchPermissions().subscribe({
      next: (permissions) => {
        this.availablePages.forEach((page) => {
          this.teacherPermissions[page.key] = permissions.teacher.includes(page.key);
          this.studentPermissions[page.key] = permissions.student.includes(page.key);
        });
      },
      error: () => {
        const permissions = this.rolePermissionsService.getPermissions();
        this.availablePages.forEach((page) => {
          this.teacherPermissions[page.key] = permissions.teacher.includes(page.key);
          this.studentPermissions[page.key] = permissions.student.includes(page.key);
        });
      }
    });
  }

  savePermissions(): void {
    const teacher = this.availablePages
      .filter((page) => this.teacherPermissions[page.key])
      .map((page) => page.key);
    const student = this.availablePages
      .filter((page) => this.studentPermissions[page.key])
      .map((page) => page.key);

    this.rolePermissionsService.setPermissions({ teacher, student }).subscribe({
      next: () => {
        this.savedMessage = 'Permissions saved successfully.';
      },
      error: () => {
        this.savedMessage = 'Unable to save permissions. Please try again.';
      }
    });
  }
}
