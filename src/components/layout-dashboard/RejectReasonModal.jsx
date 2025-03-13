import React, { useState } from "react";
import RejectReasonWrapper from "../../assets/wrappers/RejectReasonWrapper";

const RejectReasonModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason); // Gửi lý do từ chối
    onClose(); // Đóng modal
  };

  return (
    <RejectReasonWrapper>
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Nhập lý do từ chối</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              required
            />
            <div className="modal-actions">
              <button type="button" onClick={onClose}>
                Hủy
              </button>
              <button type="submit">Xác nhận</button>
            </div>
          </form>
        </div>
      </div>
    </RejectReasonWrapper>
  );
};

export default RejectReasonModal;
