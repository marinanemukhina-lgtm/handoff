const $=id=>document.getElementById(id);
const lines=id=>$(id).value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
const pair=(line)=>{const [a,b]=line.split('|').map(x=>x.trim());return [a,b];};
let current=null;
const exportButtons = ['json', 'md', 'copy'].map($);
function clearPackage() {
  current = null;
  for (const button of exportButtons) button.disabled = true;
  $('preview').textContent = 'Nothing generated yet.';
}
function formChanged() {
  if (!current) return;
  clearPackage();
  $('status').textContent = 'Form changed. Generate the updated handoff to export it.';
}
$('handoff').addEventListener('input', formChanged);
$('handoff').addEventListener('change', formChanged);
function download(filename,content,type){
  const url=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$('handoff').addEventListener('submit',e=>{
  e.preventDefault();
  clearPackage();
  const decisions=lines('decisions').map((s,i)=>{const [statement,source]=pair(s);return {id:'D'+(i+1),status:'approved',statement,source};});
  if(decisions.some(d=>!d.statement||!d.source)){$('status').textContent='Each approved decision needs a statement and a source, separated by |.';return;}
  const commitments=lines('commitments').map((s,i)=>{const [statement,owner,status]=s.split('|').map(x=>x.trim());return {id:'C'+(i+1),statement,owner,status:status||'unverified'};});
  if(commitments.some(c=>!c.statement||!c.owner)){$('status').textContent='Each commitment needs a statement and an owner, separated by |.';return;}
  const p={version:'0.3',mode:$('mode').value,project:$('project').value.trim(),snapshot:new Date().toISOString().slice(0,10),intent:$('intent').value.trim(),state:$('state').value.trim(),decisions,commitments,permissions:{allowed:lines('allowed'),requires_approval:lines('approval')},next:{action:$('next').value.trim(),acceptance:$('acceptance').value.trim()}};
  if(!p.project||!p.intent||!p.state||!p.next.action||!p.next.acceptance){$('status').textContent='Complete the required fields.';return;}
  const raw=JSON.stringify(p);
  if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b|\bsk-proj-[A-Za-z0-9_-]{20,}\b/.test(raw)){$('status').textContent='Possible credential detected. Remove it before generating.';return;}
  current = { p, md: renderHandoff(p) };
  $('preview').textContent=current.md;
  $('status').textContent='Generated locally. Review content before sharing; sources are not verified.';
  for (const button of exportButtons) button.disabled = false;
});
$('json').addEventListener('click',()=>{if(current)download('handoff.json',JSON.stringify(current.p,null,2)+'\n','application/json');});
$('md').addEventListener('click',()=>{if(current)download('HANDOFF.md',current.md,'text/markdown');});
$('copy').addEventListener('click', async () => {
  const selected = current;
  if (!selected) return;
  try {
    await navigator.clipboard.writeText(selected.md);
    if (current === selected) $('status').textContent = 'Copied to clipboard.';
  } catch {
    if (current === selected) $('status').textContent = 'Clipboard unavailable. Select the preview text to copy.';
  }
});
$('load').addEventListener('click',()=>{
  clearPackage();
  const data={project:'Example brochure site (fictional)',intent:'Finish approved site without redesign',state:'Demo only; no sources independently checked.',decisions:'Keep approved layout | fictional example',commitments:'Deliver preview | project owner | open',allowed:'Read files\nRun local tests',approval:'Publish\nChange budget\nChange scope\nDelete files',next:'Run existing build',acceptance:'Build exits successfully and evidence is recorded'};
  for(const [key,val] of Object.entries(data))$(key).value=val;
  $('status').textContent='Example loaded. Select Generate handoff.';
});
