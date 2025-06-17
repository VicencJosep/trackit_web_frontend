import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../../services/user.service';
import { User } from '../../types'; // Importa el tipo User

const LoginCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndRedirect = async (token: string) => {
      try {
        const userData: User = await fetchUserData(token);
        // Redirigir a /home pasando los datos del usuario
        navigate('/home', { state: { user: userData } });
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        navigate('/login');
      }
    };

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const isProfileComplete = localStorage.getItem('isProfileComplete') === 'true';

    if (accessToken && refreshToken) {
      // Si los tokens están en localStorage, proceder a verificar el perfil
      if (isProfileComplete) {
        fetchAndRedirect(accessToken); // Redirigir con los datos del usuario
      } else {
        navigate('/complete-profile');
      }
    } else {
      // Si no hay tokens, se toman de los parámetros de la URL
      const params = new URLSearchParams(window.location.search);
      const newAccessToken = params.get('accessToken');
      const newRefreshToken = params.get('refreshToken');
      const isProfileCompleteFromParams = params.get('isProfileComplete') === 'true';

      if (newAccessToken && newRefreshToken) {
        // Si los nuevos tokens están presentes, guardarlos en localStorage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('isProfileComplete', String(isProfileCompleteFromParams));

        // Redirigir según el estado del perfil
        if (isProfileCompleteFromParams) {
          fetchAndRedirect(newAccessToken); // Redirigir con los datos del usuario
        } else {
          navigate('/complete-profile');
        }
      } else {
        console.error('No se recibieron los tokens correctamente');
        alert('No se recibieron los tokens correctamente');
        navigate('/login');
      }
    }
  }, [navigate]);

  return <div>Procesando inicio de sesión...</div>;
};

export default LoginCallback;
