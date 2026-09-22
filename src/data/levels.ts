import { LevelConfig } from '../types';
import { generateGuaranteedLevel, getGridDimensionForLevel } from '../utils/proceduralGenerator';

export const TOTAL_GAME_LEVELS = 1000;

export interface ChapterInfo {
  id: number;
  name: string;
  range: [number, number];
  color: string;
  icon: string;
}

export const BASE_CHAPTER_CONFIG: ChapterInfo[] = [
  { id: 1, name: 'Novice Sanctuary', range: [1, 20], color: '#10b981', icon: '🌱' },
  { id: 2, name: 'Mystic Forest', range: [21, 40], color: '#06b6d4', icon: '🌲' },
  { id: 3, name: 'Crystal Caverns', range: [41, 60], color: '#8b5cf6', icon: '💎' },
  { id: 4, name: 'Volcanic Caldera', range: [61, 80], color: '#f97316', icon: '🌋' },
  { id: 5, name: 'Celestial Spire', range: [81, 100], color: '#eab308', icon: '👑' },
  { id: 6, name: 'Obsidian Citadel', range: [101, 120], color: '#f43f5e', icon: '🏰' },
  { id: 7, name: 'Frostbite Tundra', range: [121, 140], color: '#38bdf8', icon: '❄️' },
  { id: 8, name: 'Solaris Dunes', range: [141, 160], color: '#fb923c', icon: '☀️' },
  { id: 9, name: 'Abyssal Trench', range: [161, 180], color: '#3b82f6', icon: '🌊' },
  { id: 10, name: 'Phantom Nebula', range: [181, 200], color: '#a855f7', icon: '🔮' },
  { id: 11, name: 'Emerald Canopy', range: [201, 220], color: '#22c55e', icon: '🍃' },
  { id: 12, name: 'Golden Bastion', range: [221, 240], color: '#f59e0b', icon: '🏆' },
  { id: 13, name: 'Thunder Plateau', range: [241, 260], color: '#eab308', icon: '⚡' },
  { id: 14, name: 'Shadow Labyrinth', range: [261, 280], color: '#64748b', icon: '🗝️' },
  { id: 15, name: 'Prismatic Rift', range: [281, 300], color: '#ec4899', icon: '🌈' },
  { id: 16, name: 'Cyber Matrix', range: [301, 320], color: '#06b6d4', icon: '💾' },
  { id: 17, name: 'Crimson Peak', range: [321, 340], color: '#ef4444', icon: '🔥' },
  { id: 18, name: 'Lapis Lagoon', range: [341, 360], color: '#2563eb', icon: '🐚' },
  { id: 19, name: 'Vortex Cavern', range: [361, 380], color: '#7c3aed', icon: '🌀' },
  { id: 20, name: 'Titan Hollow', range: [381, 400], color: '#d97706', icon: '🗿' },
  { id: 21, name: 'Astral Temple', range: [401, 420], color: '#6366f1', icon: '⛩️' },
  { id: 22, name: 'Venom Marsh', range: [421, 440], color: '#84cc16', icon: '🐍' },
  { id: 23, name: 'Cosmic Forge', range: [441, 460], color: '#f97316', icon: '⚒️' },
  { id: 24, name: 'Mirage Mirage', range: [461, 480], color: '#14b8a6', icon: '✨' },
  { id: 25, name: 'Starlight Core', range: [481, 500], color: '#f43f5e', icon: '🌟' },
  { id: 26, name: 'Ironhold Maze', range: [501, 520], color: '#94a3b8', icon: '🛡️' },
  { id: 27, name: 'Eclipse Valley', range: [521, 540], color: '#475569', icon: '🌘' },
  { id: 28, name: 'Aurora Borealis', range: [541, 560], color: '#2dd4bf', icon: '🌌' },
  { id: 29, name: 'Hyperion Gate', range: [561, 580], color: '#8b5cf6', icon: '🚪' },
  { id: 30, name: 'Zenith Peak', range: [581, 600], color: '#e11d48', icon: '⛰️' },
  { id: 31, name: 'Opal Sanctum', range: [601, 620], color: '#c084fc', icon: '💠' },
  { id: 32, name: 'Plasma Basin', range: [621, 640], color: '#fb7185', icon: '☄️' },
  { id: 33, name: 'Quantum Grove', range: [641, 660], color: '#34d399', icon: '🌳' },
  { id: 34, name: 'Glacial Spires', range: [661, 680], color: '#67e8f9', icon: '🧊' },
  { id: 35, name: 'Dragon Ridge', range: [681, 700], color: '#ea580c', icon: '🐉' },
  { id: 36, name: 'Supernova Void', range: [701, 720], color: '#db2777', icon: '💥' },
  { id: 37, name: 'Aegis Keep', range: [721, 740], color: '#6b7280', icon: '🏰' },
  { id: 38, name: 'Biolume Reef', range: [741, 760], color: '#059669', icon: '🐠' },
  { id: 39, name: 'Rift Valley', range: [761, 780], color: '#9333ea', icon: '⚡' },
  { id: 40, name: 'Chrono Horizon', range: [781, 800], color: '#d97706', icon: '⏳' },
  { id: 41, name: 'Singularity Chamber', range: [801, 820], color: '#4f46e5', icon: '🕳️' },
  { id: 42, name: 'Magma Falls', range: [821, 840], color: '#dc2626', icon: '🌋' },
  { id: 43, name: 'Spectral Nexus', range: [841, 860], color: '#a21caf', icon: '👻' },
  { id: 44, name: 'Apex Colosseum', range: [861, 880], color: '#ca8a04', icon: '🏛️' },
  { id: 45, name: 'Nebula Veil', range: [881, 900], color: '#0284c7', icon: '🌫️' },
  { id: 46, name: 'Eternity Garden', range: [901, 920], color: '#16a34a', icon: '🌸' },
  { id: 47, name: 'Genesis Matrix', range: [921, 940], color: '#4338ca', icon: '🧬' },
  { id: 48, name: 'Omega Citadel', range: [941, 960], color: '#be123c', icon: '👑' },
  { id: 49, name: 'Vanguard Dominion', range: [961, 980], color: '#b45309', icon: '⚔️' },
  { id: 50, name: 'Grand Master Zenith', range: [981, 1000], color: '#eab308', icon: '🪐' },
];

export const CHAPTER_CONFIG = BASE_CHAPTER_CONFIG;

const INFINITE_CHAPTER_THEMES = [
  { name: 'Infinity Realm', icon: '🌌', color: '#38bdf8' },
  { name: 'Astral Continuum', icon: '🪐', color: '#a855f7' },
  { name: 'Mythic Cosmos', icon: '💫', color: '#ec4899' },
  { name: 'Chronos Void', icon: '⏳', color: '#f59e0b' },
  { name: 'Aether Matrix', icon: '💠', color: '#14b8a6' },
  { name: 'Hyperion Nexus', icon: '⚡', color: '#6366f1' },
  { name: 'Omega Singularity', icon: '🔮', color: '#f43f5e' },
  { name: 'Grand Master Coil', icon: '👑', color: '#eab308' },
];

