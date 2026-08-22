using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Media;
using GARYGameLauncher.ViewModels;

using System.Diagnostics;
using GARYGameLauncher.Models;

namespace GARYGameLauncher;

public partial class MainWindow : Window
{
    private MainViewModel ViewModel =>
        (MainViewModel)DataContext;

    // Menyimpan semua MediaPlayer yang sedang bermain.
    // Jadi SFX baru tidak memotong SFX sebelumnya.
    private readonly List<MediaPlayer> _activeSounds = new();

    public MainWindow()
    {
        InitializeComponent();
    }

    // =========================
    // SFX SYSTEM
    // =========================

    private void PlaySound(string filePath)
    {
        try
        {
            var player = new MediaPlayer();

            player.Open(new Uri(
                System.IO.Path.GetFullPath(filePath),
                UriKind.Absolute));

            _activeSounds.Add(player);

            player.MediaEnded += (sender, e) =>
            {
                if (sender is MediaPlayer finishedPlayer)
                {
                    finishedPlayer.Stop();
                    finishedPlayer.Close();

                    _activeSounds.Remove(finishedPlayer);
                }
            };

            player.MediaFailed += (sender, e) =>
            {
                if (sender is MediaPlayer failedPlayer)
                {
                    failedPlayer.Close();
                    _activeSounds.Remove(failedPlayer);
                }
            };

            player.Play();
        }
        catch
        {
            // SFX tidak boleh membuat launcher crash.
        }
    }

    // =========================
    // CARD HOVER
    // =========================

    private void GameCard_MouseEnter(
        object sender,
        System.Windows.Input.MouseEventArgs e)
    {
        PlaySound("Assets/Audio/hover_card.wav");
    }

    // =========================
    // PLAY BUTTON
    // =========================

    private void PlayButton_Click(
        object sender,
        RoutedEventArgs e)
    {
        PlaySound("Assets/Audio/click_play.wav");

        if (sender is not FrameworkElement element)
        return;

        if (element.DataContext is not Game game)
            return;

        LaunchGame(game);
    }

    private void LaunchGame(Game game)
    {
        try
        {
            if (game.LaunchType == GameLaunchType.Web)
            {
                if (string.IsNullOrWhiteSpace(game.WebUrl))
                    return;

                Process.Start(new ProcessStartInfo
                {
                    FileName = game.WebUrl,
                    UseShellExecute = true
                });

                Close();
                return;
            }

            if (game.LaunchType == GameLaunchType.Executable)
            {
                if (string.IsNullOrWhiteSpace(game.ExecutablePath))
                    return;

                string executablePath =
                    System.IO.Path.GetFullPath(game.ExecutablePath);

                if (!System.IO.File.Exists(executablePath))
                {
                    MessageBox.Show(
                        $"Game tidak ditemukan:\n{executablePath}",
                        "Game Tidak Ditemukan",
                        MessageBoxButton.OK,
                        MessageBoxImage.Warning);

                    return;
                }

                Process.Start(new ProcessStartInfo
                {
                    FileName = executablePath,
                    WorkingDirectory =
                        System.IO.Path.GetDirectoryName(executablePath),
                    UseShellExecute = true
                });

                Close();
            }
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                $"Gagal membuka game:\n\n{ex.Message}",
                "Gagal Menjalankan Game",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
        }
    }

    // =========================
    // NEXT PAGE
    // =========================

    private void NextButton_Click(
        object sender,
        RoutedEventArgs e)
    {
        PlaySound("Assets/Audio/click_navigation.wav");

        ViewModel.NextPage();
    }

    // =========================
    // PREVIOUS PAGE
    // =========================

    private void PreviousButton_Click(
        object sender,
        RoutedEventArgs e)
    {
        PlaySound("Assets/Audio/click_navigation.wav");

        ViewModel.PreviousPage();
    }

    // =========================
    // ESCAPE
    // =========================

    private void Window_KeyDown(
        object sender,
        System.Windows.Input.KeyEventArgs e)
    {
        if (e.Key == System.Windows.Input.Key.Escape)
        {
            Close();
        }
    }
}