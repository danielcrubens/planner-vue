import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getDayNumber = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'dd', { locale: ptBR });
};

export const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  const dayName = format(date, 'EEEE', { locale: ptBR });
  return dayName.charAt(0).toUpperCase() + dayName.slice(1);
};
