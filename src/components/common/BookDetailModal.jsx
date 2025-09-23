import React, { useEffect } from "react";
import "../styles/modal.scss"; // 경로가 다르면 조정하세요

function Modal({ isOpen, title, children, onClose, icon }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          {/* 아이콘(프롭으로 전달 가능, 없으면 기본 느낌표 원) */}
          <div className="modal-icon">
            {icon ?? (
              <div className="modal-icon-circle" aria-hidden="true">
                <span className="modal-icon-excl">!</span>
              </div>
            )}
          </div>

          {title && <h2 className="modal-title">{title}</h2>}
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;