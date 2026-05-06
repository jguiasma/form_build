import { useMutation } from '@tanstack/react-query';
import api from '../../../shared/api/api';

export const useEnrollBiometrics = () => {
    return useMutation({
        mutationFn: async (payload: { email: string; name?: string; template: number[] }) => {
            const { data } = await api.post('/biometrics/enroll', payload);
            return data;
        }
    });
};

export const useVerifyBiometrics = () => {
    return useMutation({
        mutationFn: async (payload: { email: string; embedding: number[] }) => {
            const { data } = await api.post('/biometrics/verify', payload);
            return data;
        }
    });
};

export const useCheckBiometricEmail = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            const { data } = await api.get('/biometrics/check-email', { params: { email } });
            return data;
        }
    });
};

export const useLogBiometricAttempt = () => {
    return useMutation({
        mutationFn: async (payload: { email?: string; reason: string }) => {
            const { data } = await api.post('/biometrics/log', payload);
            return data;
        }
    });
};


