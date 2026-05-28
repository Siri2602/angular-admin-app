import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserManagementComponent } from './user-management/user-management.component';

@NgModule({
  declarations: [AdminComponent, UserManagementComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AdminRoutingModule]
})
export class AdminModule { }
