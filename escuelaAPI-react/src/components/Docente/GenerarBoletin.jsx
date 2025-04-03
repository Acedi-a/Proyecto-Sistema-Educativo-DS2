import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, User, School, BarChart2, Calendar, Book, AlertCircle, Loader } from "lucide-react";

export const GenerarCalificion = () => {
    const { id } = useParams();
    const [boletin, setBoletin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCalificaciones = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://localhost:7279/api/GenerarBoletin/boletin/${id}`);
                setBoletin(response.data);
            } catch (err) {
                setError("Error al cargar los datos de calificaciones");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCalificaciones();
    }, [id]);

    const obtenerMes = (fecha) => {
        if (!fecha) return "Fecha no disponible";
        try {
            const partes = fecha.split("/");
            if (partes.length !== 3) return "Fecha inválida";
            const fechaFormatoCorrecto = `${partes[2]}-${partes[1]}-${partes[0]}`;
            const fechaObjeto = new Date(fechaFormatoCorrecto);

            if (isNaN(fechaObjeto)) return "Fecha inválida";

            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            return meses[fechaObjeto.getMonth()];
        } catch (error) {
            return "Error en fecha";
        }
    };

    const obtenerColorNota = (nota) => {
        if (nota === "Sin calificaciones") return "text-gray-500";
        const notaNum = parseFloat(nota);
        if (isNaN(notaNum)) return "text-gray-300";
        if (notaNum >= 9) return "text-green-400 font-bold";
        if (notaNum >= 7) return "text-blue-400 font-medium";
        if (notaNum >= 5) return "text-yellow-400";
        return "text-red-400 font-bold";
    };

    const generarPDF = () => {
        if (!boletin) return;

        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.text("Boletín de Calificaciones", 105, 20, null, null, "center");

        doc.setFont("helvetica", "normal");

        const nombreCompleto = `${boletin.estudiante.nombre} ${boletin.estudiante.apellido}`;

        doc.text(`Estudiante: ${nombreCompleto}`, 20, 30);
        doc.text(`Curso: ${boletin.estudiante.curso}`, 20, 40);
        doc.text(`Promedio General: ${boletin.promedioGeneral.toFixed(2)}`, 20, 50);

        if (boletin.boletín.length > 0) {
            const tableData = boletin.boletín.flatMap((materia) =>
                materia.calificaciones.length > 0
                    ? materia.calificaciones.map((cal) => [
                          obtenerMes(cal.fecha),
                          materia.materia,
                          cal.nota,
                          cal.comentarios || "Sin comentarios",
                      ])
                    : [[
                        "Fecha no disponible", 
                        materia.materia, 
                        "Sin calificaciones", 
                        ""
                    ]]
            );

            autoTable(doc, { 
                startY: 60,
                head: [["Mes", "Materia", "Nota", "Comentarios"]],
                body: tableData,
                theme: "grid",
                styles: { fontSize: 10 },
                headStyles: { fillColor: [75, 85, 199] },
                alternateRowStyles: { fillColor: [240, 240, 255] },
            });
        } else {
            doc.text("No hay calificaciones disponibles.", 20, 60);
        }

        doc.save(`Boletin_Calificaciones_${id}.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader className="animate-spin text-indigo-600" size={48} />
                    <p className="text-gray-300 font-medium">Cargando información...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800 max-w-md">
                    <div className="text-red-500 text-center mb-4">
                        <AlertCircle size={48} className="mx-auto mb-4" />
                    </div>
                    <h2 className="text-xl font-bold text-center mb-4 text-red-400">Error de Carga</h2>
                    <p className="text-center text-gray-300">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Intentar nuevamente
                    </button>
                </div>
            </div>
        );
    }

    if (!boletin) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-xl shadow-xl border border-gray-800 max-w-md text-center">
                <div className="text-gray-500 text-5xl mb-4">📋</div>
                <p className="text-gray-400 text-lg">No hay datos disponibles</p>
            </div>
        </div>
    );

    // Calcular promedios por materia para el resumen
    const promediosPorMateria = boletin.boletín.map(materia => {
        const notasValidas = materia.calificaciones
            .map(cal => parseFloat(cal.nota))
            .filter(nota => !isNaN(nota));
            
        const promedio = notasValidas.length > 0 
            ? notasValidas.reduce((sum, nota) => sum + nota, 0) / notasValidas.length 
            : 0;
            
        return {
            materia: materia.materia,
            promedio: promedio.toFixed(2)
        };
    });

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-6xl mx-auto py-6">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">
                        Boletín de Calificaciones
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Información académica del estudiante
                    </p>
                    
                    <button
                        onClick={generarPDF}
                        className="mt-4 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 mx-auto"
                    >
                        <Download size={16} /> Descargar PDF
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Información del Estudiante */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Información del Estudiante
                        </h2>
                        
                        <div className="mb-4 flex justify-center">
                            <User size={48} className="text-gray-400" />
                        </div>
                        
                        <p className="text-lg text-white mb-1">
                            <span className="font-bold">Estudiante:</span> {boletin.estudiante.nombre} {boletin.estudiante.apellido}
                        </p>
                        
                        <div className="flex items-center justify-center gap-12 mt-6">
                            <div className="flex flex-col items-center">
                                <School className="text-indigo-500 mb-2" size={24} />
                                <p className="text-gray-300">
                                    <span className="font-bold">Curso:</span> {boletin.estudiante.curso}
                                </p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <BarChart2 className="text-indigo-500 mb-2" size={24} />
                                <p className={`${obtenerColorNota(boletin.promedioGeneral.toFixed(2))}`}>
                                    <span className="font-bold text-gray-300">Promedio General:</span> {boletin.promedioGeneral.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Materias */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            Resumen de Materias
                        </h2>
                        
                        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {promediosPorMateria.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-800 border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <Book className="text-indigo-500" size={20} />
                                            <span className="text-gray-300">{item.materia}</span>
                                        </div>
                                        <span className={`${obtenerColorNota(item.promedio)} text-lg`}>
                                            {item.promedio}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Detalle de Calificaciones */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            Detalle de Calificaciones
                        </h2>
                        
                        <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-indigo-900 text-white">
                                            <th className="px-6 py-3 text-left">Mes</th>
                                            <th className="px-6 py-3 text-left">Materia</th>
                                            <th className="px-6 py-3 text-left">Nota</th>
                                            <th className="px-6 py-3 text-left">Comentarios</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boletin.boletín.length > 0 ? (
                                            boletin.boletín.map((materia, index) => (
                                                materia.calificaciones.length > 0 ? (
                                                    materia.calificaciones.map((cal, idx) => (
                                                        <tr key={`${index}-${idx}`} className={`border-t border-gray-800 hover:bg-gray-800 transition-all ${idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/50'}`}>
                                                            <td className="px-6 py-4 text-gray-300">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar size={16} className="text-indigo-400" />
                                                                    {obtenerMes(cal.fecha)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-gray-300 font-medium">
                                                                <div className="flex items-center gap-2">
                                                                    <Book size={16} className="text-indigo-400" />
                                                                    {materia.materia}
                                                                </div>
                                                            </td>
                                                            <td className={`px-6 py-4 ${obtenerColorNota(cal.nota)}`}>{cal.nota}</td>
                                                            <td className="px-6 py-4 text-gray-400">{cal.comentarios || "No hay comentarios"}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr key={index} className={`border-t border-gray-800 hover:bg-gray-800 transition-all ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/50'}`}>
                                                        <td className="px-6 py-4 text-gray-500">Fecha no disponible</td>
                                                        <td className="px-6 py-4 text-gray-300 font-medium">{materia.materia}</td>
                                                        <td className="px-6 py-4 text-gray-500 italic">Sin calificaciones</td>
                                                        <td className="px-6 py-4 text-gray-500 italic">No hay comentarios</td>
                                                    </tr>
                                                )
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No hay calificaciones disponibles</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-600 mt-6">
                        <p>Última actualización: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};