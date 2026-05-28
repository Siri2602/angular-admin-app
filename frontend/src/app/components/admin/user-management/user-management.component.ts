import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  apiDelay = 0;
  loadDuration = 0;
  errorMessage = '';
  successMessage = '';

  // Add user form
  showAddForm = false;
  addForm!: FormGroup;
  isAdding = false;

  // Edit user
  editingUserId: number | null = null;
  editForm!: FormGroup;
  isUpdating = false;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['General User', Validators.required],
      department: ['']
    });

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      department: [''],
      status: ['']
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const start = Date.now();

    this.userService.getUsers(this.apiDelay).subscribe({
      next: (users) => {
        this.users = users;
        this.loadDuration = Date.now() - start;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load users.';
        this.loadDuration = Date.now() - start;
        this.isLoading = false;
      }
    });
  }

  onDelayChange(): void {
    this.loadUsers();
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      this.addForm.reset({ role: 'General User' });
    }
  }

  addUser(): void {
    if (this.addForm.invalid) return;
    this.isAdding = true;
    this.clearMessages();

    this.userService.registerUser(this.addForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.showAddForm = false;
        this.isAdding = false;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add user.';
        this.isAdding = false;
      }
    });
  }

  startEdit(user: User): void {
    this.editingUserId = user.id;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status
    });
  }

  cancelEdit(): void {
    this.editingUserId = null;
  }

  saveEdit(id: number): void {
    if (this.editForm.invalid) return;
    this.isUpdating = true;
    this.clearMessages();

    this.userService.updateUser(id, this.editForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.editingUserId = null;
        this.isUpdating = false;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update user.';
        this.isUpdating = false;
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.name}" (${user.userId})?`)) return;
    this.clearMessages();

    this.userService.deleteUser(user.id).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete user.';
      }
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
