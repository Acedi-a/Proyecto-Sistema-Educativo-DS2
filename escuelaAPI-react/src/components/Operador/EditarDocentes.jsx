import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appsettings } from "../../settings/appsettings";
import styles from '../../modules/EditarDocente.module.css';
import { FaUserEdit, FaArrowLeft, FaSave, FaSpinner, FaImage, FaUser, FaIdCard, FaHome, FaPhone, FaGraduationCap } from 'react-icons/fa';
import { PulseLoader } from 'react-spinners';

export function EditarDocente() {
    const { id } = useParams();
    const [docente, setDocente] = useState({
        idUsuario: id,
        nombreUsuario: "",
        nombre: "",
        apellido: "",
        correo: "",
        clave: "",
        direccion: "",
        telefono: "",
        especialidad: "",
        imagen: null,
        imagenActual: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarDocente = async () => {
            try {
                const response = await fetch(`${appsettings.ApiUrl}Acceso/Obtener/Docente/${id}`);
                if (!response.ok) throw new Error("No se pudo cargar el docente");
                
                const result = await response.json();
                if (result.success && result.docente) {
                    setDocente({
                        idUsuario: id,
                        nombreUsuario: result.docente.nombreUsuario || "",
                        nombre: result.docente.nombre || "",
                        apellido: result.docente.apellido || "",
                        correo: result.docente.correo || "",
                        clave: "",
                        direccion: result.docente.direccion || "",
                        telefono: result.docente.telefono || "",
                        especialidad: result.docente.especialidad || "",
                        imagen: null,
                        imagenActual: result.docente.ImagenPath || ""
                    });
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        cargarDocente();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocente(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files?.[0]) {
            setDocente(prev => ({ 
                ...prev, 
                imagen: e.target.files[0],
                imagenActual: URL.createObjectURL(e.target.files[0])
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);
    
        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('nombreUsuario', docente.nombreUsuario || "");
            formData.append('nombre', docente.nombre || "");
            formData.append('apellido', docente.apellido || "");
            formData.append('correo', docente.correo || "");
            formData.append('clave', docente.clave || "");
            
            if (docente.direccion) formData.append('direccion', docente.direccion);
            if (docente.telefono) formData.append('telefono', docente.telefono);
            if (docente.especialidad) formData.append('especialidad', docente.especialidad);
            if (docente.imagen) formData.append('imagen', docente.imagen);
    
            const response = await fetch(`${appsettings.ApiUrl}Acceso/Editar/Docente/${id}`, {
                method: 'PUT',
                body: formData
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                const errorMsg = data.errors 
                    ? Object.entries(data.errors).map(([key, val]) => `${key}: ${val}`).join(', ')
                    : data.message || "Error al actualizar docente";
                throw new Error(errorMsg);
            }
    
            setSuccess(data.message || "Docente actualizado exitosamente");
            setTimeout(() => navigate("/listar-docentes"), 2000);
            
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className={styles.loadingContainer}>
            <PulseLoader color="#3498db" size={15} />
            <p>Cargando datos del docente...</p>
        </div>
    );

    if (error) return (
        <div className={styles.errorContainer}>
            <h3>Error al cargar el docente</h3>
            <p>{error}</p>
            <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
            >
                Reintentar
            </button>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button 
                    onClick={() => navigate(-1)}
                    className={styles.backButton}
                >
                    <FaArrowLeft /> Volver
                </button>
                <h1 className={styles.title}>
                    <FaUserEdit /> Editar Docente
                </h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FaUser className={styles.labelIcon} />
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            name="nombreUsuario"
                            value={docente.nombreUsuario}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FaIdCard className={styles.labelIcon} />
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={docente.nombre}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FaIdCard className={styles.labelIcon} />
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            value={docente.apellido}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FaHome className={styles.labelIcon} />
                            Dirección
                        </label>
                        <input
                            type="text"
                            name="direccion"
                            value={docente.direccion}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FaPhone className={styles.labelIcon} />
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            value={docente.telefono}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FaGraduationCap className={styles.labelIcon} />
                            Especialidad
                        </label>
                        <input
                            type="text"
                            name="especialidad"
                            value={docente.especialidad}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>
                            <FaImage className={styles.labelIcon} />
                            Imagen
                        </label>
                        <div className={styles.imageUpload}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="imagen"
                                className={styles.fileInput}
                            />
                            <label htmlFor="imagen" className={styles.fileLabel}>
                                Seleccionar imagen
                            </label>
                            {docente.imagenActual && (
                                <div className={styles.imagePreview}>
                                    <img 
                                        src={docente.imagenActual} 
                                        alt="Imagen actual" 
                                        className={styles.previewImage}
                                    />
                                    <span>Vista previa</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={styles.submitButton}
                    >
                        {isSubmitting ? (
                            <>
                                <FaSpinner className={styles.spinner} />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <FaSave />
                                Actualizar Docente
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditarDocente;