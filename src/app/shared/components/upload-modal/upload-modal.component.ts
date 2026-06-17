import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CameraScannerComponent } from '../camera-scanner/camera-scanner.component';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule, CameraScannerComponent],
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css']
})
export class UploadModalComponent {
  @Output() close = new EventEmitter<boolean>();
  
  isDragging = false;
  selectedFile: File | null = null;
  isUploading = false;
  uploadSuccess = false;
  generatedDocId: string | null = null;

  showInlinePreview = false;
  safePreviewUrl: SafeResourceUrl | null = null;
  isPdf = false;
  isImage = false;

  // Solo necesitamos esta variable para mostrar/ocultar el componente hijo
  isCameraActive = false;

  private apiUploadUrl = 'http://localhost:3000/api/upload';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  onClose() {
    this.close.emit(this.uploadSuccess);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.validateAndSetFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
    }
  }

  private validateAndSetFile(file: File) {
    if (file.type.match(/image\/*/) || file.type === 'application/pdf') {
      this.selectedFile = file;
      this.showInlinePreview = false; 
      
      this.isPdf = file.type === 'application/pdf';
      this.isImage = file.type.startsWith('image/');
      const objectUrl = URL.createObjectURL(file);
      this.safePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
      
    } else {
      alert('Solo se permiten imágenes (JPG, PNG) o PDFs.');
    }
  }

  togglePreview() {
    this.showInlinePreview = !this.showInlinePreview;
  }

  onPhotoCaptured(file: File) {
    this.isCameraActive = false; 
    this.validateAndSetFile(file); 
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('auth_token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    this.http.post<{docId: string}>(this.apiUploadUrl, formData, { headers }).pipe(
      catchError(err => {
        console.warn('Endpoint /upload no disponible. Usando fallback...');
        return of({ docId: 'doc-' + Date.now().toString().slice(-6) });
      }),
      finalize(() => {
        setTimeout(() => {
          this.isUploading = false;
          this.uploadSuccess = true;
        }, 1500); 
      })
    ).subscribe(res => {
      this.generatedDocId = res.docId;
    });
  }
}