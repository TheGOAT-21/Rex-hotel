import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
  isActive: boolean;
}

interface BreadcrumbItem {
  label: string;
  path: string | null;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css'
})
export class BreadcrumbsComponent implements OnInit {
  @Input() items: BreadcrumbItem[] = [];
  breadcrumbs: Breadcrumb[] = [];
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    if (this.items.length > 0) {
      this.breadcrumbs = this.items.map((item, index) => ({
        label: item.label,
        url: item.path || '',
        isActive: index === this.items.length - 1
      }));
    } else {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      ).subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
      
      // Initialize breadcrumbs on component init
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    }
  }
  
  private createBreadcrumbs(
    route: ActivatedRoute, 
    url: string = '', 
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    // Get the route children
    const children: ActivatedRoute[] = route.children;
    
    // Return if no children
    if (children.length === 0) {
      return breadcrumbs;
    }
    
    // For each child
    for (const child of children) {
      // Get the route URL
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      
      // Skip if no URL
      if (routeURL === '') {
        return this.createBreadcrumbs(child, url, breadcrumbs);
      }
      
      // Append route URL to URL
      url += `/${routeURL}`;
      
      // Get route data and extract title
      const routeData = child.snapshot.data;
      const label = routeData['title'] || this.getDefaultLabel(routeURL);
      
      // Create breadcrumb
      const breadcrumb: Breadcrumb = {
        label: label,
        url: url,
        isActive: false
      };
      
      // Add breadcrumb
      breadcrumbs.push(breadcrumb);
      
      // Recursive
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    
    // Mark the last breadcrumb as active
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isActive = true;
    }
    
    return breadcrumbs;
  }
  
  // Get a label from the URL if no title is provided in route data
  private getDefaultLabel(path: string): string {
    // Custom mapping for specific paths
    const pathMap: { [key: string]: string } = {
      'catalog': 'Catalogue',
      'spaces': 'Espaces',
      'rooms': 'Chambres',
      'events': 'Événements',
      'restaurants': 'Restaurants',
      'reservation': 'Réservation',
      'confirmation': 'Confirmation'
    };
    
    return pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
  }
}