import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import { CreditCard, ChevronRight, AlertCircle, Loader } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const formatFechaCorta = (fechaISO) => {
    if (!fechaISO) return 'N/A';
    try {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (error) {
        console.error("Error formateando fecha:", error);
        return 'Fecha inválida';
    }
};

export const EstudiantePagosPreview = ({ estudianteId }) => {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!estudianteId) {
            setLoading(false);
            setError("ID de estudiante no proporcionado.");
            return;
        }

        const fetchPagos = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/Pago/proximos/${estudianteId}`);
                setPagos(response.data.slice(0, 2));
            } catch (err) {
                console.error("Error fetching próximos pagos:", err);
                setError("No se pudieron cargar los pagos.");
            } finally {
                setLoading(false);
            }
        };

        fetchPagos();
    }, [estudianteId]);
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-50 hover:shadow-xl transition-shadow">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-900">
                    <CreditCard className="text-indigo-600" size={20} />
                    Próximos Pagos
                </h2>
            </div>
            <div className="p-6 min-h-[150px]"> {/* Altura mínima para consistencia */}
                {loading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader className="animate-spin text-indigo-600" size={32} />
                    </div>
                )}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center text-center text-red-600">
                        <AlertCircle size={30} className="mb-2"/>
                        <p className="font-medium">Error</p>
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}
                {!loading && !error && pagos.length === 0 && (
                    <p className="text-center text-gray-500">No hay pagos próximos registrados.</p>
                )}
                {!loading && !error && pagos.length > 0 && (
                    <div className="space-y-4">
                        {pagos.map((pago, index) => (
                            <div key={index} className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-3 border border-gray-100 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">Próximo Pago</p>
                                        {/* Asumiendo que monto viene como número */}
                                        <p className="font-bold text-gray-900 text-lg">
                                            ${pago.monto?.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Fecha Límite:</p>
                                        <p className="font-medium text-gray-700">{formatFechaCorta(pago.fechaProximo)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && (
                    <NavLink
                        to="/estudiante/pago"
                        className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center w-full justify-center transition-colors"
                    >
                        Ver historial de pagos <ChevronRight size={16} className="ml-1" />
                    </NavLink>
                )}
            </div>
        </div>
    );
};