  const GAMES = [
    { title: "BRAKING BAD", genre: "RACING", description: "Rasakan sensasi balapan dan tantangan kecepatan di lintasan yang penuh kejutan.", color: "#3a2a00", image: "Assets/Images/game_braking_bad.png", itchUrl: "https://vsalexs.itch.io/braking-bad" },
    { title: "TIME DISORDER", genre: "ACTION", description: "Hadapi kekacauan waktu dan temukan jalan keluar dari dunia yang terus berubah.", color: "#1a2a3a", image: "Assets/Images/game_time_disorder.png", itchUrl: "https://vsalexs.itch.io/time-disorder" },
    { title: "BALLDREAM", genre: "SPORT", description: "Buktikan kemampuanmu dan raih kemenangan dalam petualangan sepak bola.", color: "#0a3a1a", image: "Assets/Images/game_balldream.png", itchUrl: "https://allione-studio.itch.io/balldream" },
    { title: "DISTRACT", genre: "ADVENTURE", description: "Hadapi berbagai gangguan dan temukan cara untuk mencapai tujuanmu.", color: "#3a0a2a", image: "Assets/Images/game_distract.png", itchUrl: "https://darith-dev.itch.io/distract" },
    { title: "INSECTROPY", genre: "ADVENTURE", description: "Masuki dunia serangga yang penuh misteri dan tantangan.", color: "#2a3a0a", image: "Assets/Images/game_insectropy.png", itchUrl: "https://hamgarian.itch.io/insectropy" },
    { title: "CODE DEFENDER", genre: "STRATEGY", description: "Gunakan logika dan strategi untuk mempertahankan sistem dari ancaman.", color: "#0a2a3a", image: "Assets/Images/game_code_defender.png", itchUrl: "https://raftfeed.itch.io/ini-projek-gekave" },
    { title: "DINE", genre: "SIMULATION", description: "Kelola restoranmu dan layani pelanggan dalam pengalaman memasak yang unik.", color: "#3a1a0a", image: "Assets/Images/game_dine.png", itchUrl: "https://rad3nz.itch.io/dine" },
    { title: "ARCHEMISTS CHRONICLES", genre: "RPG", description: "Ikuti perjalanan para penyihir dan ungkap rahasia dunia yang penuh misteri.", color: "#2a0a3a", image: "Assets/Images/game_archemists_chronicles.png", itchUrl: "https://zephx.itch.io/archemists-chronicles" },
    { title: "UPRISING", genre: "ACTION", description: "Bangkit melawan kekuatan yang menguasai dunia dan tentukan masa depanmu.", color: "#3a0a0a", image: "Assets/Images/game_uprising.png", itchUrl: "https://zephx.itch.io/uprising0" },
    { title: "PUAKA", genre: "HORROR", description: "Hadapi kengerian dan misteri yang tersembunyi di balik dunia yang gelap.", color: "#0a0a0a", image: "Assets/Images/game_puaka.png", itchUrl: "https://zephx.itch.io/puaka" },
    { title: "ECHOES", genre: "PUZZLE PLATFORMER", description: "Game platformer dimana kematianmu sebelumnya akan membantumu melewati puzzle dan rintangan.", color: "#4D96FF", image: "Assets/Images/game_echoes.png", itchUrl: "https://ramjing.itch.io/echoes" },
    { title: "HOP", genre: "VERTICAL PLATFORMER", description: "Atur kekuatan lompatan kelinci untuk mencapai puncak tanpa jatuh dan mati.", color: "#4D96FF", image: "Assets/Images/game_hop.png", itchUrl: "https://ramjing.itch.io/hop" },
    { title: "MAGISTAR", genre: "TOWER DEFENSE", description: "Gunakan kombinasi elemen api, air, dan tumbuhan untuk mempertahankan istana dari serangan musuh.", color: "#A66CFF", image: "Assets/Images/game_magistar.png", itchUrl: "https://faizbyp.itch.io/magistar"},
    { title: "DYSTOPIA RUN", genre: "ENDLESS RUNNER", description: "Berlari tanpa henti melewati rintangan sambil mengatur energi lompatan untuk bertahan hidup", color: "#FFD166", image: "Assets/Images/game_dystopia_run.png", itchUrl: "https://as-linkon.itch.io/dystopia-run" },
    { title: "IPB RUNNERS", genre: "ENDLESS RUNNER", description: "Mahasiswa IPB melompati mobil ala Google Dino hingga akhirnya berakhir di ruang wisuda.", color: "#FFD166", image: "Assets/Images/game_ipb_runners.png", itchUrl: "https://rafifrr.itch.io/ipb-runners" },
  ];

  const GAMES_PER_PAGE = 8;

  const hoverSound = new Audio("Assets/Audio/hover_card.wav");
  const clickSound = new Audio("Assets/Audio/click_play.wav");
  hoverSound.volume = 0.4;
  clickSound.volume = 0.6;

  function playSound(audio){
    audio.currentTime = 0;
    audio.play().catch(() => {}); 
  }
  let currentPage = 0;
  const pageCount = Math.ceil(GAMES.length / GAMES_PER_PAGE);

  const grid = document.getElementById("grid");
  const dotsEl = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function render(){
    // GRID
    const start = currentPage * GAMES_PER_PAGE;
    const pageGames = GAMES.slice(start, start + GAMES_PER_PAGE);

    grid.innerHTML = pageGames.map(g => `
      <div class="card">
        <div class="thumb" style="--thumb-color:${g.color}">
          <img src="${g.image}" alt="${g.title}" onerror="this.remove()" />
          <span class="genre-tag">${g.genre}</span>
        </div>
        <div class="info">
          <h3>${g.title}</h3>
          <p>${g.description}</p>
          <a class="play-btn" data-hover-sound data-click-sound href="${g.itchUrl}" target="_blank" rel="noopener noreferrer">
            &#9654; PLAY GAME
          </a>
        </div>
      </div>
    `).join("");

    // SOUND EVENTS
    grid.querySelectorAll("[data-hover-sound]").forEach(btn => {
      btn.addEventListener("mouseenter", () => playSound(hoverSound));
    });
    grid.querySelectorAll("[data-click-sound]").forEach(btn => {
      btn.addEventListener("click", () => playSound(clickSound));
    });

    // DOTS
    dotsEl.innerHTML = Array.from({ length: pageCount })
      .map((_, i) => `<span class="dot ${i === currentPage ? "active" : ""}"></span>`)
      .join("");

    // NAV STATE
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= pageCount - 1;
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 0){ currentPage--; render(); }
  });
  nextBtn.addEventListener("click", () => {
    if (currentPage < pageCount - 1){ currentPage++; render(); }
  });

  render();