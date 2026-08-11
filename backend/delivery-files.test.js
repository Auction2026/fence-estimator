const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

describe('final delivery structure', () => {
  test('frontend includes 17 tab modules', () => {
    const tabsDir = path.join(root, 'js', 'tabs');
    const files = fs.readdirSync(tabsDir).filter((f) => /^tab\d+-.+\.js$/.test(f));
    expect(files).toHaveLength(17);
  });

  test('database scripts and docs exist', () => {
    const required = [
      'database/schema.sql',
      'database/seed.sql',
      'PART_4_IMPLEMENTATION_MENU.md',
      'PART_5_TROUBLESHOOTING_GUIDE.md',
      'README.md',
      'API_DOCUMENTATION.md',
      'DATABASE_SCHEMA.md'
    ];

    required.forEach((item) => {
      expect(fs.existsSync(path.join(root, item))).toBe(true);
    });
  });
});
