import fs from 'node:fs';
for (const target of ['dist', '.build', 'qa-screens', 'visual-report']) {
  fs.rmSync(target, { recursive: true, force: true });
}
