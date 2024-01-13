import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = (accessToken, targetRoute) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken && targetRoute) {
      navigate(targetRoute);
    }
  }, [accessToken, targetRoute, navigate]);
};

export default useAuthRedirect;