export function getChaptersForProgress(unlockedLevel: number): ChapterInfo[] {
  const baseCount = BASE_CHAPTER_CONFIG.length;
  const maxChapId = Math.max(baseCount, Math.ceil(Math.max(unlockedLevel, TOTAL_GAME_LEVELS) / 20));
  const chapters: ChapterInfo[] = [...BASE_CHAPTER_CONFIG];
  for (let c = baseCount + 1; c <= maxChapId; c++) {
    const theme = INFINITE_CHAPTER_THEMES[(c - baseCount - 1) % INFINITE_CHAPTER_THEMES.length];
    const start = (c - 1) * 20 + 1;
    const end = c * 20;
    const cycle = Math.floor((c - baseCount - 1) / INFINITE_CHAPTER_THEMES.length);
    const suffix = cycle > 0 ? ` ${cycle + 1}` : '';
    chapters.push({
      id: c,
      name: `${theme.name}${suffix}`,
      range: [start, end],
      color: theme.color,
      icon: theme.icon,
    });
  }
  return chapters;
}

export const COLOR_PALETTE = {
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  indigo: '#6366f1',
  purple: '#8b5cf6',
  violet: '#a855f7',
  pink: '#ec4899',
  rose: '#f43f5e',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  brown: '#854d0e',
  darkBlue: '#1e3a8a',
  deepTeal: '#0f766e',
};

