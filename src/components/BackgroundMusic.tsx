import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

/**
 * Headless component: it wires up the background-music behaviour and renders
 * nothing, so it can never cause a layout shift. Mount it once near the app root.
 */
export default function BackgroundMusic() {
  useBackgroundMusic();
  return null;
}
