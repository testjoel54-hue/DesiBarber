import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,stat} from 'node:fs/promises';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const site=path.join(root,'site');
const port=Number(process.env.PORT||5173);
const host='0.0.0.0';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self' https://api.web3forms.com; form-action 'self' https://api.web3forms.com; frame-ancestors 'none'; base-uri 'self'";
const server=http.createServer(async(req,res)=>{
  res.setHeader('Content-Security-Policy',csp);
  res.setHeader('X-Content-Type-Options','nosniff');
  const u=new URL(req.url,'http://local');
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end('Method not allowed');return;}
  let p=decodeURIComponent(u.pathname);
  if(p==='/' )p='/index.html';
  if(p.endsWith('/'))p+='index.html';
  let f=path.resolve(site,'.'+p);
  if(!f.startsWith(site)){res.writeHead(403);res.end('Forbidden');return;}
  let s=await stat(f).catch(()=>null);
  if(!s&&!path.extname(f))f+='.html';
  try{const data=await readFile(f);res.statusCode=200;res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(req.method==='HEAD'?undefined:data);}catch{res.statusCode=404;res.end('Not found');}
});
server.listen(port,host,()=>{
  console.log('\nDESI BARBER / PREMIUM WEBSITE\n');
  console.log(`Home:    http://localhost:${port}/`);
  console.log(`Booking: http://localhost:${port}/book/`);
  for(const [name,entries] of Object.entries(os.networkInterfaces())) for(const e of entries||[]) if((e.family==='IPv4'||e.family===4)&&!e.internal&&!e.address.startsWith('169.254.')) console.log(`Network: http://${e.address}:${port}/  (${name})`);
  console.log('\nCtrl+C to stop.\n');
});