export const LEVELS: LevelConfig[] = [
  {
    "id": 1,
    "name": "First Slither",
    "gridWidth": 5,
    "gridHeight": 5,
    "targetMoves": 3,
    "maxMoves": 7,
    "snakes": [
      {
        "id": "s_1_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_1_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_1_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "name": "Green Meadow",
    "gridWidth": 5,
    "gridHeight": 5,
    "targetMoves": 3,
    "maxMoves": 7,
    "snakes": [
      {
        "id": "s_2_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_2_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_2_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "name": "Twisting Creek",
    "gridWidth": 5,
    "gridHeight": 5,
    "targetMoves": 4,
    "maxMoves": 8,
    "snakes": [
      {
        "id": "s_3_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_3_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_3_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_3_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "name": "Clover Patch",
    "gridWidth": 5,
    "gridHeight": 5,
    "targetMoves": 3,
    "maxMoves": 7,
    "snakes": [
      {
        "id": "s_4_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_4_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_4_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "name": "Emerald Labyrinth",
    "gridWidth": 12,
    "gridHeight": 12,
    "targetMoves": 18,
    "maxMoves": 23,
    "snakes": [
      {
        "id": "s_5_0",
        "color": "#22c55e",
        "direction": "right",
        "cells": [
          { "x": 3, "y": 0 },
          { "x": 3, "y": 1 },
          { "x": 3, "y": 2 },
          { "x": 2, "y": 2 },
          { "x": 2, "y": 1 },
          { "x": 2, "y": 0 },
          { "x": 1, "y": 0 },
          { "x": 1, "y": 1 },
          { "x": 1, "y": 2 },
          { "x": 1, "y": 3 }
        ]
      },
      {
        "id": "s_5_1",
        "color": "#f97316",
        "direction": "down",
        "cells": [
          { "x": 2, "y": 9 },
          { "x": 2, "y": 8 },
          { "x": 2, "y": 7 },
          { "x": 3, "y": 7 }
        ]
      },
      {
        "id": "s_5_2",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          { "x": 7, "y": 11 },
          { "x": 6, "y": 11 },
          { "x": 6, "y": 10 },
          { "x": 7, "y": 10 },
          { "x": 7, "y": 9 },
          { "x": 7, "y": 8 },
          { "x": 6, "y": 8 },
          { "x": 6, "y": 9 },
          { "x": 5, "y": 9 }
        ]
      },
      {
        "id": "s_5_3",
        "color": "#3b82f6",
        "direction": "down",
        "cells": [
          { "x": 9, "y": 7 },
          { "x": 10, "y": 7 },
          { "x": 10, "y": 6 },
          { "x": 11, "y": 6 },
          { "x": 11, "y": 7 },
          { "x": 11, "y": 8 }
        ]
      },
      {
        "id": "s_5_4",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          { "x": 1, "y": 5 },
          { "x": 1, "y": 6 },
          { "x": 2, "y": 6 },
          { "x": 3, "y": 6 },
          { "x": 3, "y": 5 }
        ]
      },
      {
        "id": "s_5_5",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          { "x": 4, "y": 1 },
          { "x": 4, "y": 2 },
          { "x": 5, "y": 2 },
          { "x": 6, "y": 2 },
          { "x": 7, "y": 2 },
          { "x": 7, "y": 1 }
        ]
      },
      {
        "id": "s_5_6",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          { "x": 1, "y": 8 },
          { "x": 1, "y": 7 },
          { "x": 0, "y": 7 },
          { "x": 0, "y": 6 }
        ]
      },
      {
        "id": "s_5_7",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          { "x": 5, "y": 3 },
          { "x": 4, "y": 3 },
          { "x": 4, "y": 4 },
          { "x": 4, "y": 5 },
          { "x": 4, "y": 6 },
          { "x": 5, "y": 6 },
          { "x": 5, "y": 5 },
          { "x": 5, "y": 4 },
          { "x": 6, "y": 4 },
          { "x": 6, "y": 5 },
          { "x": 7, "y": 5 },
          { "x": 7, "y": 4 },
          { "x": 7, "y": 3 },
          { "x": 8, "y": 3 },
          { "x": 8, "y": 2 },
          { "x": 8, "y": 1 }
        ]
      },
      {
        "id": "s_5_8",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          { "x": 8, "y": 11 },
          { "x": 8, "y": 10 },
          { "x": 9, "y": 10 },
          { "x": 9, "y": 11 },
          { "x": 10, "y": 11 },
          { "x": 11, "y": 11 },
          { "x": 11, "y": 10 },
          { "x": 11, "y": 9 },
          { "x": 10, "y": 9 }
        ]
      },
      {
        "id": "s_5_9",
        "color": "#a855f7",
        "direction": "up",
        "cells": [
          { "x": 0, "y": 1 },
          { "x": 0, "y": 2 },
          { "x": 0, "y": 3 },
          { "x": 0, "y": 4 },
          { "x": 1, "y": 4 },
          { "x": 2, "y": 4 },
          { "x": 2, "y": 5 }
        ]
      },
      {
        "id": "s_5_10",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          { "x": 4, "y": 9 },
          { "x": 3, "y": 9 },
          { "x": 3, "y": 8 },
          { "x": 4, "y": 8 },
          { "x": 4, "y": 7 },
          { "x": 5, "y": 7 }
        ]
      },
      {
        "id": "s_5_11",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          { "x": 11, "y": 2 },
          { "x": 10, "y": 2 },
          { "x": 9, "y": 2 },
          { "x": 9, "y": 1 },
          { "x": 9, "y": 0 },
          { "x": 10, "y": 0 },
          { "x": 11, "y": 0 },
          { "x": 11, "y": 1 },
          { "x": 10, "y": 1 }
        ]
      },
      {
        "id": "s_5_12",
        "color": "#22c55e",
        "direction": "right",
        "cells": [
          { "x": 8, "y": 4 },
          { "x": 8, "y": 5 },
          { "x": 9, "y": 5 },
          { "x": 10, "y": 5 },
          { "x": 10, "y": 4 },
          { "x": 11, "y": 4 },
          { "x": 11, "y": 5 }
        ]
      },
      {
        "id": "s_5_13",
        "color": "#f97316",
        "direction": "right",
        "cells": [
          { "x": 11, "y": 3 },
          { "x": 10, "y": 3 },
          { "x": 9, "y": 3 }
        ]
      },
      {
        "id": "s_5_14",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          { "x": 2, "y": 10 },
          { "x": 2, "y": 11 },
          { "x": 3, "y": 11 },
          { "x": 3, "y": 10 },
          { "x": 4, "y": 10 },
          { "x": 5, "y": 10 },
          { "x": 5, "y": 11 },
          { "x": 4, "y": 11 }
        ]
      },
      {
        "id": "s_5_15",
        "color": "#3b82f6",
        "direction": "up",
        "cells": [
          { "x": 8, "y": 0 },
          { "x": 7, "y": 0 },
          { "x": 6, "y": 0 },
          { "x": 6, "y": 1 }
        ]
      },
      {
        "id": "s_5_16",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          { "x": 0, "y": 8 },
          { "x": 0, "y": 9 },
          { "x": 1, "y": 9 },
          { "x": 1, "y": 10 },
          { "x": 1, "y": 11 },
          { "x": 0, "y": 11 },
          { "x": 0, "y": 10 }
        ]
      },
      {
        "id": "s_5_17",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          { "x": 4, "y": 0 },
          { "x": 5, "y": 0 },
          { "x": 5, "y": 1 }
        ]
      }
    ]
  },
  {
    "id": 6,
    "name": "Gentle Breeze",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 4,
    "maxMoves": 8,
    "snakes": [
      {
        "id": "s_6_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_6_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_6_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_6_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "name": "Mossy Stone",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 4,
    "maxMoves": 8,
    "snakes": [
      {
        "id": "s_7_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_7_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_7_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_7_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 8,
    "name": "Quiet Pond",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 5,
    "maxMoves": 9,
    "snakes": [
      {
        "id": "s_8_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_8_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          }
        ]
      },
      {
        "id": "s_8_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_8_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_8_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 9,
    "name": "Pine Needles",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 5,
    "maxMoves": 9,
    "snakes": [
      {
        "id": "s_9_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_9_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_9_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_9_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_9_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      }
    ]
  },
  {
    "id": 10,
    "name": "Whispering Glade",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 5,
    "maxMoves": 9,
    "snakes": [
      {
        "id": "s_10_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_10_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_10_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_10_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_10_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 11,
    "name": "Stone Path",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 5,
    "maxMoves": 9,
    "snakes": [
      {
        "id": "s_11_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_11_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_11_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_11_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_11_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 12,
    "name": "Coiled Stream",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 4,
    "maxMoves": 8,
    "snakes": [
      {
        "id": "s_12_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_12_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_12_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_12_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 13,
    "name": "Birch Grove",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 4,
    "maxMoves": 8,
    "snakes": [
      {
        "id": "s_13_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      },
      {
        "id": "s_13_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_13_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_13_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 14,
    "name": "Bramble Thicket",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 5,
    "maxMoves": 9,
    "snakes": [
      {
        "id": "s_14_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_14_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_14_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_14_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_14_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      }
    ]
  },
  {
    "id": 15,
    "name": "Hidden Hollow",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 5,
    "maxMoves": 9,
    "snakes": [
      {
        "id": "s_15_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_15_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_15_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_15_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_15_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 16,
    "name": "Fern Valley",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 6,
    "maxMoves": 10,
    "snakes": [
      {
        "id": "s_16_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_16_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_16_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_16_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_16_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_16_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 17,
    "name": "River Bend",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 6,
    "maxMoves": 10,
    "snakes": [
      {
        "id": "s_17_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_17_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_17_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_17_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      },
      {
        "id": "s_17_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_17_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 18,
    "name": "Dewdrop Trail",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 6,
    "maxMoves": 10,
    "snakes": [
      {
        "id": "s_18_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_18_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_18_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_18_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_18_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_18_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 19,
    "name": "Verdant Maze",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 6,
    "maxMoves": 10,
    "snakes": [
      {
        "id": "s_19_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_19_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_19_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_19_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_19_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_19_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 20,
    "name": "Sanctuary Gate",
    "gridWidth": 6,
    "gridHeight": 6,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_20_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_20_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_20_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_20_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_20_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_20_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_20_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      }
    ]
  },
  {
    "id": 21,
    "name": "Emerald Shadow",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 5,
    "maxMoves": 9,
    "snakes": [
      {
        "id": "s_21_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_21_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_21_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_21_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          }
        ]
      },
      {
        "id": "s_21_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 22,
    "name": "Ancient Roots",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 6,
    "maxMoves": 10,
    "snakes": [
      {
        "id": "s_22_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_22_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_22_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_22_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_22_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_22_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 23,
    "name": "Mushroom Canopy",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 6,
    "maxMoves": 10,
    "snakes": [
      {
        "id": "s_23_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      },
      {
        "id": "s_23_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_23_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_23_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_23_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          }
        ]
      },
      {
        "id": "s_23_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 24,
    "name": "Will-o-Wisp",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_24_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      },
      {
        "id": "s_24_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_24_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_24_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      },
      {
        "id": "s_24_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_24_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          }
        ]
      },
      {
        "id": "s_24_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 25,
    "name": "Twisted Willow",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_25_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_25_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_25_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_25_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_25_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_25_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      },
      {
        "id": "s_25_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 26,
    "name": "Enchanted Hollow",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_26_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_26_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_26_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_26_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_26_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      },
      {
        "id": "s_26_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_26_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 27,
    "name": "Foggy Crossing",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_27_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_27_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_27_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_27_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_27_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_27_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_27_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 28,
    "name": "Ivy Labyrinth",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_28_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_28_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_28_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_28_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_28_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_28_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_28_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 29,
    "name": "Mossy Archway",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_29_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_29_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_29_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_29_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_29_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_29_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_29_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 30,
    "name": "Twilight Glade",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_30_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_30_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_30_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_30_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_30_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_30_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_30_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 31,
    "name": "Serpent Shrine",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_31_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_31_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_31_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_31_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_31_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          }
        ]
      },
      {
        "id": "s_31_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_31_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 32,
    "name": "Moonlit Thicket",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_32_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_32_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_32_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_32_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_32_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_32_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_32_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_32_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_32_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      }
    ]
  },
  {
    "id": 33,
    "name": "Runestone Passage",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_33_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_33_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_33_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_33_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_33_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_33_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          }
        ]
      },
      {
        "id": "s_33_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_33_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 34,
    "name": "Bramble Knot",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_34_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_34_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_34_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_34_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_34_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_34_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      },
      {
        "id": "s_34_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_34_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 35,
    "name": "Faerie Ring",
    "gridWidth": 7,
    "gridHeight": 7,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_35_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_35_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_35_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_35_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_35_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_35_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_35_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_35_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 36,
    "name": "Timber Twist",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_36_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_36_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 7
          }
        ]
      },
      {
        "id": "s_36_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_36_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          }
        ]
      },
      {
        "id": "s_36_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_36_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      },
      {
        "id": "s_36_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 37,
    "name": "Deep Woods",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 6,
    "maxMoves": 10,
    "snakes": [
      {
        "id": "s_37_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_37_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          }
        ]
      },
      {
        "id": "s_37_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_37_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_37_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          }
        ]
      },
      {
        "id": "s_37_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      }
    ]
  },
  {
    "id": 38,
    "name": "Viper Crossing",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 6,
    "maxMoves": 10,
    "snakes": [
      {
        "id": "s_38_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_38_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          }
        ]
      },
      {
        "id": "s_38_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_38_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_38_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_38_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 39,
    "name": "Canopy Coil",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_39_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_39_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_39_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_39_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_39_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_39_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_39_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 40,
    "name": "Forest Heart",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_40_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_40_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_40_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      },
      {
        "id": "s_40_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_40_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_40_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_40_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_40_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      }
    ]
  },
  {
    "id": 41,
    "name": "Glittering Chasm",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_41_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          }
        ]
      },
      {
        "id": "s_41_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      },
      {
        "id": "s_41_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_41_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_41_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_41_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_41_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_41_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 42,
    "name": "Amethyst Ridge",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_42_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_42_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_42_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_42_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_42_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_42_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_42_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_42_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      }
    ]
  },
  {
    "id": 43,
    "name": "Stalactite Maze",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_43_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      },
      {
        "id": "s_43_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 6
          }
        ]
      },
      {
        "id": "s_43_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_43_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_43_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_43_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_43_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_43_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 44,
    "name": "Prism Pathway",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_44_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          }
        ]
      },
      {
        "id": "s_44_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_44_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_44_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_44_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_44_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          }
        ]
      },
      {
        "id": "s_44_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_44_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 45,
    "name": "Luminescent Depth",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_45_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 7
          }
        ]
      },
      {
        "id": "s_45_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_45_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_45_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_45_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_45_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          }
        ]
      },
      {
        "id": "s_45_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_45_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 46,
    "name": "Glowstone Hollow",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_46_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_46_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_46_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_46_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_46_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_46_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_46_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      },
      {
        "id": "s_46_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_46_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          }
        ]
      }
    ]
  },
  {
    "id": 47,
    "name": "Echo Chamber",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_47_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_47_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      },
      {
        "id": "s_47_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_47_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_47_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_47_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          }
        ]
      },
      {
        "id": "s_47_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      },
      {
        "id": "s_47_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_47_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_47_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 48,
    "name": "Geode Matrix",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_48_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      },
      {
        "id": "s_48_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_48_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_48_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_48_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      },
      {
        "id": "s_48_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          }
        ]
      },
      {
        "id": "s_48_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_48_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_48_9",
        "color": "#6366f1",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 49,
    "name": "Subterranean Twist",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_49_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_49_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_49_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_49_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_49_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_49_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_49_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_49_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      },
      {
        "id": "s_49_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 50,
    "name": "Quartz Corridor",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_50_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_50_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_50_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_50_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_50_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_50_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_50_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          }
        ]
      },
      {
        "id": "s_50_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_50_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 51,
    "name": "Sapphire Vault",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_51_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_51_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_51_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_51_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_51_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          }
        ]
      },
      {
        "id": "s_51_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_51_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_51_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 52,
    "name": "Crystal Coil",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_52_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_52_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_52_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          }
        ]
      },
      {
        "id": "s_52_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_52_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_52_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_52_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 53,
    "name": "Abyssal Chasm",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 7,
    "maxMoves": 11,
    "snakes": [
      {
        "id": "s_53_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_53_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_53_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_53_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_53_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_53_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          }
        ]
      },
      {
        "id": "s_53_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          }
        ]
      }
    ]
  },
  {
    "id": 54,
    "name": "Reflective Pool",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_54_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      },
      {
        "id": "s_54_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_54_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_54_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          }
        ]
      },
      {
        "id": "s_54_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_54_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_54_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          }
        ]
      },
      {
        "id": "s_54_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 55,
    "name": "Gemstone Knot",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_55_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          }
        ]
      },
      {
        "id": "s_55_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_55_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          }
        ]
      },
      {
        "id": "s_55_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      },
      {
        "id": "s_55_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_55_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_55_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_55_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_55_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 56,
    "name": "Deep Spire",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_56_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_56_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_56_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_56_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_56_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_56_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_56_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_56_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 57,
    "name": "Glimmer Labyrinth",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 8,
    "maxMoves": 12,
    "snakes": [
      {
        "id": "s_57_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_57_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_57_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_57_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_57_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_57_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_57_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_57_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          }
        ]
      }
    ]
  },
  {
    "id": 58,
    "name": "Diamond Reach",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_58_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_58_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_58_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      },
      {
        "id": "s_58_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_58_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_58_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_58_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_58_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          }
        ]
      },
      {
        "id": "s_58_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      },
      {
        "id": "s_58_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          }
        ]
      }
    ]
  },
  {
    "id": 59,
    "name": "Jeweled Serpent",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_59_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_59_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      },
      {
        "id": "s_59_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_59_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_59_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          }
        ]
      },
      {
        "id": "s_59_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          }
        ]
      },
      {
        "id": "s_59_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      },
      {
        "id": "s_59_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_59_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_59_9",
        "color": "#6366f1",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 60,
    "name": "Cavern Core",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_60_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_60_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          }
        ]
      },
      {
        "id": "s_60_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_60_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          }
        ]
      },
      {
        "id": "s_60_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_60_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_60_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_60_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_60_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 61,
    "name": "Molten Crest",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_61_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_61_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          }
        ]
      },
      {
        "id": "s_61_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_61_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_61_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_61_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_61_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_61_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_61_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 62,
    "name": "Ash Valley",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_62_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          }
        ]
      },
      {
        "id": "s_62_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      },
      {
        "id": "s_62_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_62_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_62_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          }
        ]
      },
      {
        "id": "s_62_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          }
        ]
      },
      {
        "id": "s_62_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_62_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 5
          }
        ]
      },
      {
        "id": "s_62_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_62_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 63,
    "name": "Obsidian Trench",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_63_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_63_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_63_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          }
        ]
      },
      {
        "id": "s_63_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_63_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_63_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_63_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_63_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_63_9",
        "color": "#6366f1",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      },
      {
        "id": "s_63_10",
        "color": "#d97706",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 64,
    "name": "Basalt Labyrinth",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_64_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          }
        ]
      },
      {
        "id": "s_64_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_64_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_64_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          }
        ]
      },
      {
        "id": "s_64_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_64_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          }
        ]
      },
      {
        "id": "s_64_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_64_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_64_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_64_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 65,
    "name": "Magma Current",
    "gridWidth": 8,
    "gridHeight": 8,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_65_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_65_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_65_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_65_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_65_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      },
      {
        "id": "s_65_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_65_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_65_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      },
      {
        "id": "s_65_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_65_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 66,
    "name": "Smoldering Knot",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_66_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_66_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_66_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_66_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_66_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_66_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_66_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_66_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_66_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 8
          }
        ]
      },
      {
        "id": "s_66_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 67,
    "name": "Ember Ridge",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_67_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_67_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_67_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          }
        ]
      },
      {
        "id": "s_67_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_67_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_67_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          }
        ]
      },
      {
        "id": "s_67_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_67_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_67_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 8,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 68,
    "name": "Lava Nexus",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 9,
    "maxMoves": 13,
    "snakes": [
      {
        "id": "s_68_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_68_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_68_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          }
        ]
      },
      {
        "id": "s_68_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_68_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      },
      {
        "id": "s_68_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_68_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          }
        ]
      },
      {
        "id": "s_68_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_68_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          }
        ]
      }
    ]
  },
  {
    "id": 69,
    "name": "Pumice Pathway",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_69_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      },
      {
        "id": "s_69_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          }
        ]
      },
      {
        "id": "s_69_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          }
        ]
      },
      {
        "id": "s_69_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_69_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_69_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          }
        ]
      },
      {
        "id": "s_69_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_69_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_69_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_69_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 70,
    "name": "Cinder Core",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_70_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_70_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_70_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      {
        "id": "s_70_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      },
      {
        "id": "s_70_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          }
        ]
      },
      {
        "id": "s_70_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      },
      {
        "id": "s_70_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_70_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      },
      {
        "id": "s_70_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_70_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 71,
    "name": "Firebrand Coil",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_71_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          }
        ]
      },
      {
        "id": "s_71_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_71_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_71_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_71_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          }
        ]
      },
      {
        "id": "s_71_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_71_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_71_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_71_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_71_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          }
        ]
      }
    ]
  },
  {
    "id": 72,
    "name": "Inferno Slither",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_72_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_72_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      },
      {
        "id": "s_72_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          }
        ]
      },
      {
        "id": "s_72_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_72_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_72_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_72_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_72_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          }
        ]
      },
      {
        "id": "s_72_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          }
        ]
      },
      {
        "id": "s_72_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 73,
    "name": "Volcanic Rift",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 11,
    "maxMoves": 15,
    "snakes": [
      {
        "id": "s_73_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          }
        ]
      },
      {
        "id": "s_73_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_73_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_73_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_73_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_73_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_73_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_73_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          }
        ]
      },
      {
        "id": "s_73_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          }
        ]
      },
      {
        "id": "s_73_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          }
        ]
      },
      {
        "id": "s_73_11",
        "color": "#059669",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      }
    ]
  },
  {
    "id": 74,
    "name": "Blazing Tangle",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 11,
    "maxMoves": 15,
    "snakes": [
      {
        "id": "s_74_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 0
          }
        ]
      },
      {
        "id": "s_74_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          }
        ]
      },
      {
        "id": "s_74_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          }
        ]
      },
      {
        "id": "s_74_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          }
        ]
      },
      {
        "id": "s_74_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          }
        ]
      },
      {
        "id": "s_74_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_74_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      },
      {
        "id": "s_74_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_74_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_74_10",
        "color": "#d97706",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_74_11",
        "color": "#059669",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 75,
    "name": "Scorched Earth",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 11,
    "maxMoves": 15,
    "snakes": [
      {
        "id": "s_75_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_75_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          }
        ]
      },
      {
        "id": "s_75_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_75_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_75_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_75_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_75_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          }
        ]
      },
      {
        "id": "s_75_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_75_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_75_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 8,
            "y": 1
          }
        ]
      },
      {
        "id": "s_75_10",
        "color": "#d97706",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          }
        ]
      }
    ]
  },
  {
    "id": 76,
    "name": "Pyroclast Maze",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 11,
    "maxMoves": 15,
    "snakes": [
      {
        "id": "s_76_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          }
        ]
      },
      {
        "id": "s_76_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_76_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_76_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_76_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_76_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_76_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_76_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      },
      {
        "id": "s_76_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          }
        ]
      },
      {
        "id": "s_76_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_76_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 77,
    "name": "Ignited Pass",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_77_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_77_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_77_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_77_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_77_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_77_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_77_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 8
          }
        ]
      },
      {
        "id": "s_77_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 6
          }
        ]
      },
      {
        "id": "s_77_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_77_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_77_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_77_11",
        "color": "#059669",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 78,
    "name": "Charred Crypt",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_78_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_78_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          }
        ]
      },
      {
        "id": "s_78_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          }
        ]
      },
      {
        "id": "s_78_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          }
        ]
      },
      {
        "id": "s_78_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_78_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_78_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          }
        ]
      },
      {
        "id": "s_78_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          }
        ]
      },
      {
        "id": "s_78_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      },
      {
        "id": "s_78_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 8
          }
        ]
      },
      {
        "id": "s_78_11",
        "color": "#059669",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      },
      {
        "id": "s_78_12",
        "color": "#be123c",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 79,
    "name": "Dragon Breath",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_79_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_79_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 1
          }
        ]
      },
      {
        "id": "s_79_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_79_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_79_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          }
        ]
      },
      {
        "id": "s_79_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_79_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_79_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_79_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_79_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_79_10",
        "color": "#d97706",
        "direction": "up",
        "cells": [
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_79_11",
        "color": "#059669",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          }
        ]
      }
    ]
  },
  {
    "id": 80,
    "name": "Caldera Peak",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_80_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_80_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_80_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_80_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_80_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_80_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_80_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          }
        ]
      },
      {
        "id": "s_80_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_80_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          }
        ]
      },
      {
        "id": "s_80_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_80_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_80_11",
        "color": "#059669",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 81,
    "name": "Skyward Ascent",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_81_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          }
        ]
      },
      {
        "id": "s_81_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          }
        ]
      },
      {
        "id": "s_81_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          }
        ]
      },
      {
        "id": "s_81_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_81_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_81_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_81_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 0
          }
        ]
      },
      {
        "id": "s_81_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_81_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      },
      {
        "id": "s_81_10",
        "color": "#d97706",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 82,
    "name": "Cloud Spire",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 10,
    "maxMoves": 14,
    "snakes": [
      {
        "id": "s_82_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_82_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_82_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      },
      {
        "id": "s_82_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 8,
            "y": 1
          }
        ]
      },
      {
        "id": "s_82_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_82_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          }
        ]
      },
      {
        "id": "s_82_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          }
        ]
      },
      {
        "id": "s_82_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 5
          }
        ]
      },
      {
        "id": "s_82_9",
        "color": "#6366f1",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_82_10",
        "color": "#d97706",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      }
    ]
  },
  {
    "id": 83,
    "name": "Starlight Path",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_83_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_83_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_83_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_83_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          }
        ]
      },
      {
        "id": "s_83_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_83_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_83_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_83_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_83_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_83_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_83_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          }
        ]
      },
      {
        "id": "s_83_11",
        "color": "#059669",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 84,
    "name": "Astral Knot",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 11,
    "maxMoves": 15,
    "snakes": [
      {
        "id": "s_84_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_84_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_84_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_84_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_84_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      },
      {
        "id": "s_84_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_84_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_84_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_84_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 8,
            "y": 5
          }
        ]
      },
      {
        "id": "s_84_9",
        "color": "#6366f1",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_84_10",
        "color": "#d97706",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      }
    ]
  },
  {
    "id": 85,
    "name": "Solar Flare",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 11,
    "maxMoves": 15,
    "snakes": [
      {
        "id": "s_85_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_85_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 5
          }
        ]
      },
      {
        "id": "s_85_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_85_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          }
        ]
      },
      {
        "id": "s_85_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          }
        ]
      },
      {
        "id": "s_85_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_85_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          }
        ]
      },
      {
        "id": "s_85_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          }
        ]
      },
      {
        "id": "s_85_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_85_10",
        "color": "#d97706",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_85_11",
        "color": "#059669",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 86,
    "name": "Nebula Coil",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_86_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_86_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_86_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          }
        ]
      },
      {
        "id": "s_86_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          }
        ]
      },
      {
        "id": "s_86_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_86_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_86_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_86_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      {
        "id": "s_86_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_86_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_86_10",
        "color": "#d97706",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_86_12",
        "color": "#be123c",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 87,
    "name": "Constellation Maze",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_87_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_87_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      },
      {
        "id": "s_87_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_87_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          }
        ]
      },
      {
        "id": "s_87_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          }
        ]
      },
      {
        "id": "s_87_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 7
          }
        ]
      },
      {
        "id": "s_87_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_87_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_87_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_87_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_87_11",
        "color": "#059669",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 5
          }
        ]
      },
      {
        "id": "s_87_12",
        "color": "#be123c",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          }
        ]
      }
    ]
  },
  {
    "id": 88,
    "name": "Cosmic Serpent",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_88_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          }
        ]
      },
      {
        "id": "s_88_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          }
        ]
      },
      {
        "id": "s_88_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_88_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_88_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          }
        ]
      },
      {
        "id": "s_88_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_88_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_88_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_88_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_88_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_88_10",
        "color": "#d97706",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_88_11",
        "color": "#059669",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 89,
    "name": "Zenith Passage",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 13,
    "maxMoves": 17,
    "snakes": [
      {
        "id": "s_89_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          }
        ]
      },
      {
        "id": "s_89_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      },
      {
        "id": "s_89_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      },
      {
        "id": "s_89_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_89_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          }
        ]
      },
      {
        "id": "s_89_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 4
          }
        ]
      },
      {
        "id": "s_89_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_89_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_89_8",
        "color": "#eab308",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_89_9",
        "color": "#6366f1",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          }
        ]
      },
      {
        "id": "s_89_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_89_11",
        "color": "#059669",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          }
        ]
      },
      {
        "id": "s_89_12",
        "color": "#be123c",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      }
    ]
  },
  {
    "id": 90,
    "name": "Aether Stream",
    "gridWidth": 9,
    "gridHeight": 9,
    "targetMoves": 13,
    "maxMoves": 17,
    "snakes": [
      {
        "id": "s_90_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          }
        ]
      },
      {
        "id": "s_90_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_90_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_90_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_90_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_90_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_90_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_90_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_90_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 8
          }
        ]
      },
      {
        "id": "s_90_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_90_10",
        "color": "#d97706",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_90_11",
        "color": "#059669",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          }
        ]
      },
      {
        "id": "s_90_13",
        "color": "#0284c7",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      }
    ]
  },
  {
    "id": 91,
    "name": "Stardust Labyrinth",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 13,
    "maxMoves": 17,
    "snakes": [
      {
        "id": "s_91_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_91_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_91_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      },
      {
        "id": "s_91_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 5
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_91_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 9
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          }
        ]
      },
      {
        "id": "s_91_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_91_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 9,
            "y": 0
          },
          {
            "x": 9,
            "y": 1
          },
          {
            "x": 9,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_91_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 3
          },
          {
            "x": 9,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_91_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          }
        ]
      },
      {
        "id": "s_91_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 9
          },
          {
            "x": 4,
            "y": 9
          },
          {
            "x": 3,
            "y": 9
          },
          {
            "x": 2,
            "y": 9
          },
          {
            "x": 1,
            "y": 9
          }
        ]
      },
      {
        "id": "s_91_10",
        "color": "#d97706",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_91_11",
        "color": "#059669",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_91_12",
        "color": "#be123c",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 9
          },
          {
            "x": 7,
            "y": 9
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 92,
    "name": "Eclipse Twist",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 12,
    "maxMoves": 16,
    "snakes": [
      {
        "id": "s_92_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_92_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 9
          },
          {
            "x": 4,
            "y": 9
          },
          {
            "x": 5,
            "y": 9
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          }
        ]
      },
      {
        "id": "s_92_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 9
          },
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 2,
            "y": 9
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      },
      {
        "id": "s_92_3",
        "color": "#8b5cf6",
        "direction": "down",
        "cells": [
          {
            "x": 9,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_92_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_92_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_92_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 9,
            "y": 6
          },
          {
            "x": 9,
            "y": 5
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 7,
            "y": 8
          }
        ]
      },
      {
        "id": "s_92_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      },
      {
        "id": "s_92_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          }
        ]
      },
      {
        "id": "s_92_9",
        "color": "#6366f1",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          }
        ]
      },
      {
        "id": "s_92_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 7
          },
          {
            "x": 9,
            "y": 8
          },
          {
            "x": 9,
            "y": 9
          },
          {
            "x": 8,
            "y": 9
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_92_11",
        "color": "#059669",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 9,
            "y": 0
          },
          {
            "x": 9,
            "y": 1
          }
        ]
      }
    ]
  },
  {
    "id": 93,
    "name": "Aurora Nexus",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 13,
    "maxMoves": 17,
    "snakes": [
      {
        "id": "s_93_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          }
        ]
      },
      {
        "id": "s_93_1",
        "color": "#10b981",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      },
      {
        "id": "s_93_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          }
        ]
      },
      {
        "id": "s_93_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          }
        ]
      },
      {
        "id": "s_93_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 9
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          }
        ]
      },
      {
        "id": "s_93_5",
        "color": "#06b6d4",
        "direction": "down",
        "cells": [
          {
            "x": 9,
            "y": 2
          },
          {
            "x": 9,
            "y": 1
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_93_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 9,
            "y": 5
          },
          {
            "x": 9,
            "y": 4
          },
          {
            "x": 9,
            "y": 3
          }
        ]
      },
      {
        "id": "s_93_7",
        "color": "#14b8a6",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_93_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 9,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_93_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          }
        ]
      },
      {
        "id": "s_93_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 9
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 5,
            "y": 7
          }
        ]
      },
      {
        "id": "s_93_11",
        "color": "#059669",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 8
          },
          {
            "x": 9,
            "y": 9
          },
          {
            "x": 8,
            "y": 9
          },
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 9
          }
        ]
      },
      {
        "id": "s_93_13",
        "color": "#0284c7",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 9
          },
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 2,
            "y": 9
          }
        ]
      }
    ]
  },
  {
    "id": 94,
    "name": "Supernova Coil",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 13,
    "maxMoves": 17,
    "snakes": [
      {
        "id": "s_94_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          }
        ]
      },
      {
        "id": "s_94_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 9,
            "y": 5
          },
          {
            "x": 9,
            "y": 4
          }
        ]
      },
      {
        "id": "s_94_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      },
      {
        "id": "s_94_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          }
        ]
      },
      {
        "id": "s_94_4",
        "color": "#ef4444",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          }
        ]
      },
      {
        "id": "s_94_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_94_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_94_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 7
          },
          {
            "x": 9,
            "y": 6
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          }
        ]
      },
      {
        "id": "s_94_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      },
      {
        "id": "s_94_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 8
          },
          {
            "x": 9,
            "y": 9
          },
          {
            "x": 8,
            "y": 9
          },
          {
            "x": 7,
            "y": 9
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_94_10",
        "color": "#d97706",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_94_11",
        "color": "#059669",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 6,
            "y": 9
          },
          {
            "x": 5,
            "y": 9
          },
          {
            "x": 4,
            "y": 9
          }
        ]
      },
      {
        "id": "s_94_12",
        "color": "#be123c",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 1
          },
          {
            "x": 9,
            "y": 2
          },
          {
            "x": 9,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          }
        ]
      }
    ]
  },
  {
    "id": 95,
    "name": "Infinity Gateway",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 13,
    "maxMoves": 17,
    "snakes": [
      {
        "id": "s_95_0",
        "color": "#0ea5e9",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 9
          },
          {
            "x": 5,
            "y": 9
          },
          {
            "x": 6,
            "y": 9
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 9
          },
          {
            "x": 8,
            "y": 9
          },
          {
            "x": 9,
            "y": 9
          },
          {
            "x": 9,
            "y": 8
          }
        ]
      },
      {
        "id": "s_95_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 9
          }
        ]
      },
      {
        "id": "s_95_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 9,
            "y": 2
          },
          {
            "x": 9,
            "y": 1
          },
          {
            "x": 9,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          }
        ]
      },
      {
        "id": "s_95_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_95_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          }
        ]
      },
      {
        "id": "s_95_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          }
        ]
      },
      {
        "id": "s_95_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 9
          }
        ]
      },
      {
        "id": "s_95_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 3
          },
          {
            "x": 9,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      },
      {
        "id": "s_95_8",
        "color": "#eab308",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 2,
            "y": 9
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_95_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_95_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 6
          },
          {
            "x": 9,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 8
          }
        ]
      },
      {
        "id": "s_95_11",
        "color": "#059669",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          }
        ]
      },
      {
        "id": "s_95_12",
        "color": "#be123c",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 96,
    "name": "Vortex Spine",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 14,
    "maxMoves": 18,
    "snakes": [
      {
        "id": "s_96_0",
        "color": "#0ea5e9",
        "direction": "right",
        "cells": [
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          }
        ]
      },
      {
        "id": "s_96_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          }
        ]
      },
      {
        "id": "s_96_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_96_3",
        "color": "#8b5cf6",
        "direction": "up",
        "cells": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          }
        ]
      },
      {
        "id": "s_96_4",
        "color": "#ef4444",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 9
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 6,
            "y": 9
          },
          {
            "x": 5,
            "y": 9
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          }
        ]
      },
      {
        "id": "s_96_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 9,
            "y": 0
          },
          {
            "x": 9,
            "y": 1
          },
          {
            "x": 9,
            "y": 2
          }
        ]
      },
      {
        "id": "s_96_6",
        "color": "#ec4899",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 9
          }
        ]
      },
      {
        "id": "s_96_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          }
        ]
      },
      {
        "id": "s_96_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          }
        ]
      },
      {
        "id": "s_96_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 3
          },
          {
            "x": 9,
            "y": 4
          },
          {
            "x": 9,
            "y": 5
          },
          {
            "x": 9,
            "y": 6
          },
          {
            "x": 9,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          }
        ]
      },
      {
        "id": "s_96_10",
        "color": "#d97706",
        "direction": "down",
        "cells": [
          {
            "x": 2,
            "y": 9
          },
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 0,
            "y": 9
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      },
      {
        "id": "s_96_11",
        "color": "#059669",
        "direction": "left",
        "cells": [
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_96_12",
        "color": "#be123c",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_96_13",
        "color": "#0284c7",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 97,
    "name": "Celestial Grid",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 14,
    "maxMoves": 18,
    "snakes": [
      {
        "id": "s_97_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      },
      {
        "id": "s_97_1",
        "color": "#10b981",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          }
        ]
      },
      {
        "id": "s_97_2",
        "color": "#f59e0b",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      },
      {
        "id": "s_97_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          }
        ]
      },
      {
        "id": "s_97_4",
        "color": "#ef4444",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 2,
            "y": 9
          },
          {
            "x": 3,
            "y": 9
          },
          {
            "x": 4,
            "y": 9
          },
          {
            "x": 5,
            "y": 9
          }
        ]
      },
      {
        "id": "s_97_5",
        "color": "#06b6d4",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          }
        ]
      },
      {
        "id": "s_97_6",
        "color": "#ec4899",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 9
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 6
          }
        ]
      },
      {
        "id": "s_97_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 1,
            "y": 3
          }
        ]
      },
      {
        "id": "s_97_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 4
          },
          {
            "x": 9,
            "y": 3
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 0
          }
        ]
      },
      {
        "id": "s_97_9",
        "color": "#6366f1",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_97_10",
        "color": "#d97706",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 8
          }
        ]
      },
      {
        "id": "s_97_11",
        "color": "#059669",
        "direction": "up",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          }
        ]
      },
      {
        "id": "s_97_12",
        "color": "#be123c",
        "direction": "down",
        "cells": [
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 9,
            "y": 6
          },
          {
            "x": 9,
            "y": 5
          }
        ]
      },
      {
        "id": "s_97_13",
        "color": "#0284c7",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          }
        ]
      }
    ]
  },
  {
    "id": 98,
    "name": "Mythic Ouroboros",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 14,
    "maxMoves": 18,
    "snakes": [
      {
        "id": "s_98_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 9,
            "y": 7
          },
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 9,
            "y": 6
          },
          {
            "x": 9,
            "y": 5
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 7,
            "y": 5
          }
        ]
      },
      {
        "id": "s_98_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          }
        ]
      },
      {
        "id": "s_98_2",
        "color": "#f59e0b",
        "direction": "left",
        "cells": [
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_98_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 9,
            "y": 0
          },
          {
            "x": 9,
            "y": 1
          },
          {
            "x": 9,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      },
      {
        "id": "s_98_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 0,
            "y": 9
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 2,
            "y": 9
          }
        ]
      },
      {
        "id": "s_98_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 4,
            "y": 3
          }
        ]
      },
      {
        "id": "s_98_6",
        "color": "#ec4899",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 0,
            "y": 7
          }
        ]
      },
      {
        "id": "s_98_7",
        "color": "#14b8a6",
        "direction": "down",
        "cells": [
          {
            "x": 6,
            "y": 9
          },
          {
            "x": 7,
            "y": 9
          },
          {
            "x": 7,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_98_8",
        "color": "#eab308",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          }
        ]
      },
      {
        "id": "s_98_9",
        "color": "#6366f1",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 0
          }
        ]
      },
      {
        "id": "s_98_10",
        "color": "#d97706",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 3
          },
          {
            "x": 9,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 7,
            "y": 4
          },
          {
            "x": 6,
            "y": 4
          }
        ]
      },
      {
        "id": "s_98_11",
        "color": "#059669",
        "direction": "up",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          }
        ]
      },
      {
        "id": "s_98_12",
        "color": "#be123c",
        "direction": "down",
        "cells": [
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          }
        ]
      },
      {
        "id": "s_98_14",
        "color": "#9333ea",
        "direction": "down",
        "cells": [
          {
            "x": 5,
            "y": 9
          },
          {
            "x": 4,
            "y": 9
          },
          {
            "x": 3,
            "y": 9
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      }
    ]
  },
  {
    "id": 99,
    "name": "Dragon Apex",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 15,
    "maxMoves": 19,
    "snakes": [
      {
        "id": "s_99_0",
        "color": "#0ea5e9",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 9
          },
          {
            "x": 2,
            "y": 9
          },
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 1,
            "y": 7
          }
        ]
      },
      {
        "id": "s_99_1",
        "color": "#10b981",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 3,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 1,
            "y": 4
          }
        ]
      },
      {
        "id": "s_99_2",
        "color": "#f59e0b",
        "direction": "up",
        "cells": [
          {
            "x": 8,
            "y": 7
          },
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 9,
            "y": 8
          },
          {
            "x": 9,
            "y": 9
          },
          {
            "x": 8,
            "y": 9
          },
          {
            "x": 7,
            "y": 9
          },
          {
            "x": 6,
            "y": 9
          },
          {
            "x": 5,
            "y": 9
          }
        ]
      },
      {
        "id": "s_99_3",
        "color": "#8b5cf6",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 1
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 9,
            "y": 0
          },
          {
            "x": 9,
            "y": 1
          }
        ]
      },
      {
        "id": "s_99_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          }
        ]
      },
      {
        "id": "s_99_5",
        "color": "#06b6d4",
        "direction": "right",
        "cells": [
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 9,
            "y": 4
          },
          {
            "x": 9,
            "y": 3
          },
          {
            "x": 9,
            "y": 2
          }
        ]
      },
      {
        "id": "s_99_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 0
          },
          {
            "x": 1,
            "y": 0
          },
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 3,
            "y": 0
          },
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      },
      {
        "id": "s_99_7",
        "color": "#14b8a6",
        "direction": "right",
        "cells": [
          {
            "x": 7,
            "y": 5
          },
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 7,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 6,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          }
        ]
      },
      {
        "id": "s_99_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 7
          },
          {
            "x": 9,
            "y": 6
          },
          {
            "x": 9,
            "y": 5
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 6
          }
        ]
      },
      {
        "id": "s_99_9",
        "color": "#6366f1",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 2
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_99_11",
        "color": "#059669",
        "direction": "up",
        "cells": [
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          }
        ]
      },
      {
        "id": "s_99_12",
        "color": "#be123c",
        "direction": "up",
        "cells": [
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          },
          {
            "x": 6,
            "y": 4
          },
          {
            "x": 6,
            "y": 3
          },
          {
            "x": 6,
            "y": 2
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          }
        ]
      },
      {
        "id": "s_99_13",
        "color": "#0284c7",
        "direction": "down",
        "cells": [
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 0,
            "y": 9
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 6
          }
        ]
      },
      {
        "id": "s_99_14",
        "color": "#9333ea",
        "direction": "up",
        "cells": [
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_99_15",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 9
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          }
        ]
      }
    ]
  },
  {
    "id": 100,
    "name": "Master of the 100 Snakes",
    "gridWidth": 10,
    "gridHeight": 10,
    "targetMoves": 14,
    "maxMoves": 18,
    "snakes": [
      {
        "id": "s_100_0",
        "color": "#0ea5e9",
        "direction": "down",
        "cells": [
          {
            "x": 4,
            "y": 0
          },
          {
            "x": 5,
            "y": 0
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          },
          {
            "x": 8,
            "y": 2
          },
          {
            "x": 8,
            "y": 1
          }
        ]
      },
      {
        "id": "s_100_1",
        "color": "#10b981",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 6
          },
          {
            "x": 6,
            "y": 6
          },
          {
            "x": 5,
            "y": 6
          },
          {
            "x": 4,
            "y": 6
          },
          {
            "x": 4,
            "y": 5
          },
          {
            "x": 5,
            "y": 5
          },
          {
            "x": 6,
            "y": 5
          }
        ]
      },
      {
        "id": "s_100_2",
        "color": "#f59e0b",
        "direction": "down",
        "cells": [
          {
            "x": 7,
            "y": 9
          },
          {
            "x": 6,
            "y": 9
          },
          {
            "x": 5,
            "y": 9
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 5,
            "y": 7
          },
          {
            "x": 6,
            "y": 7
          },
          {
            "x": 7,
            "y": 7
          }
        ]
      },
      {
        "id": "s_100_3",
        "color": "#8b5cf6",
        "direction": "left",
        "cells": [
          {
            "x": 9,
            "y": 3
          },
          {
            "x": 9,
            "y": 4
          },
          {
            "x": 8,
            "y": 4
          },
          {
            "x": 8,
            "y": 3
          },
          {
            "x": 7,
            "y": 3
          },
          {
            "x": 7,
            "y": 4
          }
        ]
      },
      {
        "id": "s_100_4",
        "color": "#ef4444",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 9
          },
          {
            "x": 8,
            "y": 9
          },
          {
            "x": 8,
            "y": 8
          },
          {
            "x": 9,
            "y": 8
          },
          {
            "x": 9,
            "y": 7
          }
        ]
      },
      {
        "id": "s_100_5",
        "color": "#06b6d4",
        "direction": "left",
        "cells": [
          {
            "x": 4,
            "y": 3
          },
          {
            "x": 5,
            "y": 3
          },
          {
            "x": 5,
            "y": 4
          },
          {
            "x": 4,
            "y": 4
          },
          {
            "x": 3,
            "y": 4
          }
        ]
      },
      {
        "id": "s_100_6",
        "color": "#ec4899",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 3
          },
          {
            "x": 0,
            "y": 4
          },
          {
            "x": 0,
            "y": 5
          },
          {
            "x": 1,
            "y": 5
          },
          {
            "x": 2,
            "y": 5
          },
          {
            "x": 3,
            "y": 5
          },
          {
            "x": 3,
            "y": 6
          }
        ]
      },
      {
        "id": "s_100_7",
        "color": "#14b8a6",
        "direction": "up",
        "cells": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 3,
            "y": 3
          },
          {
            "x": 2,
            "y": 3
          },
          {
            "x": 2,
            "y": 4
          },
          {
            "x": 1,
            "y": 4
          },
          {
            "x": 1,
            "y": 3
          },
          {
            "x": 1,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 1,
            "y": 0
          }
        ]
      },
      {
        "id": "s_100_8",
        "color": "#eab308",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 2
          },
          {
            "x": 9,
            "y": 1
          },
          {
            "x": 9,
            "y": 0
          },
          {
            "x": 8,
            "y": 0
          },
          {
            "x": 7,
            "y": 0
          },
          {
            "x": 6,
            "y": 0
          }
        ]
      },
      {
        "id": "s_100_9",
        "color": "#6366f1",
        "direction": "right",
        "cells": [
          {
            "x": 9,
            "y": 6
          },
          {
            "x": 9,
            "y": 5
          },
          {
            "x": 8,
            "y": 5
          },
          {
            "x": 8,
            "y": 6
          },
          {
            "x": 8,
            "y": 7
          }
        ]
      },
      {
        "id": "s_100_10",
        "color": "#d97706",
        "direction": "down",
        "cells": [
          {
            "x": 0,
            "y": 6
          },
          {
            "x": 1,
            "y": 6
          },
          {
            "x": 2,
            "y": 6
          },
          {
            "x": 2,
            "y": 7
          },
          {
            "x": 1,
            "y": 7
          },
          {
            "x": 1,
            "y": 8
          }
        ]
      },
      {
        "id": "s_100_11",
        "color": "#059669",
        "direction": "up",
        "cells": [
          {
            "x": 2,
            "y": 0
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          },
          {
            "x": 5,
            "y": 2
          }
        ]
      },
      {
        "id": "s_100_12",
        "color": "#be123c",
        "direction": "left",
        "cells": [
          {
            "x": 3,
            "y": 9
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 3,
            "y": 7
          },
          {
            "x": 4,
            "y": 7
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 4,
            "y": 9
          }
        ]
      },
      {
        "id": "s_100_13",
        "color": "#0284c7",
        "direction": "left",
        "cells": [
          {
            "x": 0,
            "y": 7
          },
          {
            "x": 0,
            "y": 8
          },
          {
            "x": 0,
            "y": 9
          },
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 2,
            "y": 9
          },
          {
            "x": 2,
            "y": 8
          }
        ]
      }
    ]
  }
];

