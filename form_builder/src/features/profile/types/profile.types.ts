export interface ProfileProgress {
  name: string | null;
  email: string;
  phone_number: string | null;
  specialty: string | null;
  avatar: string | null;
  is_complete: boolean;
}

export interface ProfileStepResponse {
  message: string;
  name?: string;
  specialty?: string;
  phone_number?: string;
  avatar?: string;
}
