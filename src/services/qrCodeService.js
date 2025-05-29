import fetchApi from '../utils/apiInterceptor';

export const qrCodeService = {
    generateTicket: async (reservationId, type, seatNumber) => {
        try {
            const response = await fetchApi('/tickets/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    reservationId,
                    type,
                    seatNumber
                }
            });
            return response;
        } catch (error) {
            console.error('Error generating ticket:', error);
            throw error;
        }
    },

    // Keep the existing QR code generation for backward compatibility
    generateQRCode: async (text, width = 300, height = 300) => {
        try {
            const response = await fetchApi(`/qrcode/generate?text=${encodeURIComponent(text)}&width=${width}&height=${height}`);
            return response;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }
}; 