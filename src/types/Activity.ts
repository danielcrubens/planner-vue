export interface ActivityProps {
  title: string;
  occurs_at: { hours: number; minutes: number; seconds: number };
  date: string;
}

export interface ActivityListProps {
  activities: ActivityProps[];
}