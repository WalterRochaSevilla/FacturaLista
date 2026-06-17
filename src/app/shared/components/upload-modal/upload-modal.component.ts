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

  isAnalyzing = false;
  analysisError: string | null = null;
  analysisResult: {
    extracted: { campos: any; confianza: Record<string, number>; metadatos: any };
    validation: { valida: boolean; errores: string[]; advertencias: string[]; creditoFiscal?: number; hashDedup?: string };
  } | null = null;

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
    this.analysisError = null;
    this.analysisResult = null;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('auth_token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    interface UploadResponse {
      docId: string;
      fallback?: boolean;
    }

    this.http.post<UploadResponse>(this.apiUploadUrl, formData, { headers }).pipe(
      catchError(err => {
        this.analysisError = err.error?.error || err.message || 'Error al subir el documento. Comprueba la conexión con el backend.';
        return of({ docId: 'doc-' + Date.now().toString().slice(-6), fallback: true });
      }),
      finalize(() => {
        this.isUploading = false;
      })
    ).subscribe(res => {
      if (!res?.docId) {
        return;
      }
      this.generatedDocId = res.docId;
      this.uploadSuccess = true;
      if (!res.fallback) {
        this.analyzeUpload();
      }
    });
  }

  analyzeUpload() {
    if (!this.generatedDocId) return;

    this.isAnalyzing = true;
    this.analysisError = null;
    this.analysisResult = null;

    const token = localStorage.getItem('auth_token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    this.http.post<{ extracted: any; validation: any }>('http://localhost:3000/api/analizar-scan', {
      docId: this.generatedDocId,
    }, { headers }).pipe(
      catchError(err => {
        this.analysisError = err.error?.error || err.message || 'Error durante el análisis IA.';
        return of(null);
      }),
      finalize(() => {
        this.isAnalyzing = false;
      })
    ).subscribe(result => {
      if (!result) return;
      this.analysisResult = result;
    });
  }
}
