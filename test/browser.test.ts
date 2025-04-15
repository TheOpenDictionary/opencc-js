import { describe, it, expect } from 'vitest';
import { Converter, HTMLConverter } from '../src/full';

describe('OpenCC Browser Compatibility', () => {
  it('converts simplified Chinese to traditional Chinese in browser', () => {
    const converter = Converter({ from: 'cn', to: 'tw' });
    expect(converter('汉字')).toBe('漢字');
    expect(converter('我们在吃方便面。')).toBe('我們在吃方便麵。');
  });

  // Test basic HTML conversion functionality
  it('converts simplified Chinese to traditional Chinese in HTML', () => {
    // Create a mock DOM environment
    document.body.innerHTML = '<div id="test" lang="zh-CN">汉字 - 我们在吃方便面。</div>';

    const converter = Converter({ from: 'cn', to: 'tw' });
    const rootNode = document.getElementById('test') as HTMLElement;
    const htmlConverter = HTMLConverter(converter, rootNode, 'zh-CN', 'zh-TW');

    // Convert the content
    htmlConverter.convert();

    // Check if conversion worked
    expect(rootNode.innerHTML).toBe('漢字 - 我們在吃方便麵。');
    expect(rootNode.lang).toBe('zh-TW');

    // Restore the content
    htmlConverter.restore();

    // Check if restoration worked
    expect(rootNode.innerHTML).toBe('汉字 - 我们在吃方便面。');
    expect(rootNode.lang).toBe('zh-CN');
  });

  it('handles complex HTML content with nested elements', () => {
    // Set up a more complex HTML document
    document.body.innerHTML = `
      <div lang="zh-CN">
        <h1>汉字转换测试</h1>
        <p>我们在吃<strong>方便面</strong>。</p>
        <ul>
          <li>简体字</li>
          <li>繁体字转换</li>
        </ul>
      </div>
    `;

    const converter = Converter({ from: 'cn', to: 'tw' });
    const htmlConverter = HTMLConverter(converter, document.body, 'zh-CN', 'zh-TW');

    // Convert the content
    htmlConverter.convert();

    // Check the converted content
    expect(document.body.innerHTML).toContain('漢字轉換測試');
    expect(document.body.innerHTML).toContain('我們在吃<strong>方便麵</strong>');
    expect(document.body.innerHTML).toContain('簡體字');
    expect(document.body.innerHTML).toContain('繁體字轉換');
    expect(document.body.querySelector('div')?.lang).toBe('zh-TW');

    // Restore the original content
    htmlConverter.restore();

    // Verify restoration works
    expect(document.body.innerHTML).toContain('汉字转换测试');
    expect(document.body.innerHTML).toContain('方便面');
    expect(document.body.querySelector('div')?.lang).toBe('zh-CN');
  });
});