import {cp,rm} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const src=path.join(root,'site');
const out=path.join(root,'dist');
await rm(out,{recursive:true,force:true});
await cp(src,out,{recursive:true});
console.log('Built dist/');