const INFINITY_NAMES = [
  'Aether Rift', 'Quantum Serpent', 'Cosmic Matrix', 'Chronos Knot', 'Nebula Core',
  'Solar Apex', 'Void Slither', 'Astral Vortex', 'Celestial Labyrinth', 'Hyperion Coil',
  'Starlight Weave', 'Genesis Knot', 'Omega Serpent', 'Prismatic Nexus', 'Infinity Spiral',
  'Ethereal Maze', 'Supernova Loop', 'Titan Coil', 'Zenith Helix', 'Eternity Gate'
];

/**
 * Super-fast instantaneous O(1) level name lookup without generating puzzle data.
 */
export function getLevelName(levelNum: number): string {
  if (levelNum >= 1 && levelNum <= LEVELS.length) {
    return LEVELS[levelNum - 1]?.name || `Level ${levelNum}`;
  }
  const index = Math.max(0, levelNum - 1);
  const nameTheme = INFINITY_NAMES[index % INFINITY_NAMES.length];
  const cycle = Math.floor(index / INFINITY_NAMES.length) + 1;
  const isMasterInfinity = levelNum > 1000;
  return isMasterInfinity 
    ? `Infinity Master: ${nameTheme} #${levelNum - 1000}`
    : cycle > 1 ? `${nameTheme} ${cycle}` : nameTheme;
}

export function generateProceduralLevel(levelNum: number): LevelConfig {
  const name = getLevelName(levelNum);
  return generateGuaranteedLevel(levelNum, name);
}

// O(1) Instantaneous Level Lookup Map for zero delay level progression
export const LEVEL_MAP: Map<number, LevelConfig> = new Map(
  LEVELS.map((lvl) => [lvl.id, lvl])
);

export function getLevelConfig(levelId: number, isEndless: boolean = false): LevelConfig {
  return generateProceduralLevel(levelId);
}
