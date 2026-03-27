'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

export function Toast({ id, message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const bgColor = {
    success: 'bg-gradient-to-r from-emerald-500/20 to-green-600/20 border-emerald-500/30',
    error: 'bg-gradient-to-r from-red-500/20 to-rose-600/20 border-red-500/30',
    info: 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-500/30',
  }[type];

  const textColor = {
    success: 'text-emerald-400',
    error: 'text-red-400',
    info: 'text-cyan-400',
  }[type];

  const icon = {
    success: <CheckCircle size={20} className={textColor} />,
    error: <AlertCircle size={20} className={textColor} />,
    info: <Info size={20} className={textColor} />,
  }[type];

  return (
    <div
      className={`glass-card ${bgColor} border rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300`}
      role="alert"
    >
      {icon}
      <div className="flex-1">
        <p className="text-white/90 text-sm">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-white/60 hover:text-white/90 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
