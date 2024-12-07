import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSettings } from './hooks/useSettings';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthGuard } from './components/AuthGuard';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import Recipes from './pages/Recipes';

function App() {
  const { settings } = useSettings();

  return (
    <ThemeProvider theme={settings.theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout>
                  <Home />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/add-recipe"
            element={
              <AuthGuard>
                <Layout>
                  <AddRecipe />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/edit-recipe/:id"
            element={
              <AuthGuard>
                <Layout>
                  <EditRecipe />
                </Layout>
              </AuthGuard>
            }
          />
          <Route
            path="/recipes"
            element={
              <AuthGuard>
                <Layout>
                  <Recipes />
                </Layout>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;