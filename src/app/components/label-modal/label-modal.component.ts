import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-label-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './label-modal.component.html',
  styleUrl: './label-modal.component.scss',
})
export class LabelModalComponent {
  @Input() color: string = '';
  @Input() backgroundColor: string = '';
  @Input() text: string = '';
  @Input() isVisible = false;

  @Output() saveChanges = new EventEmitter<{
    color: string;
    backgroundColor: string;
    text: string;
  }>();
  @Output() delete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<boolean>();

  onSaveChanges() {
    this.saveChanges.emit({
      color: this.color,
      backgroundColor: this.backgroundColor,
      text: this.text,
    });
  }

  onDelete() {
    this.delete.emit();
  }

  onCancel() {
    this.cancel.emit(false);
  }
}
