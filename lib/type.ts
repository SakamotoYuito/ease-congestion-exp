export type Photo = {
  date: Date;
  url: string;
  place: string;
  fullPath: string;
  uid: string;
  fav: number;
};

export type UserSettings = {
  nickName: string;
  modeOfTransportation: string;
  departureTime: {
    date0110: string | null;
    date0111: string | null;
    date0112: string | null;
  };
};
