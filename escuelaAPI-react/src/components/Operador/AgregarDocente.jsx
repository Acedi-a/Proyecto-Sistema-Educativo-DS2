import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appsettings } from "../../settings/appsettings";
import styles from '../../modules/AgregarDocente.module.css';
import { FaUserPlus, FaArrowLeft, FaSave, FaSpinner, FaImage, FaUser, FaIdCard, FaEnvelope, FaLock, FaHome, FaPhone, FaGraduationCap } from 'react-icons/fa';

export function AgregarDocente() {
    const [docente, setDocente] = useState({
        nombreUsuario: "",
        nombre: "",
        apellido: "",
        correo: "",
        clave: "",
        direccion: "",
        telefono: "",
        especialidad: "",
        imagen: null
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocente(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            if (!file.type.match('image.*')) {
                setError("Por favor, sube un archivo de imagen válido");
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                setError("La imagen no debe exceder los 2MB");
                return;
            }

            setDocente(prev => ({ ...prev, imagen: file }));
            setImagePreview(URL.createObjectURL(file));
            setError("");
        }
    };

    const validateForm = () => {
        if (docente.clave.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return false;
        }

        if (!docente.correo.includes('@')) {
            setError("Por favor ingresa un correo electrónico válido");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('nombreUsuario', docente.nombreUsuario);
            formData.append('nombre', docente.nombre);
            formData.append('apellido', docente.apellido);
            formData.append('correo', docente.correo);
            formData.append('clave', docente.clave);
            formData.append('direccion', docente.direccion);
            formData.append('telefono', docente.telefono);
            formData.append('especialidad', docente.especialidad);
            
            if (docente.imagen) {
                formData.append('imagen', docente.imagen);
            }
            const response = await fetch(`${appsettings.ApiUrl}Acceso/Registrar/Docente`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al registrar docente");
            }

            const result = await response.json();
            setSuccess(result.message || "Docente registrado exitosamente");
            
            setTimeout(() => navigate("/docentes"), 2000);
            
        } catch (error) {
            setError(error.message || "Error al conectar con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <FaUserPlus /> Registrar Nuevo Docente
                </h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}

                <div className={styles.formGrid}>
                    {/* Información Básica */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>
                            <FaUser /> Información Personal
                        </legend>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <FaUser className={styles.labelIcon} />
                                Nombre de Usuario*
                            </label>
                            <input
                                type="text"
                                name="nombreUsuario"
                                value={docente.nombreUsuario}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <FaIdCard className={styles.labelIcon} />
                                Nombre(s)*
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={docente.nombre}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <FaIdCard className={styles.labelIcon} />
                                Apellido(s)*
                            </label>
                            <input
                                type="text"
                                name="apellido"
                                value={docente.apellido}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                    </fieldset>

                    {/* Contacto y Seguridad */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>
                            <FaEnvelope /> Contacto y Seguridad
                        </legend>
                        
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <FaEnvelope className={styles.labelIcon} />
                                Correo Electrónico*
                            </label>
                            <input
                                type="email"
                                name="correo"
                                value={docente.correo}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <FaLock className={styles.labelIcon} />
                                Contraseña* (mínimo 6 caracteres)
                            </label>
                            <input
                                type="password"
                                name="clave"
                                value={docente.clave}
                                onChange={handleChange}
                                required
                                minLength="6"
                                className={styles.input}
                            />
                        </div>
                    </fieldset>

                    {/* Información Adicional */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>
                            <FaGraduationCap /> Información Adicional
                        </legend>
                        
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
                                Especialidad*
                            </label>
                            <input
                                type="text"
                                name="especialidad"
                                value={docente.especialidad}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                    </fieldset>

                    {/* Imagen de Perfil */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <FaImage className={styles.labelIcon} />
                            Foto de Perfil
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
                            {imagePreview && (
                                <div className={styles.imagePreview}>
                                    <img 
                                        src={imagePreview} 
                                        alt="Vista previa" 
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
                                Registrando...
                            </>
                        ) : (
                            <>
                                <FaSave />
                                Registrar Docente
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AgregarDocente;