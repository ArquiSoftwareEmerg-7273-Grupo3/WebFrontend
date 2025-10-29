import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  users = [
    {
      id: 1,
      name: 'María López',
    },
    {
      id: 2,
      name: 'Carlos Pérez',
    },
    {
      id: 3,
      name: 'Lucía Fernández',
    }
  ];

  selectedUserId = this.users[0].id; // Selecciona por defecto el primero

  get selectedUser() {
    return this.users.find(user => user.id === this.selectedUserId);
  }

  selectUser(userId: number) {
    this.selectedUserId = userId;
  }

}
