import fs from 'node:fs';
for (const target of ['dist', '.build']) fs.rmSync(target, { recursive: true, force: true });
