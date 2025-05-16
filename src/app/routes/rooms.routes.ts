import { Routes } from '@angular/router';

export const ROOMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../features/rooms/rooms-list/rooms-list.component').then(m => m.RoomsListComponent),
    title: 'Nos Chambres | REX HOTEL'
  },
  {
    path: ':id',
    loadComponent: () => import('../features/rooms/room-detail/room-detail.component').then(m => m.RoomDetailComponent),
    title: 'Détail de Chambre | REX HOTEL'
  }
];