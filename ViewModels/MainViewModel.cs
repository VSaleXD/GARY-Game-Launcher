using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using GARYGameLauncher.Models;

namespace GARYGameLauncher.ViewModels;

public class MainViewModel : INotifyPropertyChanged
{
    private const int GamesPerPage = 8;

    private int _currentPage = 0;

    public ObservableCollection<Game> Games { get; } = new()
    {
        new Game
        {
            Title = "BRAKING BAD",
            Genre = "LOCAL MULTIPLAYER RACING",
            GenreColor = "#FF5C5C",
            Description = "Bertanding dalam berbagai minigame kacau menggunakan mobil bersama teman.",
            ImagePath = "Assets/Images/game_braking_bad.png",

            LaunchType = GameLaunchType.Web,
            WebUrl = "https://vsalexs.itch.io/braking-bad"
        },

        new Game
        {
            Title = "TIME DISORDER",
            Genre = "ACTION RUNNER",
            GenreColor = "#FFD166",
            Description = "Gunakan manipulasi waktu dan dash untuk memburu musuh di kota futuristik.",
            ImagePath = "Assets/Images/game_time_disorder.png",

            LaunchType = GameLaunchType.Web,
            WebUrl = "https://vsalexs.itch.io/time-disorder"
        },

        new Game
        {
            Title = "BALLDREAM",
            Genre = "3D PLATFORMER",
            GenreColor = "#4D96FF",
            Description = "Kendalikan bola melewati dunia mimpi penuh rintangan untuk menemukan jalan keluar.",
            ImagePath = "Assets/Images/game_balldream.png",

            LaunchType = GameLaunchType.Executable,
            ExecutablePath = "Games/BallDream/BallDream.exe"
        },

        new Game
        {
            Title = "D!STRACT",
            Genre = "TOWER DEFENSE",
            GenreColor = "#A66CFF",
            Description = "Gunakan alat produktivitas untuk menghentikan berbagai distraksi yang menyerang.",
            ImagePath = "Assets/Images/game_distract.png",

            LaunchType = GameLaunchType.Executable,
            ExecutablePath = "Games/D!stract/D!stract.exe"
        },

        new Game
        {
            Title = "INSECTROPY",
            Genre = "TACTICAL ROGUELIKE",
            GenreColor = "#B87941",
            Description = "Dua semut bertarung secara taktis menggunakan dadu dan artefak untuk mengalahkan tujuh dosa mematikan.",
            ImagePath = "Assets/Images/game_insectropy.png",

            LaunchType = GameLaunchType.Web,
            WebUrl = "https://hamgarian.itch.io/insectropy"
        },

        new Game
        {
            Title = "CODE DEFENDER",
            Genre = "SHOOTER ACTION",
            GenreColor = "#00C9A7",
            Description = "Menjadi sistem pertahanan kode untuk melawan virus yang merusak program.",
            ImagePath = "Assets/Images/game_code_defender.png",

            LaunchType = GameLaunchType.Web,
            WebUrl = "https://raftfeed.itch.io/ini-projek-gekave"
        },

        new Game
        {
            Title = "DINE",
            Genre = "HORROR",
            GenreColor = "#C62828",
            Description = "Bermain sebagai skinwalker yang harus menyamar dan bertahan hidup dari para pemburu hingga pagi.",
            ImagePath = "Assets/Images/game_dine.png",

            LaunchType = GameLaunchType.Executable,
            ExecutablePath = "Games/Dine/Dine.exe"
        },

        new Game
        {
            Title = "UPRISING",
            Genre = "VERTICAL PLATFORMER",
            GenreColor = "#4D96FF",
            Description = "Tahanan menggunakan bola besi yang terikat di kakinya untuk melontarkan diri menuju permukaan.",
            ImagePath = "Assets/Images/game_uprising.png",

            LaunchType = GameLaunchType.Web,
            WebUrl = "https://zephx.itch.io/uprising0"
        },

        // PAGE 2

        new Game
        {
            Title = "PUAKA",
            Genre = "SHOOTER PLATFORMER",
            GenreColor = "#4D96FF",
            Description = "Skeleton dan roh api menyerbu kastil misterius dalam platformer shooter bergaya retro.",
            ImagePath = "Assets/Images/game_puaka.png",

            LaunchType = GameLaunchType.Executable,
            ExecutablePath = "Games/Puaka/Puaka.exe"
        },

        new Game
        {
            Title = "ECHOES",
            Genre = "PUZZLE PLATFORMER",
            GenreColor = "#4D96FF",
            Description = "Game platformer dimana kematianmu sebelumnya akan membantumu melewati puzzle dan rintangan.",
            ImagePath = "Assets/Images/game_echoes.png",

            LaunchType = GameLaunchType.Web,
            WebUrl = "https://ramjing.itch.io/echoes"
        },

        new Game
        {
            Title = "HOP",
            Genre = "VERTICAL PLATFORMER",
            GenreColor = "#4D96FF",
            Description = "Atur kekuatan lompatan kelinci untuk mencapai puncak tanpa jatuh dan mati.",
            ImagePath = "Assets/Images/game_hop.png",

            LaunchType = GameLaunchType.Web,
            WebUrl = "https://ramjing.itch.io/hop"
        },

        new Game
        {
            Title = "MAGISTAR",
            Genre = "TOWER DEFENSE",
            GenreColor = "#A66CFF",
            Description = "Gunakan kombinasi elemen api, air, dan tumbuhan untuk mempertahankan istana dari serangan musuh.",
            ImagePath = "Assets/Images/game_magistar.png",

            LaunchType = GameLaunchType.Executable,
            ExecutablePath = "Games/Magistar/Magistar.exe"
        },

        new Game
        {
            Title = "DYSTOPIA RUN",
            Genre = "ENDLESS RUNNER",
            GenreColor = "#FFD166",
            Description = "Berlari tanpa henti melewati rintangan sambil mengatur energi lompatan untuk bertahan hidup",
            ImagePath = "Assets/Images/game_dystopia_run.png",

            LaunchType = GameLaunchType.Executable,
            ExecutablePath = "Games/Dystopia Run.exe"
        },

        new Game
        {
            Title = "IPB RUNNERS",
            Genre = "ENDLESS RUNNER",
            GenreColor = "#FFD166",
            Description = "Mahasiswa IPB melompati mobil ala Google Dino hingga akhirnya berakhir di ruang wisuda.",
            ImagePath = "Assets/Images/game_ipb_runners.png",

            LaunchType = GameLaunchType.Executable,
            ExecutablePath = "Games/IPB Runners/IPB Runners.exe"
        },
    };

