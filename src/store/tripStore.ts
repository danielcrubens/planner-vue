import { defineStore } from 'pinia';

export const useTripStore = defineStore('trip', {
  state: () => ({
    emailsToInvite: [] as string[],
    ownerName: '',
    ownerEmail: '',
    destination: '',
    date: [] as string[],
  }),
  actions: {
    setOwnerName(name: string) {
      this.ownerName = name;
    },
    setOwnerEmail(email: string) {
      this.ownerEmail = email;
    },
    setEmailsToInvite(emails: string[]) {
      this.emailsToInvite = emails;
    },
    setDestination(destination: string) {
      this.destination = destination;
    },
    setDate(date: string[]) {
      this.date = date;
    },
  }
});
