using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace GARYGameLauncher.Controls;

public partial class CometBackground : UserControl
{
    private readonly Random _random = new();

    private readonly List<Comet> _comets = new();

    private const int CometCount = 18;

    private bool _isRunning;

    public CometBackground()
    {
        InitializeComponent();

        Loaded += CometBackground_Loaded;
        Unloaded += CometBackground_Unloaded;
    }

    private void CometBackground_Loaded(object sender, RoutedEventArgs e)
    {
        if (_isRunning)
            return;

        _isRunning = true;

        CreateComets();

        CompositionTarget.Rendering += OnRendering;
    }

    private void CometBackground_Unloaded(object sender, RoutedEventArgs e)
    {
        StopAnimation();
    }

    private void StopAnimation()
    {
        if (!_isRunning)
            return;

        CompositionTarget.Rendering -= OnRendering;

        _isRunning = false;
    }

    private void CreateComets()
    {
        CometCanvas.Children.Clear();
        _comets.Clear();

        double width = Math.Max(1.0, ActualWidth);
        double height = Math.Max(1.0, ActualHeight);

        for (int i = 0; i < CometCount; i++)
        {
            CreateComet(width, height);
        }
    }

    private void CreateComet(
        double width,
        double height)
    {
        double length = RandomDouble(70, 190);
        double thickness = RandomDouble(1, 3);

        var comet = new Rectangle
        {
            Width = length,
            Height = thickness,
            Opacity = RandomDouble(0.25, 0.70),
            Fill = CreateCometBrush(),
            IsHitTestVisible = false
        };

        comet.RenderTransform = new RotateTransform(-28);
        comet.RenderTransformOrigin = new Point(0.5, 0.5);

        /*
         * PENTING:
         * Semua comet pertama kali berada
         * DI LUAR layar.
         *
         * Jadi ketika aplikasi dibuka,
         * layar benar-benar kosong.
         */

        double startX;
        double startY;

        if (_random.Next(2) == 0)
        {
            // =========================
            // SPAWN DARI KANAN
            // =========================

            startX = width + RandomDouble(100, 600);

            startY = RandomDouble(
                -100,
                height
            );
        }
        else
        {
            // =========================
            // SPAWN DARI ATAS
            // =========================

            startX = RandomDouble(
                0,
                width
            );

            startY = -RandomDouble(
                100,
                600
            );
        }

        Canvas.SetLeft(comet, startX);
        Canvas.SetTop(comet, startY);

        CometCanvas.Children.Add(comet);

        var data = new Comet
        {
            Element = comet,

            /*
             * Gerakan selalu:
             * kiri + bawah
             */
            SpeedX = RandomDouble(1.8, 3.5),
            SpeedY = RandomDouble(1.2, 2.4),

            /*
             * Delay berbeda-beda supaya
             * comet tidak muncul bersamaan.
             */
            Delay = _random.Next(0, 180)
        };

        _comets.Add(data);
    }

    private LinearGradientBrush CreateCometBrush()
    {
        return new LinearGradientBrush
        {
            StartPoint = new Point(0, 0.5),
            EndPoint = new Point(1, 0.5),

            GradientStops =
            {
                new GradientStop(
                    Color.FromArgb(0, 204, 237, 0),
                    0.0),

                new GradientStop(
                    Color.FromArgb(70, 204, 237, 0),
                    0.45),

                new GradientStop(
                    Color.FromArgb(255, 204, 237, 0),
                    0.85),

                new GradientStop(
                    Color.FromArgb(0, 204, 237, 0),
                    1.0)
            }
        };
    }

    private void OnRendering(
        object? sender,
        EventArgs e)
    {
        if (!_isRunning)
            return;

        double width = ActualWidth;
        double height = ActualHeight;

        if (width <= 0 || height <= 0)
            return;

        foreach (var comet in _comets)
        {
            if (comet.Delay > 0)
            {
                comet.Delay--;
                continue;
            }

            double x = Canvas.GetLeft(comet.Element);
            double y = Canvas.GetTop(comet.Element);

            /*
             * SEMUA COMET:
             *
             * X berkurang = ke kiri
             * Y bertambah = ke bawah
             */
            x -= comet.SpeedX;
            y += comet.SpeedY;

            Canvas.SetLeft(
                comet.Element,
                x
            );

            Canvas.SetTop(
                comet.Element,
                y
            );

            double cometWidth = comet.Element.Width;
            double cometHeight = comet.Element.Height;

            /*
             * Kalau keluar dari kiri
             * atau bawah layar,
             * spawn kembali.
             */
            if (x + cometWidth < -150 ||
                y - cometHeight > height + 150)
            {
                ResetComet(
                    comet,
                    width,
                    height
                );
            }
        }
    }

    private void ResetComet(
        Comet comet,
        double width,
        double height)
    {
        double startX;
        double startY;

        /*
         * 50% dari kanan
         * 50% dari atas
         */
        if (_random.Next(2) == 0)
        {
            // =========================
            // SPAWN KANAN
            // =========================

            startX =
                width +
                RandomDouble(50, 350);

            startY =
                RandomDouble(
                    -100,
                    height
                );
        }
        else
        {
            // =========================
            // SPAWN ATAS
            // =========================

            startX =
                RandomDouble(
                    0,
                    width
                );

            startY =
                -RandomDouble(
                    50,
                    250
                );
        }

        Canvas.SetLeft(
            comet.Element,
            startX
        );

        Canvas.SetTop(
            comet.Element,
            startY
        );

        /*
         * Kecepatan tetap diagonal
         * kiri-bawah.
         */
        comet.SpeedX =
            RandomDouble(1.8, 3.5);

        comet.SpeedY =
            RandomDouble(1.2, 2.4);

        comet.Delay =
            _random.Next(5, 60);
    }

    private double RandomDouble(
        double min,
        double max)
    {
        return min +
               (_random.NextDouble() *
                (max - min));
    }

    private class Comet
    {
        public required Rectangle Element { get; init; }

        public double SpeedX { get; set; }

        public double SpeedY { get; set; }

        public int Delay { get; set; }
    }
}