import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react"; // <-- Removed X

type ToastType = "success" | "error" | "info";
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Use underscore to tell TS these are intentionally "unused" placeholders
const ToastContext = createContext({
  showToast: (_message: string, _type: ToastType) => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000); // Auto dismiss after 3s
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
  
<div style={{ 
  position: 'fixed', 
  bottom: '24px', 
  right: '24px', 
  left: '24px', /* <--- ADD THIS */
  zIndex: 9999, 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'flex-end', /* <--- Align to the right */
  gap: '8px',
  pointerEvents: 'none' /* Let clicks pass through the empty space */
}}>
  {toasts.map((toast) => (
    <div key={toast.id} style={{
      pointerEvents: 'auto', /* Re-enable clicks for the toast itself */
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px',
      padding: '16px', display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
      width: '100%',          /* Fill the available space */
      maxWidth: '340px',      /* But don't get too wide on desktop */
      borderLeft: `4px solid ${toast.type === 'success' ? 'var(--success)' : toast.type === 'error' ? 'var(--danger)' : 'var(--info)'}`
    }}>
      {toast.type === 'success' ? <CheckCircle size={20} style={{ color: 'var(--success)' }} /> : <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />}
      <span style={{ fontWeight: '500', fontSize: '14px' }}>{toast.message}</span>
    </div>
  ))}
</div>

    </ToastContext.Provider>
  );
}
