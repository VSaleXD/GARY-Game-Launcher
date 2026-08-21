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
            ImagePath = "Assets/Images/game_braking_bad.png"
        },

        new Game
        {
            Title = "TIME DISORDER",
            Genre = "ACTION RUNNER",
            GenreColor = "#FF9F43",
            Description = "Gunakan manipulasi waktu dan dash untuk memburu musuh di kota futuristik.",
            ImagePath = "Assets/Images/game_time_disorder.png"
        },

        new Game
        {
            Title = "BALLDREAM",
            Genre = "3D PLATFORMER",
            GenreColor = "#4D96FF",
            Description = "Kendalikan bola melewati dunia mimpi penuh rintangan untuk menemukan jalan keluar.",
            ImagePath = "Assets/Images/game_balldream.png"
        },

        new Game
        {
            Title = "DISTRACT",
            Genre = "TOWER DEFENSE",
            GenreColor = "#A66CFF",
            Description = "Gunakan alat produktivitas untuk menghentikan berbagai distraksi yang menyerang.",
            ImagePath = "Assets/Images/game_distract.png"
        },

        new Game
        {
            Title = "INSECTROPY",
            Genre = "TACTICAL ROGUELIKE",
            GenreColor = "#6B4526",
            Description = "Dua semut bertarung secara taktis menggunakan dadu dan artefak untuk mengalahkan tujuh dosa mematikan.",
            ImagePath = "Assets/Images/game_insectropy.png"
        },

        new Game
        {
            Title = "CODE DEFENDER",
            Genre = "SHOOTER ACTION",
            GenreColor = "#00C9A7",
            Description = "Menjadi sistem pertahanan kode untuk melawan virus yang merusak program.",
            ImagePath = "Assets/Images/game_code_defender.png"
        },

        new Game
        {
            Title = "DINE",
            Genre = "HORROR",
            GenreColor = "#7A1F1F",
            Description = "Bermain sebagai skinwalker yang harus menyamar dan bertahan hidup dari para pemburu hingga pagi.",
            ImagePath = "Assets/Images/game_dine.png"
        },

        new Game
        {
            Title = "ARCHEMISTS CHRONICLES",
            Genre = "RPG",
            GenreColor = "#285C35",
            Description = "Ikuti perjalanan para penyihir dan ungkap rahasia dunia yang penuh misteri.",
            ImagePath = "Assets/Images/game_archemists_chronicles.png"
        },

        // PAGE 2

        new Game
        {
            Title = "UPRISING",
            Genre = "PLATFORMER",
            GenreColor = "#4D96FF",
            Description = "Tahanan menggunakan bola besi yang terikat di kakinya untuk melontarkan diri menuju permukaan.",
            ImagePath = "Assets/Images/game_uprising.png"
        },

        new Game
        {
            Title = "PUAKA",
            Genre = "PLATFORMER SHOOTER",
            GenreColor = "#FF7043",
            Description = "Skeleton dan roh api menyerbu kastil misterius dalam platformer shooter bergaya retro.",
            ImagePath = "Assets/Images/game_puaka.png"
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