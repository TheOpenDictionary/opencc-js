import { describe, it, expect } from 'vitest';
import { Converter } from '../src/full';

describe('OpenCC Converter', () => {
  it('converts simplified Chinese to traditional Chinese', () => {
    const converter = Converter({ from: 'cn', to: 'tw' });
    expect(converter('汉字')).toBe('漢字');
    expect(converter('我们在吃方便面。')).toBe('我們在吃方便麵。');
  });

  it('converts traditional Chinese to simplified Chinese', () => {
    const converter = Converter({ from: 'tw', to: 'cn' });
    expect(converter('漢字')).toBe('汉字');
    expect(converter('我們在吃方便麵。')).toBe('我们在吃方便面。');
  });
});