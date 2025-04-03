import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, X, Download, Printer, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const formatFechaCompleta = (fechaISO) => {
    if (!fechaISO) return 'N/A';
    try {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
    } catch {
        return 'Fecha inválida';
    }
};

const formatMoneda = (monto) => {
    return `$${monto?.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}`;
};

export const EstudiantePagoComprobante = ({ pagoId, onClose }) => {
    const [comprobante, setComprobante] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComprobante = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/Pago/comprobante/${pagoId}`);
                setComprobante(response.data);
            } catch (err) {
                console.error('Error obteniendo el comprobante:', err);
                setError('No se pudo cargar el comprobante. Inténtelo nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchComprobante();
    }, [pagoId]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        if (!comprobante) return;

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Comprobante de Pago', 105, 20, { align: 'center' });

        doc.setDrawColor(100, 100, 100);
        doc.rect(20, 30, 40, 15);
        doc.setFontSize(10);
        doc.text('LOGO UNIVERSIDAD', 40, 39, { align: 'center' });

        doc.setFontSize(12);
        doc.text('Universidad Nacional', 105, 40, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Sistema de Pagos Estudiantiles', 105, 46, { align: 'center' });
        doc.text('Av. Principal #123, Ciudad', 105, 52, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 60, 190, 60);

        doc.setFontSize(11);
        doc.text(`Número de Recibo: ${comprobante.idPago}`, 20, 70);
        doc.text(`Fecha: ${formatFechaCompleta(comprobante.fecha)}`, 20, 80);
        doc.text(`Estudiante: ${comprobante.nombreEstudiante}`, 20, 90);
        doc.text(`Estado: ${comprobante.estado}`, 20, 100);

        doc.setFontSize(14);
        doc.text('Monto Total:', 130, 90);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(`${formatMoneda(comprobante.monto)}`, 130, 100);
        doc.setFont(undefined, 'normal');

        doc.setFontSize(9);
        doc.text('Este documento es un comprobante oficial de pago.', 105, 240, { align: 'center' });
        doc.text(`Generado el ${new Date().toLocaleString('es-ES')}`, 105, 246, { align: 'center' });

        doc.save(`Comprobante_${comprobante.idPago}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-indigo-200 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-indigo-600" /> Comprobante de Pago
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="animate-spin text-indigo-600 mb-4" size={32} />
                            <p className="text-gray-600">Cargando comprobante...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
                            <AlertCircle size={20} className="text-red-500 mt-0.5" />
                            <div>
                                <p className="text-red-700">{error}</p>
                                <button
                                    onClick={onClose}
                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    )}

                    {!loading && !error && comprobante && (
                        <div id="comprobante-para-imprimir">
                            <div className="mb-6 p-4 border rounded-lg">
                                <div className="flex justify-center mb-4 py-2 bg-gray-50 rounded">
                                    <CheckCircle size={30} className="text-green-500" />
                                </div>
                                <h3 className="text-center text-xl font-semibold text-green-700 mb-4">
                                    Pago Confirmado
                                </h3>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Recibo No.:</span>
                                        <span className="font-medium">{comprobante.idPago}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Fecha:</span>
                                        <span>{formatFechaCompleta(comprobante.fecha)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Estudiante:</span>
                                        <span>{comprobante.nombreEstudiante}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Estado:</span>
                                        <span className="font-medium text-green-600">{comprobante.estado}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="text-gray-700 font-medium">Monto Total:</span>
                                        <span className="text-xl font-bold text-indigo-700">{formatMoneda(comprobante.monto)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    <Download size={18} /> Descargar PDF
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    <Printer size={18} /> Imprimir
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};