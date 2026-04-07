import data from "@/data/data.json";

export type Player = {
  id: number;
  name: string;
  number: number;
  position: string;
  image: string;
};

export type StaffMember = {
  id: number;
  name: string;
  role: string;
  image: string;
};

export function getPlayers(): Player[] {
  return data.players;
}

export function getStaff(): StaffMember[] {
  return data.staff;
}

export function getPlayerImage(playerName: string): string {
  const slug = playerName.trim().split(/\s+/).join("-");
  return `https://www.nfldraftbuzz.com/PlayerImages/${slug}.png`;
}

export function getPlayersByPosition(position: string): Player[] {
  return data.players.filter(
    (p) => p.position.toLowerCase() === position.toLowerCase()
  );
}

export function getTop100(): Player[] {
  return data.players.slice(0, 100);
}
