import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {ApiURL} from '../../environment/environment'
import { SearchUserResponse } from "../interface/dtos/search-user-resposne";
import { FriendStatus } from "../interface/dtos/friend-status";
import { IncomingFriendRequest } from "../interface/dtos/incoming-friend-request";

@Injectable({
    providedIn:'root'
})
export class FriendService{
    private http = inject(HttpClient);
    private baseUrl = ApiURL; 
    searchUsers(searchText:string){
        let queryParams = new HttpParams();
        queryParams = queryParams.append("username",searchText);
        return this.http.get<SearchUserResponse[]>(`${this.baseUrl}/api/friend/search`,{
            params : queryParams
        });
    }
    getFriendStatus(userId:string){
        let queryParams = new HttpParams();
        queryParams = queryParams.append('userId',userId);
        return this.http.get<FriendStatus>(`${this.baseUrl}/api/friend/status`,{
           params: queryParams 
        });
    }
    sendFriendRequest(receiverId:string){
        return this.http.post(`${this.baseUrl}/api/friend/request/send`,{
           receiverId:receiverId
        });
    }
    cancelFriendRequst(receiverId:string){
        return this.http.post(`${this.baseUrl}/api/friend/request/cancel`,{
           receiverId:receiverId
        });
    }
    rejectFriendRequst(senderId:string){
        return this.http.post(`${this.baseUrl}/api/friend/request/reject`,{
           senderId:senderId
        });
    }
    acceptFriendRequst(senderId:string){
        return this.http.post(`${this.baseUrl}/api/friend/request/accept`,{
           senderId:senderId
        });
    }
    getIncomingFriendRequests(){
        return this.http.get<IncomingFriendRequest[]>(`${this.baseUrl}/api/friend/incomingrequests`);
    }
}