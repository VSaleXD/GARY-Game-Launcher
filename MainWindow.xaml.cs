using System.Windows;
using GARYGameLauncher.ViewModels;

namespace GARYGameLauncher;

public partial class MainWindow : Window
{
    private MainViewModel ViewModel =>
        (MainViewModel)DataContext;

    public MainWindow()
    {
        InitializeComponent();
    }

    private void NextButton_Click(object sender, RoutedEventArgs e)
    {
        ViewModel.NextPage();
    }

    private void PreviousButton_Click(object sender, RoutedEventArgs e)
    {
        ViewModel.PreviousPage();
    }

    private void Window_KeyDown(object sender, System.Windows.Input.KeyEventArgs e)
    {
        if (e.Key == System.Windows.Input.Key.Escape)
        {
            Close();
        }
    }
}