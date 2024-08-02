export interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: () => void;
  ConfirmTripModalOpen: boolean;
  ownerName: string;
  ownerEmail: string;
}