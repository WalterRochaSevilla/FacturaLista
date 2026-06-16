import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eula-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eula-modal.component.html',
  styleUrls: ['./eula-modal.component.css']
})
export class EulaModalComponent implements OnInit {
  @Input() requireScrollToAccept: boolean = false; 
  @Output() closeEvent = new EventEmitter<boolean>(); 

  hasScrolledToBottom = false;

  ngOnInit() {
    if (!this.requireScrollToAccept) {
      this.hasScrolledToBottom = true;
    }
  }

  onScroll(event: Event) {
    if (!this.requireScrollToAccept || this.hasScrolledToBottom) return;
    
    const target = event.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 15) {
      this.hasScrolledToBottom = true;
    }
  }

  onAccept() {
    this.closeEvent.emit(true);
  }

  onCancel() {
    this.closeEvent.emit(false);
  }
}