export interface CreateActivityProps {
  closeCreateActivityModal: () => void;
  isCreateActivityModalOpen: boolean;
  submitActivity: (formData: { title: string; occurs_at: string }) => void;
}

export interface FormData {
  title: string;
  occurs_at: string;
}