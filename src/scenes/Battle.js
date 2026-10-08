const FONT = 'sans-serif';

function iso(x, y) {
  return { x: 215 + (x - y) * 28, y: 250 + (x + y) * 16 };
}

export class Battle extends Phaser.Scene {
  constructor() { super('battle'); }

  create(data) {
    this.mapKey = data.map || 'small';
    this.add.rectangle(215, 430, 430, 860, 0x8ecaf2);
    this.add.ellipse(215, 150, 220, 46, 0xffffff, 0.85);
    this.add.text(215, 28, this.title(), { fontFamily: FONT, fontSize: '26px', color: '#1b2430', fontStyle: 'bold' }).setOrigin(0.5);
    this.log = this.add.text(215, 70, '칸을 눌러 이동', { fontFamily: FONT, fontSize: '18px', color: '#1b2430' }).setOrigin(0.5);

    this.tiles = [];
    this.houses = [];
    const size = this.mapKey === 'small' ? 3 : this.mapKey === 'large' ? 5 : 4;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const p = iso(x - (size - 1) / 2, y - (size - 1) / 2);
        const tile = this.add.polygon(p.x, p.y + 150, [0, -16, 28, 0, 0, 16, -28, 0], (x + y) % 2 ? 0xd7f0c8 : 0xc5e4b4);
        tile.setStrokeStyle(2, 0x6d8f62);
        tile.setInteractive(new Phaser.Geom.Polygon([0, -16, 28, 0, 0, 16, -28, 0]), Phaser.Geom.Polygon.Contains);
        tile.on('pointerdown', () => this.moveMe(x, y));
        this.tiles.push({ x, y, tile });
      }
    }
    if (this.mapKey === 'village') this.placeHouses(size);
    else this.placeYard(size);

    this.me = this.actor(1, 1, 0xe07a3d, '돌쇠');
    this.others = this.mapKey === 'village'
      ? this.houses.map((h, i) => this.actor(h.x, h.y, 0x7a4ea3, '집' + (i + 1)))
      : [this.actor(size - 2, size - 2, 0x7a4ea3, '갑순')];
    this.sync();

    this.makeButton(80, 800, '던지기', () => this.log.setText('가까운 칸의 상대에게 던진다'));
    this.makeButton(215, 800, '화장실', () => this.log.setText('내 집 칸에서만 화장실'));
    this.makeButton(350, 800, '맵 변경', () => this.scene.start('boot'));
  }

  title() {
    if (this.mapKey === 'small') return '떠 있는 작은 마당';
    if (this.mapKey === 'large') return '떠 있는 큰 마당';
    return '하늘에 떠 있는 마을 섬';
  }

  placeYard(size) {
    const home = iso(-0.2, -0.2);
    this.add.rectangle(home.x - 40, home.y + 110, 36, 28, 0x8a5a32).setDepth(2);
    this.add.text(home.x - 40, home.y + 78, '변기', { fontFamily: FONT, fontSize: '16px', color: '#1b2430' }).setOrigin(0.5).setDepth(2);
  }

  placeHouses(size) {
    const spots = [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]];
    spots.forEach((s, i) => {
      const p = iso(s[0] - (size - 1) / 2, s[1] - (size - 1) / 2);
      const house = this.add.rectangle(p.x, p.y + 128, 34, 30, 0xc4552a).setDepth(3);
      this.add.triangle(p.x, p.y + 104, 0, 16, 22, 0, 44, 16, 0x6b2a16).setDepth(3);
      this.add.text(p.x, p.y + 96, '집' + (i + 1), { fontFamily: FONT, fontSize: '16px', color: '#1b2430' }).setOrigin(0.5).setDepth(4);
      this.houses.push({ x: s[0], y: s[1], house });
    });
    this.log.setText('집마다 참가자가 나왔다');
  }

  actor(x, y, color, name) {
    const p = this.pos(x, y);
    const body = this.add.circle(p.x, p.y, 14, color).setDepth(5);
    const label = this.add.text(p.x, p.y - 28, name, { fontFamily: FONT, fontSize: '16px', color: '#1b2430' }).setOrigin(0.5).setDepth(6);
    return { x, y, body, label, name };
  }

  pos(x, y) {
    const size = this.mapKey === 'small' ? 3 : this.mapKey === 'large' ? 5 : 4;
    return iso(x - (size - 1) / 2, y - (size - 1) / 2);
  }

  moveMe(x, y) {
    const dist = Math.abs(this.me.x - x) + Math.abs(this.me.y - y);
    if (dist !== 1) { this.log.setText('옆 칸만 이동'); return; }
    this.me.x = x; this.me.y = y;
    this.sync();
    this.log.setText('돌쇠 ' + (x + 1) + ',' + (y + 1) + ' 칸');
  }

  sync() {
    const put = (a) => {
      const p = this.pos(a.x, a.y);
      a.body.setPosition(p.x, p.y + 150);
      a.label.setPosition(p.x, p.y + 122);
    };
    put(this.me);
    this.others.forEach(put);
  }

  makeButton(x, y, text, fn) {
    const b = this.add.rectangle(x, y, 110, 52, 0x1b2430).setInteractive();
    this.add.text(x, y, text, { fontFamily: FONT, fontSize: '18px', color: '#ffffff' }).setOrigin(0.5);
    b.on('pointerdown', fn);
  }
}
