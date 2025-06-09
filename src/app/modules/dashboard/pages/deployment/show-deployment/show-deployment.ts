import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-show-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './show-deployment.html',
  styleUrl: './show-deployment.css'
})
export class ShowDeployment {
  // Angular-initialized properties
  protected readonly deploymentMode = new BehaviorSubject<'quick' | 'advanced' | null>(null);
  protected readonly loadingGitInfo = new BehaviorSubject<boolean>(false);
  protected readonly loadingDeployment = new BehaviorSubject<boolean>(false);
  
  // Form groups
  protected gitRepositoryForm: FormGroup;
  protected deploymentConfigForm: FormGroup;
  protected cloudProviderForm: FormGroup;
  protected secretsForm: FormGroup;
  
  // Data structures
  protected gitBranches: string[] = [];
  protected cloudProviders = [
    { id: 'aws', name: 'AWS', icon: 'assets/icons/aws.svg' },
    { id: 'gcp', name: 'Google Cloud', icon: 'assets/icons/gcp.svg' },
    { id: 'azure', name: 'Azure', icon: 'assets/icons/azure.svg' },
    { id: 'kubernetes', name: 'Kubernetes', icon: 'assets/icons/kubernetes.svg' },
    { id: 'vps', name: 'VPS', icon: 'assets/icons/vps.svg' }
  ];
  
  // Services
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  
  constructor() {
    this.gitRepositoryForm = this.formBuilder.group({
      repoUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*\.git$/)]],
      branch: ['', Validators.required]
    });
    
    this.deploymentConfigForm = this.formBuilder.group({
      deploymentType: ['', Validators.required]
    });
    
    this.cloudProviderForm = this.formBuilder.group({
      provider: ['', Validators.required],
      region: [''],
      highAvailability: [false]
    });
    
    this.secretsForm = this.formBuilder.group({
      secrets: this.formBuilder.array([])
    });
  }
  
  protected setDeploymentMode(mode: 'quick' | 'advanced'): void {
    this.deploymentMode.next(mode);
  }
  
  protected fetchGitBranches(): void {
    if (!this.gitRepositoryForm.get('repoUrl')?.valid) {
      return;
    }
    
    const repoUrl = this.gitRepositoryForm.get('repoUrl')?.value;
    this.loadingGitInfo.next(true);
    
    // Mock data for demo, would be replaced with actual API call
    setTimeout(() => {
      this.gitBranches = ['main', 'develop', 'feature/deployment', 'release/v1.0'];
      this.loadingGitInfo.next(false);
    }, 1000);
    
    // Actual implementation would look like:
    /*
    this.http.post('/api/git/branches', { repoUrl }).subscribe({
      next: (response: any) => {
        this.gitBranches = response.branches;
        this.loadingGitInfo.next(false);
      },
      error: (error) => {
        console.error('Error fetching branches', error);
        this.loadingGitInfo.next(false);
      }
    });
    */
  }
  
  protected startDeployment(): void {
    this.loadingDeployment.next(true);
    
    if (this.deploymentMode.value === 'quick') {
      console.log('Starting quick deployment with:', this.gitRepositoryForm.value);
      // API call would go here
    } else {
      console.log('Starting advanced deployment with:', {
        git: this.gitRepositoryForm.value,
        deployment: this.deploymentConfigForm.value,
        cloud: this.cloudProviderForm.value,
        secrets: this.secretsForm.value
      });
      // API call would go here
    }
    
    // Simulate API call
    setTimeout(() => {
      this.loadingDeployment.next(false);
      // Handle response
    }, 2000);
  }
  
  protected resetForms(): void {
    this.gitRepositoryForm.reset();
    this.deploymentConfigForm.reset();
    this.cloudProviderForm.reset();
    this.secretsForm.reset();
    this.deploymentMode.next(null);
  }
}
