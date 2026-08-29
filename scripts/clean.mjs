import fs from 'node:fs';
for (const path of ['dist','.build','qa-screens','visual-report']) fs.rmSync(path,{recursive:true,force:true});
