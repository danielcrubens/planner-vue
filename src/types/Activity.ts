export interface ActivityProps {
  title: string;
  occurs_at: { hours: number; minutes: number; seconds: number };
}

export interface ActivityListProps {
  activities: ActivityProps[];
}