import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-right-click-menu',
  standalone: true,
  imports: [NgIf],
  templateUrl: './right-click-menu.component.html',
  styleUrl: './right-click-menu.component.scss',
})
export class RightClickMenuComponent {
  @Output() menuItemSelected = new EventEmitter<string>();
  @Input() x = 0;
  @Input() y = 0;
  @Input() isVisible = false;

  onItemClick(action: string) {
    console.log(action);

    this.menuItemSelected.emit(action);
  }
}
