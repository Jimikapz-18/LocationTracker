import { Component, inject, OnInit, signal } from '@angular/core';
import { FriendService } from '../../services/friend.service';
import { IncomingFriendRequest } from '../../interface/dtos/incoming-friend-request';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';

@Component({
  selector: 'app-friend-requests',
  imports: [TimeAgoPipe],
  templateUrl: './friend-requests.html',
  styleUrl: './friend-requests.css'
})
export class FriendRequests implements OnInit {
  friendService = inject(FriendService);
  incomingRequests = signal<IncomingFriendRequest[]>([]);

  ngOnInit(): void {
    this.friendService.getIncomingFriendRequests().subscribe({
      next: (data) => this.incomingRequests.set(data)
    });
  }

  acceptRequest(senderId: string) {
    this.friendService.acceptFriendRequst(senderId).subscribe({
      next: () => {
        this.incomingRequests.update(reqs => reqs.filter(r => r.senderId !== senderId));
      }
    });
  }

  rejectRequest(senderId: string) {
    this.friendService.rejectFriendRequst(senderId).subscribe({
      next: () => {
        this.incomingRequests.update(reqs => reqs.filter(r => r.senderId !== senderId));
      }
    });
  }

  getInitials(name: string): string {
    return name.split(/[\s_@]/).map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const palette = ['#22d3ee', '#a78bfa', '#f472b6', '#fb923c', '#818cf8', '#4ade80', '#facc15', '#e879f9'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (name.charCodeAt(i) + ((h << 5) - h)) | 0;
    return palette[Math.abs(h) % palette.length];
  }
}
