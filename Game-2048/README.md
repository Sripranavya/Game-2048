# 2048 Game

A clean, responsive implementation of the classic 2048 puzzle game. Built from scratch using vanilla HTML, CSS, and JavaScript.

## What is 2048?

Slide numbered tiles around a 4x4 grid to combine matching numbers. When two tiles with the same number touch, they merge into one tile with double the value. Keep combining tiles until you reach 2048 to win!

## Getting Started

Just download the files and open `index.html` in your browser - that's it! No build process or dependencies needed.

## Controls

- **Desktop**: Use arrow keys to move tiles up, down, left, or right
- **Mobile**: Swipe in any direction to move tiles
- **New Game**: Click the "New Game" button to restart anytime

## Game Rules

- Start with two random tiles (2 or 4) on the board
- Use arrow keys or swipes to slide all tiles in one direction
- When two tiles with the same number collide, they merge into one
- After each move, a new tile appears in an empty spot
- Your score increases by the value of merged tiles
- Win by creating a 2048 tile, or lose when no moves are possible

## Features

- **Fully responsive** - works great on phones, tablets, and desktop
- **Touch controls** - swipe gestures for mobile devices
- **Smooth animations** - polished tile movements and effects
- **Beautiful design** - modern purple and pink color scheme
- **Accessibility** - reduced motion and high contrast support

## Technical Notes

The game uses CSS Grid for the board layout and vanilla JavaScript for all game logic. Tile movements are handled through matrix transformations, and the responsive design adapts to any screen size using CSS custom properties.

Enjoy playing!
