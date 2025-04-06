import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-dashboard',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './header-dashboard.component.html',
  styleUrl: './header-dashboard.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderDashboardComponent implements OnInit {
  items: MenuItem[] | undefined = [
    {
      label: 'Home',
      icon: 'pi pi-home',
    },
    {
      label: 'Projects',
      icon: 'pi pi-search',
      badge: '3',
      items: [
        {
          label: 'Core',
          icon: 'pi pi-bolt',
          shortcut: '⌘+S',
        },
        {
          label: 'Blocks',
          icon: 'pi pi-server',
          shortcut: '⌘+B',
        },
        {
          separator: true,
        },
        {
          label: 'UI Kit',
          icon: 'pi pi-pencil',
          shortcut: '⌘+U',
        },
      ],
    },
  ];
  auth = inject(AuthService);
  ngOnInit(): void {}
  isMenuOpen = false;
  user$ = this.auth.user$;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  @ViewChild('menu') menuRef!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.isMenuOpen &&
      this.menuRef &&
      !this.menuRef.nativeElement.contains(event.target)
    ) {
      this.isMenuOpen = false;
    }
  }
  isDropdownOpen = false;
  router = inject(Router);

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(path: string) {
    this.isDropdownOpen = false;
    this.router.navigate([`/${path}`]);
  }

  logout() {
    this.isDropdownOpen = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Ferme le dropdown quand on clique en dehors
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }
}
