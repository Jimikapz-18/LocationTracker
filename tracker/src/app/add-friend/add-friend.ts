import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { FriendService } from '../../services/friend.service';
import { SearchUserResponse } from '../../interface/dtos/search-user-resposne';
import { FriendStatus } from '../../interface/dtos/friend-status';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-friend',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-friend.html',
  styleUrl: './add-friend.css'
})
export class AddFriend {

  searchControl = new FormControl('');
  friendService = inject(FriendService);
  toastService = inject(ToastService);
  users = signal<SearchUserResponse[]>([]);
  searched = signal(false);
  selectedUser = signal<SearchUserResponse | null>(null);
  selectedUserStatus = signal<FriendStatus | null>(null);

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term || term.trim() === '') {
            this.users.set([]);
            this.searched.set(false);
            return of([]);
          }
          this.searched.set(true);
          return this.friendService.searchUsers(term.trim());
        }),
      )
      .subscribe((res) => {
        this.users.set(res);
      });
  }
  selectUser(user: SearchUserResponse) {
    this.selectedUser.set(user);
    this.selectedUserStatus.set(null);

    this.friendService.getFriendStatus(user.id).subscribe({
      next: (status) => this.selectedUserStatus.set(status),
      error: (err) => {
        console.error('Error fetching status', err);
        this.selectedUserStatus.set(null);
      }
    });
  }

  sendFriendRequest() {
    if (this.selectedUser()) {
      const receiverId = this.selectedUser()?.id!;
      this.friendService.sendFriendRequest(receiverId).subscribe({
        next: () => {
          this.selectedUserStatus.set({
            isSentRequestToUser: true,
            isReceivedRequestFromUser: false,
            isFriend: false
          });
          this.toastService.success(`Friend Request to ${this.selectedUser()?.userName} sent`);
        },
        error: () => {
          this.toastService.error(`Failed to send friend request to ${this.selectedUser()?.userName} `);
        }
      })
    }
  }
  cancelFriendRequest() {
    if (this.selectedUser()) {
      const receiverId = this.selectedUser()?.id!;
      this.friendService.cancelFriendRequst(receiverId).subscribe({
        next: () => {
          this.selectedUserStatus.set({
            isSentRequestToUser: false,
            isReceivedRequestFromUser: false,
            isFriend: false
          });
          this.toastService.success(`Cancelled friend request to ${this.selectedUser()?.userName}`);
        },
        error: () => {
          this.toastService.error(`Failed to cancel friend request to ${this.selectedUser()?.userName} `);
        }
      })
    }
  }
  acceptFriendRequest() {
     if (this.selectedUser()) {
      const senderId = this.selectedUser()?.id!;
      this.friendService.acceptFriendRequst(senderId).subscribe({
        next: () => {
          this.selectedUserStatus.set({
            isFriend: true,
            isSentRequestToUser: false,
            isReceivedRequestFromUser: false
          });
          this.toastService.success(`Accepted friend request from ${this.selectedUser()?.userName}`);
        },
        error: () => {
          this.toastService.error(`Failed to accept friend request from ${this.selectedUser()?.userName} `);
        }
      })
    }
  }
  rejectFriendRequest() {
    if (this.selectedUser()) {
      const senderId = this.selectedUser()?.id!;
      this.friendService.rejectFriendRequst(senderId).subscribe({
        next: () => {
          this.selectedUserStatus.set({
            isFriend: false,
            isSentRequestToUser: false,
            isReceivedRequestFromUser: false
          });
          this.toastService.success(`Rejected friend request from ${this.selectedUser()?.userName}`);
        },
        error: () => {
          this.toastService.error(`Failed to reject friend request from ${this.selectedUser()?.userName} `);
        }
      })
    }
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
