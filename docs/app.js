const $=id=>document.getElementById(id);
const lines=id=>$(id).value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
const pair=(line)=>{const [a,b]=line.split('|').map(x=>x.trim());return [a,b];};
let current=null;
function markdown(p,mode){
  const rows=(p.decisions||[]).map(d=>'- '+d.statement+' (source: '+d.source+')').join('\n')||'None recorded';
  const obligations=(p.commitments||[]).map(c=>'- '+c.id+': '+c.status+'; owner: '+c.owner).join('\n')||'None recorded';
  const sections=['# HANDOFF — '+p.project,'Snapshot: '+p.snapshot,'## Intent\n'+p.intent,'## State (verify independently)\n'+p.state,'## Approved decisions\n'+rows,'## Commitments\n'+obligations,'## Permissions\nAllowed: '+p.permissions.allowed.join(', ')+'\nApproval required: '+p.permissions.requires_approval.join(', '),'## Next action\n'+p.next.action+'\nAcceptance: '+p.next.acceptance,'## Receiver checklist\n- [ ] Verify sources and freshness\n- [ ] Restate intent, decisions and obligations\n- [ ] Confirm authority before consequential actions\n- [ ] Return evidence and unresolved items','## Mode\nCONTINUE by default. REVIEW and OPEN_FIELD are opt-in analysis only. No mode grants authority.'];
  if(mode==='review')sections.push('## Optional review — no execution\nAssess future costs, penalties, commitments and expected benefits. No plan change without approval.');
  if(mode==='open-field')sections.push('## Optional open field — no execution\nExplore alternative frames and reconsideration conditions without changing commitments.');
  return sections.join('\n\n')+'\n';
}
function download(filename,content,type){
  const url=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$('handoff').addEventListener('submit',e=>{
  e.preventDefault();
  const decisions=lines('decisions').map((s,i)=>{const [statement,source]=pair(s);return {id:'D'+(i+1),status:'approved',statement,source:source||'Unverified — confirm source'};});
  const commitments=lines('commitments').map((s,i)=>{const [statement,owner,status]=s.split('|').map(x=>x.trim());return {id:'C'+(i+1),statement,owner:owner||'Unassigned',status:status||'unverified'};});
  const p={version:'0.3',project:$('project').value.trim(),snapshot:new Date().toISOString().slice(0,10),intent:$('intent').value.trim(),state:$('state').value.trim(),decisions,commitments,permissions:{allowed:lines('allowed'),requires_approval:lines('approval')},next:{action:$('next').value.trim(),acceptance:$('acceptance').value.trim()}};
  if(!p.project||!p.intent||!p.state||!p.next.action||!p.next.acceptance){$('status').textContent='Complete the required fields.';return;}
  current={p,mode:$('mode').value,md:markdown(p,$('mode').value)};
  $('preview').textContent=current.md;
  $('status').textContent='Generated locally. Review content before sharing; sources are not verified.';
  for(const id of ['json','md','copy'])$(id).disabled=false;
});
$('json').addEventListener('click',()=>{if(current)download('handoff.json',JSON.stringify(current.p,null,2)+'\n','application/json');});
$('md').addEventListener('click',()=>{if(current)download('HANDOFF.md',current.md,'text/markdown');});
$('copy').addEventListener('click',async()=>{if(!current)return;try{await navigator.clipboard.writeText(current.md);$('status').textContent='Copied to clipboard.';}catch{$('status').textContent='Clipboard unavailable. Select the preview text to copy.';}});
$('load').addEventListener('click',()=>{
  const data={project:'Example brochure site (fictional)',intent:'Finish approved site without redesign',state:'Demo only; no sources independently checked.',decisions:'Keep approved layout | fictional example',commitments:'Deliver preview | project owner | open',allowed:'Read files\nRun local tests',approval:'Publish\nChange budget\nChange scope\nDelete files',next:'Run existing build',acceptance:'Build exits successfully and evidence is recorded'};
  for(const [key,val] of Object.entries(data))$(key).value=val;
  $('status').textContent='Example loaded. Select Generate handoff.';
});
