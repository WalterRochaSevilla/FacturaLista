import { Component, ElementRef, EventEmitter, OnDestroy, AfterViewInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-scanner.component.html',
  styleUrls: ['./camera-scanner.component.css']
})
export class CameraScannerComponent implements AfterViewInit, OnDestroy {
  @Output() capture = new EventEmitter<File>();
  @Output() cancel = new EventEmitter<void>();
  
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  private stream: MediaStream | null = null;
  public errorMsg: string | null = null;

  ngAfterViewInit() {
    this.startCamera();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (err) {
      this.errorMsg = 'Permiso denegado o cámara no disponible.';
    }
  }

  takePhoto() {
    if (!this.videoElement) return;
    const video = this.videoElement.nativeElement;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], `captura-factura-${Date.now()}.jpg`, { type: 'image/jpeg' });
          this.capture.emit(file);
        }
      }, 'image/jpeg', 0.9);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}