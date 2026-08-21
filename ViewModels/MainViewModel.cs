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
            Genre = "RACING",
            Description = "Rasakan sensasi balapan dan tantangan kecepatan di lintasan yang penuh kejutan.",
            ImagePath = "Assets/Images/game_braking_bad.png"
        },

        new Game
        {
            Title = "TIME DISORDER",
            Genre = "ACTION",
            Description = "Hadapi kekacauan waktu dan temukan jalan keluar dari dunia yang terus berubah.",
            ImagePath = "Assets/Images/game_time_disorder.png"
        },

        new Game
        {
            Title = "BALLDREAM",
            Genre = "SPORT",
            Description = "Buktikan kemampuanmu dan raih kemenangan dalam petualangan sepak bola.",
            ImagePath = "Assets/Images/game_balldream.png"
        },

        new Game
        {
            Title = "DISTRACT",
            Genre = "ADVENTURE",
            Description = "Hadapi berbagai gangguan dan temukan cara untuk mencapai tujuanmu.",
            ImagePath = "Assets/Images/game_distract.png"
        },

        new Game
        {
            Title = "INSECTROPY",
            Genre = "ADVENTURE",
            Description = "Masuki dunia serangga yang penuh misteri dan tantangan.",
            ImagePath = "Assets/Images/game_insectropy.png"
        },

        new Game
        {
            Title = "CODE DEFENDER",
            Genre = "STRATEGY",
            Description = "Gunakan logika dan strategi untuk mempertahankan sistem dari ancaman.",
            ImagePath = "Assets/Images/game_code_defender.png"
        },

        new Game
        {
            Title = "DINE",
            Genre = "SIMULATION",
            Description = "Kelola restoranmu dan layani pelanggan dalam pengalaman memasak yang unik.",
            ImagePath = "Assets/Images/game_dine.png"
        },

        new Game
        {
            Title = "ARCHEMISTS CHRONICLES",
            Genre = "RPG",
            Description = "Ikuti perjalanan para penyihir dan ungkap rahasia dunia yang penuh misteri.",
            ImagePath = "Assets/Images/game_archemists_chronicles.png"
        },

        // PAGE 2

        new Game
        {
            Title = "UPRISING",
            Genre = "ACTION",
            Description = "Bangkit melawan kekuatan yang menguasai dunia dan tentukan masa depanmu.",
            ImagePath = "Assets/Images/game_uprising.png"
        },

        new Game
        {
            Title = "PUAKA",
            Genre = "HORROR",
            Description = "Hadapi kengerian dan misteri yang tersembunyi di balik dunia yang gelap.",
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