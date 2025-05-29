import React from 'react';
import './QRCodeModal.css';

const QRCodeModal = ({ isOpen, onClose, qrCodeImage, eventTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content qr-code-modal">
                <div className="modal-header">
                    <h3>Event QR Code</h3>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">
                    <h4>{eventTitle}</h4>
                    {qrCodeImage ? (
                        <div className="qr-code-container">
                            <img src={qrCodeImage} alt="Event QR Code" />
                            <p>Show this QR code at the event entrance</p>
                        </div>
                    ) : (
                        <div className="loading-state">
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Generating QR code...</p>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="secondary-button" onClick={onClose}>
                        Close
                    </button>
                    <button 
                        className="primary-button"
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = qrCodeImage;
                            link.download = `qr-code-${eventTitle}.png`;
                            link.click();
                        }}
                    >
                        Download QR Code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal; 