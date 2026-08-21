namespace GARYGameLauncher.Models;

public class Game
{
    public string Title { get; set; } = string.Empty;

    public string Genre { get; set; } = string.Empty;

    public string GenreColor { get; set; } = "#CCED00";

    public string Description { get; set; } = string.Empty;

    public string ImagePath { get; set; } = string.Empty;

    public string ExecutablePath { get; set; } = string.Empty;
}