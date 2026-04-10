import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of ns.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" (click)="ns.remove(toast.id)">
          <span class="toast__icon">
            @if (toast.type === 'success') { ✓ }
            @else if (toast.type === 'error') { ✕ }
            @else if (toast.type === 'warning') { ⚠ }
            @else { ℹ }
          </span>
          <span class="toast__message">{{ toast.message }}</span>
          <button class="toast__close" (click)="ns.remove(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-width: 260px;
      width: 100%;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-family: 'Lora', 'Times New Roman', serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.4;
      cursor: pointer;
      animation: slideIn 0.35s cubic-bezier(0.16,1,0.3,1);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(110%); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .toast--success {
      background: linear-gradient(135deg, rgba(245,230,195,0.97), rgba(240,217,181,0.97));
      color: #6b4226;
      border: 1px solid #D4A574;
    }
    .toast--error {
      background: linear-gradient(135deg, rgba(139,0,0,0.95), rgba(107,0,0,0.95));
      color: #F8F1E9;
      border: 1px solid rgba(165,42,42,0.6);
    }
    .toast--warning {
      background: linear-gradient(135deg, rgba(241,220,196,0.97), rgba(230,195,165,0.97));
      color: #7a4520;
      border: 1px solid #D4A574;
    }
    .toast--info {
      background: linear-gradient(135deg, rgba(248,241,233,0.97), rgba(235,232,227,0.97));
      color: #5a4e43;
      border: 1px solid #E8E4DF;
    }
    .toast__icon { font-size: 12px; flex-shrink: 0; opacity: 0.9; }
    .toast__message { flex: 1; letter-spacing: 0.01em; }
    .toast__close {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.5;
      font-size: 14px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      flex-shrink: 0;
      min-height: unset;
      transition: opacity 0.2s;
    }
    .toast__close:hover { opacity: 1; }
    @media (max-width: 576px) {
      .toast-container { top: 70px; right: 12px; max-width: calc(100vw - 24px); }
    }
  `]
})
export class ToastComponent {
  ns = inject(NotificationService);
}
