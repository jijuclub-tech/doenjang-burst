export class Boot extends Phaser.Scene {
  constructor() { super('boot'); }
  create() {
    this.add.text(215, 70, '하늘 섬', { fontFamily: 'sans-serif', fontSize: '34px', color: '#1b2430', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(215, 114, '마당 크기를 고르면 그 판으로 들어간다', { fontFamily: 'sans-serif', fontSize: '18px', color: '#3d2a1a' }).setOrigin(0.5);
    const maps = [
      { key: 'small', title: '작은 마당', sub: '집 하나. 둘이 가깝다' },
      { key: 'large', title: '큰 마당', sub: '집 하나. 뛰는 거리가 길다' },
      { key: 'village', title: '마을 섬', sub: '집마다 참가자가 나온다' }
    ];
    maps.forEach((m, i) => {
      const y = 220 + i * 150;
      const box = this.add.rectangle(215, y, 340, 120, 0xffffff, 0.9).setInteractive();
      this.add.text(215, y - 18, m.title, { fontFamily: 'sans-serif', fontSize: '28px', color: '#1b2430', fontStyle: 'bold' }).setOrigin(0.5);
      this.add.text(215, y + 22, m.sub, { fontFamily: 'sans-serif', fontSize: '18px', color: '#6a4528' }).setOrigin(0.5);
      box.on('pointerdown', () => this.scene.start('battle', { map: m.key }));
    });
  }
}
