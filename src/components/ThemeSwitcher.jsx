import React from 'react';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeSwitcher = () => {
  const { theme, cycleTheme } = useTheme();

  const themeNames = {
    forest: 'Fresh Forest',
    ocean: 'Ocean Energy',
    sunrise: 'Sunrise Vitality'
  };

  const themeColors = {
    forest: 'bg-green-600',
    ocean: 'bg-blue-600',
    sunrise: 'bg-orange-500'
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className="gap-2 transition-all duration-200"
      aria-label={`Current theme: ${themeNames[theme]}. Click to cycle themes.`}
    >
      <Palette className="h-4 w-4" />
      <span className="hidden sm:inline">{themeNames[theme]}</span>
      <div className={`w-3 h-3 rounded-full ${themeColors[theme]} transition-colors duration-300`} />
    </Button>
  );
};

export default ThemeSwitcher;