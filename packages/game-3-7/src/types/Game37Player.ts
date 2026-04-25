export type Game37Player = {
  id: string;
  displayName: string;
  seat: 1 | 2 | 3 | 4;
  teamId: string;
  isBot: boolean;
  botLevel?: "normal" | "hard" | "extreme";
};