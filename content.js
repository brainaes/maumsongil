(() => {
 const api='https://aiyunseul.com/maumsongil/index.php';
 const media=matchMedia('(max-width: 768px)');
 const originals=new Map();
 function apply(data){
  const selected=data[media.matches?'mobile':'desktop']||{}, common=data.common||{};
  const value=key=>selected[key]||common[key];
  for(const element of document.querySelectorAll('[data-cms-text]')){
   const keys=element.dataset.cmsText.split(',');
   const nodes=[...element.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim());
   nodes.forEach((node,i)=>{
    if(!originals.has(node))originals.set(node,node.textContent);
    const original=originals.get(node), replacement=value(keys[i]);
    node.textContent=typeof replacement==='string'?original.replace(/\S[\s\S]*?\s*$/,match=>replacement+(match.match(/\s*$/)?.[0]||'')):original;
   });
  }
  for(const element of document.querySelectorAll('[data-cms-image]')){
   if(!originals.has(element))originals.set(element,{src:element.getAttribute('src'),poster:element.getAttribute('poster')});
   const original=originals.get(element), id=value(element.dataset.cmsImage);
   const image=typeof id==='string'&&/^[a-f0-9]{64}$/.test(id)?api+'?action=landing-media&id='+id:null;
   if(element.tagName==='VIDEO'){
    if(image){
     if(!original.replacement){
      original.replacement=document.createElement('img');
      original.replacement.alt=element.getAttribute('aria-label')||'';
      element.after(original.replacement);element.style.display='none';element.pause();element.removeAttribute('src');element.load();
     }
     original.replacement.src=image;
    }else if(original.replacement){
     original.replacement.remove();original.replacement=null;element.style.removeProperty('display');element.src=original.src;element.load();element.play().catch(()=>{});
    }
   }else{
    element.src=image||original.src;
    if(original.src==='assets/maumsongil-flow-v2.png'){
     if(image)document.documentElement.style.setProperty('--landing-flow-image','url("'+image+'")');
     else document.documentElement.style.removeProperty('--landing-flow-image');
    }
   }
  }
 }
 fetch(api+'?action=landing-public',{credentials:'omit'}).then(response=>response.ok?response.json():null).then(result=>{
  if(!result?.content)return;
  apply(result.content);media.addEventListener('change',()=>apply(result.content));
 }).catch(()=>{});
})();
