# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript video application built with Vite, using Mantine UI components for precise video seeking functionality. The project uses pnpm as the package manager and Biome for linting and formatting.

## Key Commands

### Development
- `pnpm dev` - Start the development server with hot module replacement
- `pnpm preview` - Preview the production build locally

### Build
- `pnpm build` - Type-check with TypeScript and build for production

### Code Quality
- `pnpm check` - Run Biome linter and formatter with auto-fix enabled
- The project uses Biome instead of ESLint/Prettier for code quality

### Package Management
- This project enforces pnpm usage (configured via preinstall script)
- Use `pnpm install` to install dependencies
- Use `pnpm add <package>` to add new dependencies

## Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **UI Library**: Mantine v8
- **Code Quality**: Biome for linting and formatting
- **CSS Processing**: PostCSS with Mantine presets

### Project Structure
- `/src` - Main application source code
  - `main.tsx` - Application entry point with MantineProvider setup
  - `App.tsx` - Root component
- Configuration files in root:
  - `vite.config.ts` - Vite configuration
  - `biome.json` - Code formatting and linting rules
  - `tsconfig.app.json` - TypeScript configuration for application code

### TypeScript Configuration
- Strict mode enabled with additional safety checks
- Target ES2022 with bundler module resolution
- React JSX transform configured
- Build info cached in `node_modules/.tmp/`

### Code Style Guidelines
- Line width: 120 characters
- Indent style: Spaces (2 spaces)
- Biome rules enforce consistent code style
- Import organization handled automatically by Biome