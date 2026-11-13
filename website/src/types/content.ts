export type Game = {
  id: string;
  title: string;
  genre: string;
  description: string;
  color: string;
  image_url: string;
  game_url: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  kind: "material" | "documentation";
};
