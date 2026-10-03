export interface DestinationDateProps {
  isGuestsInputOpen: boolean;
  closeGuestsInput: () => void;
  openGuestsInput: () => void;
  date: Date[];
  destination: string;
}
