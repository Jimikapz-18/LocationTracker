import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: 'auth/login',
        loadComponent: () => import('./auth/login/login').then(x => x.Login)
    },
    {
        path: 'auth/register',
        loadComponent: () => import('./auth/register/register').then(x => x.Register)
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(x => x.Home),
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'map', pathMatch: 'full' },
            {
                path: 'map',
                loadComponent: () => import('./map/map').then(x => x.MapComponent)
            },
            {
                path: 'friends',
                loadComponent: () => import('./add-friend/add-friend').then(x => x.AddFriend)
            },
            {
                path: 'requests',
                loadComponent: () => import('./friend-requests/friend-requests').then(x => x.FriendRequests)
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];
