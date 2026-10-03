export interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  confirmTrip: () => void;
  ConfirmTripModalOpen: boolean;
  destination: string;
  formattedDate: string;
  invitedCount: number;
  isSubmitting: boolean;
  errorMessage: string;
}