    public ObservableCollection<Game> CurrentPageGames { get; } = new();

    public int CurrentPage
    {
        get => _currentPage;
        private set
        {
            if (_currentPage == value)
                return;

            _currentPage = value;
            OnPropertyChanged();
            OnPropertyChanged(nameof(CurrentPageNumber));
            OnPropertyChanged(nameof(IsFirstPage));
            OnPropertyChanged(nameof(IsLastPage));

            UpdateCurrentPageGames();
        }
    }

    public int CurrentPageNumber => CurrentPage + 1;

    public int PageCount =>
        (int)Math.Ceiling((double)Games.Count / GamesPerPage);

    public bool IsFirstPage => CurrentPage == 0;

    public bool IsLastPage => CurrentPage >= PageCount - 1;

    public MainViewModel()
    {
        UpdateCurrentPageGames();
    }

    public void NextPage()
    {
        if (!IsLastPage)
        {
            CurrentPage++;
        }
    }

    public void PreviousPage()
    {
        if (!IsFirstPage)
        {
            CurrentPage--;
        }
    }

    private void UpdateCurrentPageGames()
    {
        CurrentPageGames.Clear();

        int startIndex = CurrentPage * GamesPerPage;

        var gamesForPage = Games
            .Skip(startIndex)
            .Take(GamesPerPage);

        foreach (var game in gamesForPage)
        {
            CurrentPageGames.Add(game);
        }

        OnPropertyChanged(nameof(CurrentPageGames));
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    private void OnPropertyChanged(
        [CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(
            this,
            new PropertyChangedEventArgs(propertyName));
    }
}