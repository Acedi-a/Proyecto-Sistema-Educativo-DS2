import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, X, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const EstudiantePagoModal = ({ pagoId, monto, onClose, onPaymentSuccess }) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Formato para número de tarjeta: agregar espacios cada 4 dígitos
        if (name === 'cardNumber') {
            const sanitized = value.replace(/[^\d]/g, '');
            const formatted = sanitized.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
            setFormData({ ...formData, [name]: formatted.substring(0, 19) });
            return;
        }

        // Formato para fecha de expiración: MM/YY
        if (name === 'expiryDate') {
            const sanitized = value.replace(/[^\d]/g, '');
            let formatted = sanitized;
            if (sanitized.length > 2) {
                formatted = `${sanitized.substring(0, 2)}/${sanitized.substring(2, 4)}`;
            }
            setFormData({ ...formData, [name]: formatted });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (formData.cardNumber.replace(/\s/g, '').length < 16) {
                throw new Error('El número de tarjeta debe tener 16 dígitos');
            }

            if (formData.cvv.length < 3) {
                throw new Error('El CVV debe tener al menos 3 dígitos');
            }

            await axios.put(`${API_BASE_URL}/Pago/pagar/${pagoId}`);

            setSuccess(true);
            setTimeout(() => {
                onPaymentSuccess();
                onClose();
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-indigo-200 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <CreditCard className="text-indigo-600" /> Realizar Pago
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
                            <h3 className="text-xl font-medium text-green-700 mb-2">¡Pago Realizado con Éxito!</h3>
                            <p className="text-gray-600">El pago se ha procesado correctamente.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
                                <p className="text-gray-700">Monto a pagar:</p>
                                <p className="text-2xl font-bold text-indigo-800">
                                    ${monto?.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                                    <AlertCircle size={18} className="text-red-500 mt-0.5" />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Número de Tarjeta
                                    </label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        maxLength={19}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre del Titular
                                    </label>
                                    <input
                                        type="text"
                                        id="cardHolder"
                                        name="cardHolder"
                                        value={formData.cardHolder}
                                        onChange={handleChange}
                                        placeholder="Como aparece en la tarjeta"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de Expiración
                                        </label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            placeholder="MM/YY"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            maxLength={5}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                            CVV
                                        </label>
                                        <input
                                            type="password"
                                            id="cvv"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder="XXX"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center items-center gap-2 px-4 py-3 mt-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <span className="animate-spin inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2"></span>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={18} /> Pagar Ahora
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 text-xs text-gray-500 rounded-b-lg">
                    <p>Esta es una simulación de pago seguro. No se procesará ningún cargo real.</p>
                </div>
            </div>
        </div>
    );
};