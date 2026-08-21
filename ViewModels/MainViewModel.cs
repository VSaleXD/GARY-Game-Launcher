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
            Title = "ECHOES OF AERIA",
            Genre = "ADVENTURE",
            Description = "Jelajahi dunia Aeria yang penuh misteri, puzzle, dan rahasia masa lalu."
        },

        new Game
        {
            Title = "NIGHT'S EDGE",
            Genre = "ACTION",
            Description = "Game action cepat dengan pertarungan intens dan gaya visual stylish."
        },

        new Game
        {
            Title = "FIELDS OF ORI",
            Genre = "RPG",
            Description = "RPG santai dengan cerita hangat tentang persahabatan dan petualangan."
        },

        new Game
        {
            Title = "BEYOND THE SIGNAL",
            Genre = "PUZZLE",
            Description = "Pecahkan teka-teki dan ungkap kebenaran di balik sinyal misterius."
        },

        new Game
        {
            Title = "VELOCITY DRIVE",
            Genre = "RACING",
            Description = "Rasakan sensasi balapan futuristik dengan kecepatan tanpa batas."
        },

        new Game
        {
            Title = "KINGDOM RISE",
            Genre = "STRATEGY",
            Description = "Bangun kerajaanmu, atur strategi, dan taklukkan wilayah lain."
        },

        new Game
        {
            Title = "WHISPERING HALLS",
            Genre = "HORROR",
            Description = "Jelajahi lorong gelap dan hadapi kengerian yang mengintai di balik bayangan."
        },

        new Game
        {
            Title = "COZY HAVEN",
            Genre = "SIMULATION",
            Description = "Bangun tempat impianmu dan nikmati hidup yang damai setiap hari."
        },

        // PAGE 2

        new Game
        {
            Title = "STARFALL",
            Genre = "ADVENTURE",
            Description = "Temukan rahasia dunia yang berada di bawah cahaya bintang terakhir."
        },

        new Game
        {
            Title = "NEON RUNNER",
            Genre = "ACTION",
            Description = "Berpacu melawan waktu di kota futuristik yang penuh bahaya."
        },

        new Game
        {
            Title = "FOREST TALES",
            Genre = "RPG",
            Description = "Petualangan kecil penuh cerita di tengah hutan yang misterius."
        },

        new Game
        {
            Title = "LOST FREQUENCY",
            Genre = "PUZZLE",
            Description = "Cari sumber sinyal aneh dan pecahkan misteri yang tersembunyi."
        },

        new Game
        {
            Title = "TURBO CIRCUIT",
            Genre = "RACING",
            Description = "Taklukkan lintasan berbahaya dengan kendaraan berkecepatan tinggi."
        },

        new Game
        {
            Title = "EMPIRE'S DAWN",
            Genre = "STRATEGY",
            Description = "Bangun peradabanmu dan kuasai dunia melalui strategi."
        },

        new Game
        {
            Title = "THE ABANDONED",
            Genre = "HORROR",
            Description = "Masuki tempat yang telah lama ditinggalkan dan temukan apa yang terjadi."
        },

        new Game
        {
            Title = "LITTLE CAFE",
            Genre = "SIMULATION",
            Description = "Kelola kafe kecilmu dan ciptakan tempat yang nyaman bagi semua orang."
        }
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