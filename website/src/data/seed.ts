import type { Game, Resource } from "../types/content";

export const seedGames: Game[] = [
  ["BRAKING BAD", "RACING", "Rasakan sensasi balapan dan tantangan kecepatan di lintasan yang penuh kejutan.", "#3a2a00", "game_braking_bad.png", "https://vsalexs.itch.io/braking-bad"],
  ["TIME DISORDER", "ACTION", "Hadapi kekacauan waktu dan temukan jalan keluar dari dunia yang terus berubah.", "#1a2a3a", "game_time_disorder.png", "https://vsalexs.itch.io/time-disorder"],
  ["BALLDREAM", "SPORT", "Buktikan kemampuanmu dan raih kemenangan dalam petualangan sepak bola.", "#0a3a1a", "game_balldream.png", "https://allione-studio.itch.io/balldream"],
  ["DISTRACT", "ADVENTURE", "Hadapi berbagai gangguan dan temukan cara untuk mencapai tujuanmu.", "#3a0a2a", "game_distract.png", "https://darith-dev.itch.io/distract"],
  ["INSECTROPY", "ADVENTURE", "Masuki dunia serangga yang penuh misteri dan tantangan.", "#2a3a0a", "game_insectropy.png", "https://hamgarian.itch.io/insectropy"],
  ["CODE DEFENDER", "STRATEGY", "Gunakan logika dan strategi untuk mempertahankan sistem dari ancaman.", "#0a2a3a", "game_code_defender.png", "https://raftfeed.itch.io/ini-projek-gekave"],
  ["DINE", "SIMULATION", "Kelola restoranmu dan layani pelanggan dalam pengalaman memasak yang unik.", "#3a1a0a", "game_dine.png", "https://rad3nz.itch.io/dine"],
  ["ARCHEMISTS CHRONICLES", "RPG", "Ikuti perjalanan para penyihir dan ungkap rahasia dunia yang penuh misteri.", "#2a0a3a", "game_archemists_chronicles.png", "https://zephx.itch.io/archemists-chronicles"],
  ["UPRISING", "ACTION", "Bangkit melawan kekuatan yang menguasai dunia dan tentukan masa depanmu.", "#3a0a0a", "game_uprising.png", "https://zephx.itch.io/uprising0"],
  ["PUAKA", "HORROR", "Hadapi kengerian dan misteri yang tersembunyi di balik dunia yang gelap.", "#0a0a0a", "game_puaka.png", "https://zephx.itch.io/puaka"],
  ["ECHOES", "PUZZLE PLATFORMER", "Kematianmu sebelumnya akan membantumu melewati puzzle dan rintangan.", "#4D96FF", "game_echoes.png", "https://ramjing.itch.io/echoes"],
  ["HOP", "VERTICAL PLATFORMER", "Atur kekuatan lompatan kelinci untuk mencapai puncak tanpa jatuh dan mati.", "#4D96FF", "game_hop.png", "https://ramjing.itch.io/hop"],
  ["MAGISTAR", "TOWER DEFENSE", "Gunakan kombinasi elemen untuk mempertahankan istana dari serangan musuh.", "#A66CFF", "game_magistar.png", "https://faizbyp.itch.io/magistar"],
  ["DYSTOPIA RUN", "ENDLESS RUNNER", "Berlari melewati rintangan sambil mengatur energi lompatan untuk bertahan hidup.", "#FFD166", "game_dystopia_run.png", "https://as-linkon.itch.io/dystopia-run"],
  ["IPB RUNNERS", "ENDLESS RUNNER", "Mahasiswa IPB melompati mobil hingga akhirnya berakhir di ruang wisuda.", "#FFD166", "game_ipb_runners.png", "https://rafifrr.itch.io/ipb-runners"],
].map(([title, genre, description, color, image, game_url], index) => ({
  id: `seed-${index}`,
  title,
  genre,
  description,
  color,
  image_url: `/Assets/Images/${image}`,
  game_url,
}));

export const seedResources: Resource[] = [
  { id: "material-1", title: "Pengenalan Godot Engine", description: "Materi awal untuk mengenal interface dan workflow Godot.", category: "Godot", file_url: "#", kind: "material" },
  { id: "material-2", title: "Dasar Game Design", description: "Membangun core loop, mekanik, dan pengalaman pemain.", category: "Game Design", file_url: "#", kind: "material" },
  { id: "docs-1", title: "Panduan Submit Game GARY", description: "Langkah-langkah mengirim game agar masuk ke Game Hub.", category: "Komunitas", file_url: "#", kind: "documentation" },
  { id: "docs-2", title: "Standar Struktur Project Godot", description: "Konvensi folder dan penamaan untuk project komunitas.", category: "Teknis", file_url: "#", kind: "documentation" },
];
