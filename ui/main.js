// SPDX-License-Identifier: GPL-3.0-or-later
import {request, service} from './bridge.js';
import {ModController} from '../src/controller.js';
const mod=new ModController(service),content=document.querySelector('#content'),message=document.querySelector('#message'),enabled=document.querySelector('#enabled');
let running=false;
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
async function perform(fn){if(running)return;running=true;document.querySelectorAll('button,input,select').forEach(e=>e.disabled=true);message.textContent='Working…';try{const result=await fn();message.textContent=result?.message||'Done.';}catch(e){message.textContent=e.message;}finally{running=false;await refresh();}}
function button(parent,text,op,value=null,disabled=false){const b=el('button',text);b.disabled=disabled;b.onclick=()=>perform(()=>mod.action(op,value));parent.append(b);}
function section(title,text){const s=el('section');s.append(el('h2',title),el('p',text));content.append(s);return s;}
function render(s){enabled.checked=s.enabled;enabled.disabled=running;content.replaceChildren();const off=!s.enabled||running;
 const local=section('Local save backups',`${s.saves.serial} · ${s.saves.slots.length} save slots · ${s.saves.backups.length} backups`);
 const note=el('input');note.placeholder='Backup note (optional)';note.maxLength=160;note.disabled=off;note.setAttribute('aria-label','Backup note');local.append(note);
 const create=el('button','Create backup');create.disabled=off;create.onclick=()=>perform(()=>mod.action('backup.create',{note:note.value}));local.append(create);
 for(const backup of s.saves.backups){const row=el('div');row.append(el('span',`${backup.note||backup.name} · ${Math.round(backup.totalSize/1024)} KB `));button(row,'Restore…','backup.restore',{name:backup.name},off);local.append(row);}
 const cloud=section('Cloud folder sync',s.config.folder||'No folder selected. Choose a folder already synchronized by your cloud app, Syncthing or NAS. This mod does not sign into a provider or enable iCloud.');
 cloud.append(el('p',`State: ${s.cloud.state}${s.cloud.conflict?' · Conflict: choose which copy to keep. A protective backup is taken before restore.':''}`));
 button(cloud,'Choose folder…','cloud.choose',null,off);button(cloud,'Disconnect folder','cloud.disconnect',null,off||!s.config.folder);
 button(cloud,'Sync safely','cloud.sync',{strategy:'auto'},off||!s.config.folder);
 if(s.cloud.conflict){button(cloud,'Use local saves…','cloud.sync',{strategy:'use-local'},off);button(cloud,'Use cloud saves…','cloud.sync',{strategy:'use-cloud'},off);}
 section('Independent module','Turning this mod off disables its automatic save synchronization for all games. Your saves and existing backups stay in place. No graphics mod is needed.');
}
async function refresh(){try{render(await mod.status());}catch(e){message.textContent=e.message;}}
enabled.onchange=()=>perform(()=>mod.enable(enabled.checked));
try{const info=await request('info');if(!info.services?.includes('save-backup-sync'))throw new Error('This launcher does not provide the save service. Install fork launcher 1.0.5 or newer.');document.querySelector('#subtitle').textContent=`${info.game} / ${info.version} · Mod 0.1.0 · No graphics dependency`;await refresh();}catch(e){message.textContent=e.message;}
