import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from './service';
import type {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ChangePasswordDto,
  ResetPasswordDto,
  VerifyResetPasswordDto,
  UpdateProfileDto,
  User
} from './types';

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RefreshTokenDto) => authService.refreshToken(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => authService.changePassword(data),
  });
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordDto) => authService.requestPasswordReset(data),
  });
};

export const useVerifyResetPassword = () => {
  return useMutation({
    mutationFn: (data: VerifyResetPasswordDto) => authService.verifyResetPassword(data),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileDto) => authService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
};

export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: () => authService.resendVerificationEmail(),
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => authService.getPermissions(),
  });
}; 