import type { ThemePreset } from '../types'

/**
 * Tech/AI Theme Family
 * 
 * Futuristic, cutting-edge, high-tech aesthetic
 * Perfect for: AI products, dev tools, fintech, crypto
 * Vibes: Neon accents, dark mode friendly, electric blue
 */

export const techLight: ThemePreset = {
  metadata: {
    id: 'tech-light',
    name: 'Tech Light',
    description: 'Futuristic and clean with electric blue accents',
    category: 'light',
    author: 'AnyX Design System',
    tags: ['tech', 'ai', 'modern', 'futuristic'],
  },
  tokens: {
    background: '0 0% 100%',           // Pure white
    foreground: '220 15% 10%',         // Near black with blue tint
    
    card: '0 0% 100%',
    cardForeground: '220 15% 10%',
    
    popover: '0 0% 100%',
    popoverForeground: '220 15% 10%',
    
    primary: '210 100% 50%',           // Electric blue
    primaryForeground: '0 0% 100%',
    
    secondary: '220 14% 96%',
    secondaryForeground: '220 15% 10%',
    
    muted: '220 14% 96%',
    mutedForeground: '220 10% 40%',
    
    accent: '280 100% 65%',            // Purple/violet accent
    accentForeground: '0 0% 100%',
    
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',
    
    success: '142 76% 45%',
    successForeground: '0 0% 100%',
    
    warning: '38 92% 50%',
    warningForeground: '0 0% 100%',
    
    border: '220 13% 91%',
    input: '220 13% 91%',
    ring: '210 100% 50%',
    
    radius: '0.75rem',
  },
  preview: {
    background: '#ffffff',
    primary: '#0080ff',
    accent: '#a855f7',
  },
}

export const techDark: ThemePreset = {
  metadata: {
    id: 'tech-dark',
    name: 'Tech Dark',
    description: 'Cyberpunk-inspired dark theme with neon accents',
    category: 'dark',
    author: 'AnyX Design System',
    tags: ['tech', 'ai', 'dark', 'neon', 'cyberpunk'],
  },
  tokens: {
    background: '240 10% 4%',          // Almost black, slight purple tint
    foreground: '0 0% 100%',
    
    card: '240 10% 6%',                // Slightly lighter
    cardForeground: '0 0% 100%',
    
    popover: '240 10% 6%',
    popoverForeground: '0 0% 100%',
    
    primary: '250 100% 70%',           // Electric Purple/Lavender
    primaryForeground: '240 10% 4%',
    
    secondary: '240 5% 15%',
    secondaryForeground: '0 0% 100%',
    
    muted: '240 5% 15%',
    mutedForeground: '240 5% 60%',
    
    accent: '180 100% 50%',            // Cyan accent
    accentForeground: '240 10% 4%',
    
    destructive: '0 80% 60%',
    destructiveForeground: '0 0% 100%',
    
    success: '150 100% 50%',
    successForeground: '240 10% 4%',
    
    warning: '40 100% 60%',
    warningForeground: '240 10% 4%',
    
    border: '240 5% 15%',
    input: '240 5% 15%',
    ring: '250 100% 70%',
    
    radius: '1rem',                    // Rounder corners
  },
  preview: {
    background: '#0a0a0b',
    primary: '#b8a3ff',
    accent: '#00ffff',
  },
}

