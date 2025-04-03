import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { CreditCard, Loader, AlertCircle, CheckCircle, Clock, CalendarDays, FileText, Download } from 'lucide-react';
import {EstudiantePagoComprobante} from "./EstudiantePagoComprobante.jsx";
import {EstudiantePagoModal} from "./EstudiantePagoModal.jsx";
import {useAuth} from "../Auth/AuthContext.jsx";

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

export const EstudiantePagosCompleto = () => {
    //const { id } = useParams();
    const {user} = useAuth();
    const estudianteId = user.id;

    const [pagosPendientes, setPagosPendientes] = useState([]);
    const [pagosProximos, setPagosProximos] = useState([]);
    const [pagosPagados, setPagosPagados] = useState([]);
    const [loading, setLoading] = useState({ pendientes: true, proximos: true, pagados: true });
    const [error, setError] = useState({ pendientes: null, proximos: null, pagados: null });

    // Estados para modales
    const [modalPago, setModalPago] = useState({ visible: false, pagoId: null, monto: null });
    const [modalComprobante, setModalComprobante] = useState({ visible: false, pagoId: null });

    useEffect(() => {
        const fetchData = async (endpoint, setter, loadingKey, errorKey) => {
            if (!estudianteId) return;
            setLoading(prev => ({ ...prev, [loadingKey]: true }));
            setError(prev => ({ ...prev, [errorKey]: null }));
            try {
                const response = await axios.get(`${API_BASE_URL}/Pago/${endpoint}/${estudianteId}`);
                setter(response.data);
            } catch (err) {
                console.error(`Error fetching ${endpoint}:`, err);
                setError(prev => ({ ...prev, [errorKey]: `No se pudieron cargar los pagos ${endpoint}.` }));
            } finally {
                setLoading(prev => ({ ...prev, [loadingKey]: false }));
            }
        };

        fetchData('pendientes', setPagosPendientes, 'pendientes', 'pendientes');
        fetchData('proximos', setPagosProximos, 'proximos', 'proximos');
        fetchData('pagados', setPagosPagados, 'pagados', 'pagados');
    }, [estudianteId]);

    // Función para refrescar los datos después de realizar un pago
    const refreshData = async () => {
        const fetchData = async (endpoint, setter, loadingKey, errorKey) => {
            if (!estudianteId) return;
            setLoading(prev => ({ ...prev, [loadingKey]: true }));
            try {
                const response = await axios.get(`${API_BASE_URL}/Pago/${endpoint}/${estudianteId}`);
                setter(response.data);
            } catch (err) {
                console.error(`Error refreshing ${endpoint}:`, err);
            } finally {
                setLoading(prev => ({ ...prev, [loadingKey]: false }));
            }
        };

        await fetchData('pendientes', setPagosPendientes, 'pendientes', 'pendientes');
        await fetchData('pagados', setPagosPagados, 'pagados', 'pagados');
    };

    // Funciones para manejar los modales
    const handleOpenModalPago = (pagoId, monto) => {
        setModalPago({ visible: true, pagoId, monto });
    };

    const handleCloseModalPago = () => {
        setModalPago({ visible: false, pagoId: null, monto: null });
    };

    const handleOpenModalComprobante = (pagoId) => {
        setModalComprobante({ visible: true, pagoId });
    };

    const handleCloseModalComprobante = () => {
        setModalComprobante({ visible: false, pagoId: null });
    };

    const handlePaymentSuccess = () => {
        refreshData();
    };

    return (
        <div className="container mx-auto p-6">
            <nav aria-label="breadcrumb" className="mb-6">
                <ol className="flex space-x-2 text-sm text-gray-500">
                    <li><Link to="/estudiante" className="hover:text-indigo-600">Dashboard</Link></li>
                    <li><span className="mx-2">/</span></li>
                    <li className="font-medium text-gray-700" aria-current="page">Mis Pagos</li>
                </ol>
            </nav>

            <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                <CreditCard className="text-indigo-600" /> Mis Pagos
            </h1>

            {/* Pagos Pendientes */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-amber-700 flex items-center gap-2">
                    <Clock size={20}/> Pagos Pendientes
                </h2>
                {loading.pendientes && <Loader className="animate-spin text-amber-600" />}
                {error.pendientes && <p className="text-red-600">
                    <AlertCircle size={16} className="inline mr-1"/> {error.pendientes}
                </p>}
                {!loading.pendientes && !error.pendientes && pagosPendientes.length === 0 && (
                    <p className="text-gray-500">¡Genial! No tienes pagos pendientes.</p>
                )}
                {!loading.pendientes && !error.pendientes && pagosPendientes.length > 0 && (
                    <div className="space-y-4">
                        {pagosPendientes.map(pago => (
                            <div key={pago.idPago} className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                                <div>
                                    <p className="font-medium text-amber-800">Pendiente desde: {formatFechaCompleta(pago.fecha)}</p>
                                    <p className="text-xl font-bold text-amber-900">{formatMoneda(pago.monto)}</p>
                                    <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-800 font-medium">
                                        {pago.estado?.toLowerCase() === 'pendiente' ? 'Pendiente' : pago.estado}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleOpenModalPago(pago.idPago, pago.monto)}
                                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 self-start md:self-center">
                                    Pagar Ahora <CreditCard size={16}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Próximos Pagos */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
                    <CalendarDays size={20}/> Próximos Pagos
                </h2>
                {loading.proximos && <Loader className="animate-spin text-blue-600" />}
                {error.proximos && <p className="text-red-600">
                    <AlertCircle size={16} className="inline mr-1"/> {error.proximos}
                </p>}
                {!loading.proximos && !error.proximos && pagosProximos.length === 0 && (
                    <p className="text-gray-500">No hay pagos programados próximamente.</p>
                )}
                {!loading.proximos && !error.proximos && pagosProximos.length > 0 && (
                    <div className="space-y-4">
                        {pagosProximos.map((pago, index) => (
                            <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                                <div>
                                    <p className="font-medium text-blue-800">Fecha Límite: {formatFechaCompleta(pago.fechaProximo)}</p>
                                    <p className="text-xl font-bold text-blue-900">{formatMoneda(pago.monto)}</p>
                                    <span className="text-xs px-2 py-0.5 rounded bg-blue-200 text-blue-800 font-medium">
                                        {pago.estado?.toLowerCase() === 'proximo' ? 'Próximo' : pago.estado}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Historial de Pagos */}
            <section>
                <h2 className="text-2xl font-semibold mb-4 text-emerald-700 flex items-center gap-2">
                    <CheckCircle size={20}/> Historial de Pagos
                </h2>
                {loading.pagados && <Loader className="animate-spin text-emerald-600" />}
                {error.pagados && <p className="text-red-600">
                    <AlertCircle size={16} className="inline mr-1"/> {error.pagados}
                </p>}
                {!loading.pagados && !error.pagados && pagosPagados.length === 0 && (
                    <p className="text-gray-500">No tienes pagos realizados en tu historial.</p>
                )}
                {!loading.pagados && !error.pagados && pagosPagados.length > 0 && (
                    <div className="space-y-4">
                        {pagosPagados.map(pago => (
                            <div key={pago.idPago} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                                <div>
                                    <p className="font-medium text-emerald-800">Pagado el: {formatFechaCompleta(pago.fecha)}</p>
                                    <p className="text-xl font-bold text-emerald-900">{formatMoneda(pago.monto)}</p>
                                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 font-medium">
                                        {pago.estado}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleOpenModalComprobante(pago.idPago)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 self-start md:self-center">
                                    <FileText size={16} /> Ver Comprobante
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modales */}
            {modalPago.visible && (
                <EstudiantePagoModal
                    pagoId={modalPago.pagoId}
                    monto={modalPago.monto}
                    onClose={handleCloseModalPago}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            {modalComprobante.visible && (
                <EstudiantePagoComprobante
                    pagoId={modalComprobante.pagoId}
                    onClose={handleCloseModalComprobante}
                />
            )}
        </div>
    );
};