import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [CommonModule],
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

  private apiUploadUrl = 'http://localhost:3000/upload';

  constructor(private http: HttpClient) {}

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
    } else {
      alert('Solo se permiten imágenes (JPG, PNG) o PDFs.');
    }
  }
  openPreview() {
    if (this.selectedFile) {
      const fileURL = URL.createObjectURL(this.selectedFile);
      window.open(fileURL, '_blank');
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<{docId: string}>(this.apiUploadUrl, formData).pipe(
      catchError(err => {
        console.warn('Endpoint /upload no disponible. Usando fallback...');
        return of({ docId: 'doc-' + Date.now().toString().slice(-6) });
      }),
      finalize(() => {
        setTimeout(() => {
          this.isUploading = false;
          this.uploadSuccess = true;
        }, 1000);
      })
    ).subscribe(res => {
      this.generatedDocId = res.docId;
    });
  }
}