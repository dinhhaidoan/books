import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import BookDetailPage from '../pages/BookDetailPage';
import FavoritesPage from '../pages/FavoritesPage';
import AboutPage from '../pages/AboutPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = ({ isDark, onToggleTheme }) => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout isDark={isDark} onToggleTheme={onToggleTheme} />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'book/:id',
          element: <BookDetailPage />
        },
        {
          path: 'favorites',
          element: <FavoritesPage />
        },
        {
          path: 'about',
          element: <AboutPage />
        },
        {
          path: '*',
          element: <NotFoundPage />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;