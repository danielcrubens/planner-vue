export   interface InviteGuestProps {
  isGuestsInputOpen: boolean;
  openGuestsModal: () => void;
  openConfirmTripModal: () => void;
  emailsToInvite: string[];
}