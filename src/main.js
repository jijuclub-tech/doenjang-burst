import Phaser from 'phaser';
import { Boot } from './scenes/Boot.js';
import { Battle } from './scenes/Battle.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#8ecaf2',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 430,
    height: 860
  },
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  scene: [Boot, Battle]
});

export default game;
