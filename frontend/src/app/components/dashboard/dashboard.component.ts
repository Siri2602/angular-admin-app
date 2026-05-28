import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RecordsService } from '../../services/records.service';
import { User, Record } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  records: Record[] = [];
  isLoadingProfile = true;
  isLoadingRecords = true;
  recordsDelay = 0;       // configurable delay in ms
  delayApplied = 0;
  totalRecords = 0;
  errorMessage = '';
  loadStartTime = 0;
  loadDuration = 0;

  constructor(
    private auth: AuthService,
    private recordsService: RecordsService
  ) {}

  ngOnInit(): void {
    // Async load: User profile and records load independently
    this.loadProfile();
    this.loadRecords();
  }

  loadProfile(): void {
    this.isLoadingProfile = true;
    this.auth.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.isLoadingProfile = false;
      },
      error: () => {
        this.user = this.auth.currentUser;
        this.isLoadingProfile = false;
      }
    });
  }

  loadRecords(): void {
    this.isLoadingRecords = true;
    this.errorMessage = '';
    this.loadStartTime = Date.now();

    this.recordsService.getRecords(this.recordsDelay).subscribe({
      next: (response) => {
        this.loadDuration = Date.now() - this.loadStartTime;
        this.records = response.records;
        this.totalRecords = response.totalRecords;
        this.delayApplied = response.delayApplied;
        this.isLoadingRecords = false;
      },
      error: (err) => {
        this.loadDuration = Date.now() - this.loadStartTime;
        this.errorMessage = err.error?.message || 'Failed to load records.';
        this.isLoadingRecords = false;
      }
    });
  }

  onDelayChange(): void {
    this.loadRecords();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': return 'status-progress';
      case 'active': return 'status-active';
      case 'critical': return 'status-critical';
      case 'draft': return 'status-draft';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }
}
