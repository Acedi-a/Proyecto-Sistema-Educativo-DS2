import axios from 'axios';
import clsx from 'clsx'; 
import {useState, useEffect, useRef, useCallback} from 'react';
import { AlertTriangle, X } from "lucide-react";


const AlertaVencimiento = ({ alerta, onClose, isVisible }) => {

    const getMensaje = () => {
        if (!alerta) return null;
        if (alerta.tipo === 'examen') {
            return `Examen de ${alerta.materia} ${alerta.diasRestantes === 0 ? 'hoy' :
                alerta.diasRestantes === 1 ? 'mañana' :
                    `en ${alerta.diasRestantes} días`}.`;
        } else {
            return `Pago de $${alerta.monto?.toLocaleString('es-BO', { minimumFractionDigits: 2 })} vence ${
                alerta.diasRestantes === 0 ? 'hoy' :
                    alerta.diasRestantes === 1 ? 'mañana' :
                        `en ${alerta.diasRestantes} días`}.`;
        }
    };

    if (!alerta) return null;

    return (
        <div className=" bottom-4 right-4 left-4 z-50 flex justify-center items-start pointer-events-none">
            <div
                className={clsx(
                    'w-full max-w-md rounded-md shadow-lg overflow-hidden',
                    'bg-cyan-500 text-white', 
                    'pointer-events-auto', 
                    'transition-all duration-500 ease-out', 
                    {
                        'opacity-100 translate-y-0': isVisible,  
                        'opacity-0 -translate-y-full': !isVisible, 
                    }
                )}
            >
                {/* Contenido interno de la alerta */}
                <div className="flex items-center justify-between p-3">
                    <div className="flex items-center">
                        <AlertTriangle className="mr-2 flex-shrink-0" size={20} />
                        <div>
                            <div className="font-bold">VENCIMIENTO PRÓXIMO</div>
                            <div className="text-sm">{getMensaje()}</div> 
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="ml-2 flex-shrink-0 rounded-full p-1 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
                        aria-label="Cerrar alerta"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};


export const NotificacionesToast = ({ estudianteId, apiBaseUrl }) => {
    const [alertasQueue, setAlertasQueue] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);
    const hasFetched = useRef(false);

    const DISPLAY_DURATION = 5000; // 5 segundos
    const ANIMATION_DURATION = 500;

    useEffect(() => {
        if (!estudianteId || error || hasFetched.current) {
            if (!estudianteId) setLoading(false);
            return;
        }
        const fetchProximosVencimientos = async () => {
            setLoading(true);
            setError(null);
            console.log("Fetching notificaciones...");
            try {
                const examenesResponse = await axios.get(`${apiBaseUrl}/Examen/academico/examenes/${estudianteId}`);
                const proximosExamenes = examenesResponse.data
                    .filter(ex => typeof ex.diasRestantes === 'number' && ex.diasRestantes >= 0 && ex.diasRestantes < 5)
                    .map(ex => ({
                        id: `examen-${ex.idExamen || Date.now() * Math.random()}`, // ID Único
                        tipo: 'examen',
                        materia: ex.nombreMateria || 'Materia Desconocida',
                        diasRestantes: ex.diasRestantes,
                        fecha: new Date(ex.fechaExamen).toLocaleDateString('es-ES')
                    }));

                const pagosResponse = await axios.get(`${apiBaseUrl}/Pago/proximos/${estudianteId}`);
                const proximosPagos = pagosResponse.data
                    .map(pago => {
                        const fechaPago = new Date(pago.fechaProximo);
                        if (isNaN(fechaPago.getTime())) return null;
                        const hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);
                        fechaPago.setHours(0,0,0,0);
                        const diferenciaTiempo = fechaPago.getTime() - hoy.getTime();
                        const diasRestantesPago = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

                        if (diasRestantesPago >= 0 && diasRestantesPago < 5) {
                            return {
                                id: `pago-${pago.idPago || Date.now() * Math.random()}`, // ID Único
                                tipo: 'pago',
                                monto: pago.monto,
                                diasRestantes: diasRestantesPago,
                                fecha: fechaPago.toLocaleDateString('es-ES')
                            };
                        }
                        return null;
                    })
                    .filter(pago => pago !== null);

                const todasAlertas = [...proximosExamenes, ...proximosPagos].sort((a, b) => a.diasRestantes - b.diasRestantes);
                setAlertasQueue(todasAlertas);
                hasFetched.current = true; 
            } catch (err) {
                console.error("Error obteniendo vencimientos próximos:", err);
                setError("No se pudieron cargar las alertas.");
                hasFetched.current = true;
            } finally {
                setLoading(false);
            }
        };
        fetchProximosVencimientos();
    }, [estudianteId, apiBaseUrl, error]);

    useEffect(() => {
        if (!currentAlert && alertasQueue.length > 0) {
            const nextAlert = alertasQueue[0];
            setAlertasQueue(prev => prev.slice(1));
            setCurrentAlert(nextAlert);
            
            requestAnimationFrame(() => {
                setIsVisible(true); 
            });
        }
    }, [alertasQueue, currentAlert]);

    useEffect(() => {
        if (isVisible && currentAlert) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(handleClose, DISPLAY_DURATION);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isVisible, currentAlert]); 

    const handleClose = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsVisible(false); 
        setTimeout(() => {
            setCurrentAlert(null);
        }, ANIMATION_DURATION);
    }, []);
    

    return (
        currentAlert ? (
            <AlertaVencimiento
                key={currentAlert.id} 
                alerta={currentAlert}
                onClose={handleClose}
                isVisible={isVisible} 
            />
        ) : null 
    );
};