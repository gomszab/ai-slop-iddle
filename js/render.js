// render.js — minden DOM-ba író / kirajzoló függvény (renderX). Nincs benne mutáció, csak megjelenítés.

function renderHud(){
  els.hudMoney.textContent=fmt(state.money);
  els.hudTokens.textContent=fmt(totalBiomeTokens());
  els.hudEggs.textContent=state.turtles.filter(t=>t.stage==='egg').length;
  els.hudTurtles.textContent=state.turtles.filter(t=>t.stage!=='egg').length;
  els.hudRare.textContent=state.turtles.filter(t=>['rare','legendary'].includes(t.rarity)).length;
  els.hudBiome.textContent=activeBiome()?.name||'-';
}
function rarityBadge(r){ return `<span class="badge" style="background:${RARITIES[r].color};color:${r==='legendary'?'#3f2d00':'#fff'}">${RARITIES[r].label}</span>`; }
function speciesHue(speciesId){ const hueMap={mohateknos:92,lagunateknos:170,napteknos:28,ambrateknos:345,csillagteknos:245,kristalyteknos:190,vulkanteknos:320,holdteknos:215}; return hueMap[speciesId] ?? 100; }
function turtleVisual(speciesId, rarity='common', stage='young'){ const rarityBg={common:['#edf6ec','#d6ead3'],uncommon:['#e6f6f8','#cbe9ef'],rare:['#efe9fb','#d9cff6'],legendary:['#fff5d9','#f6df9d']}; const speciesMap={mohateknos:['#4f8f53','#2f6b35'],lagunateknos:['#46a8bf','#207086'],napteknos:['#d8ad38','#9a7015'],ambrateknos:['#d56c43','#96361f'],csillagteknos:['#8f77df','#5a42aa'],kristalyteknos:['#7bc7da','#3f8fa4'],vulkanteknos:['#c95d47','#7f291d'],holdteknos:['#8d9bc7','#58648d']}; const colors=speciesMap[speciesId]||['#5a9960','#366b3e']; const bg=rarityBg[rarity]||rarityBg.common; const emoji = stage==='egg' ? '🥚' : '🐢'; return {emoji,tintA:colors[0],tintB:colors[1],bgA:bg[0],bgB:bg[1]}; }
function renderBoardStore(){
  const unlocked=state.storeUnlockedSpecies;
  els.boardStoreSpecies.innerHTML='';
  if(!unlocked.length){
    const box=document.createElement('div'); box.className='store-egg-card'; box.innerHTML='<strong>Még nincs store faj feloldva</strong><div class="muted">Szerezz 200 pénzt az első faj unlockhoz.</div>'; els.boardStoreSpecies.appendChild(box); return;
  }
  unlocked.forEach(id=>{
    const s=speciesById(id);
    const card=document.createElement('div'); card.className='store-egg-card';
    card.innerHTML=`<div style="display:flex;justify-content:space-between;gap:8px"><strong>${s.name}</strong><span>${s.emoji}</span></div><div class="muted">Tojásként kerül a boardra.</div><div class="price-line"><span class="token">${fmt(s.eggPrice)} pénz</span><button class="btn" ${state.money<s.eggPrice?'disabled':''}>Vásárlás</button></div>`;
    card.querySelector('button').addEventListener('click',()=>buyEgg(id));
    els.boardStoreSpecies.appendChild(card);
  });
}
function renderBoard(){
  renderBoardStore();
  els.boardGrid.innerHTML='';
  if(!state.turtles.length){
    els.boardGrid.innerHTML='<div class="empty-state"><div><h3 style="font-family:var(--font-display);font-size:2rem">Üres a board</h3><p class="muted">Az első teknősöket vadászattal vagy később store tojásokkal szerzed meg.</p></div></div>';
    return;
  }
  state.turtles.forEach(t=>{
    const s=speciesById(t.speciesId); const clicksNeeded=stageClicksNeeded(t.stage); const pct=Math.min(100,(t.progress/clicksNeeded)*100); const sellValue=turtleValue(t); const selected=state.selectedTurtles.includes(t.uid);
    const card=document.createElement('article'); card.className=`card ${selected?'selected':''}`;
    const visual=turtleVisual(t.speciesId,t.rarity,t.stage);
    const selectLabel=selected?'Kijelölve':'Kijelölés';
    card.innerHTML=`
      <div class="card-top">
        <div class="meta"><div class="name">${s.name}</div><div class="sub">${t.source==='hunt'?'Vadászott':t.source==='store'?'Store tojás':'Tenyésztett'}</div></div>
        ${rarityBadge(t.rarity)}
      </div>
      <div class="turtle-art" style="--art-sky:${visual.bgA};--art-ground:${visual.bgB}"><div class="turtle-glyph"><span class="turtle-emoji" style="filter:hue-rotate(${speciesHue(t.speciesId)}deg) saturate(1.45) brightness(1.02);">${visual.emoji}</span></div></div>
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span class="badge stage">${STAGE_LABEL[t.stage]}</span><strong>${sellValue>0?fmt(sellValue)+' pénz':'nem eladható'}</strong></div>
      <div class="progress"><div class="bar" style="width:${pct}%"></div></div>
      <div class="card-icon-actions">
        <button class="icon-btn primary" data-action="grow" aria-label="Növesztés" title="Növesztés"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button>
        <button class="icon-btn" data-action="select" aria-label="${selectLabel}" title="${selectLabel}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg></button>
        <button class="icon-btn" data-action="sell" aria-label="Eladás" title="Eladás" ${sellValue<=0?'disabled':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></button>
        <button class="icon-btn" data-action="breed" aria-label="Párosítás" title="Párosítás" ${t.stage!=='adult'?'disabled':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-6.5-4.3-9-8.3C1 9 2.7 5.5 6.4 5.5c2 0 3 .9 4 2.1 1-1.2 2-2.1 4-2.1 3.7 0 5.4 3.5 3.4 7.2-2.5 4-9 8.3-9 8.3Z"/></svg></button>
      </div>
      <div class="card-actions">
        <button class="small-btn primary" data-action="grow">${t.stage==='old'?'Pihen':'Növesztés'}</button>
        <button class="small-btn" data-action="select">${selectLabel}</button>
        <button class="small-btn" data-action="sell" ${sellValue<=0?'disabled':''}>Eladás</button>
        <button class="small-btn" data-action="breed" ${t.stage!=='adult'?'disabled':''}>Párosítás</button>
      </div>
      <div class="stats-list">
        <div>Következő: ${t.stage==='old'?'nincs':STAGE_LABEL[stageNext(t.stage)]}</div>
        <div>Szaporítás: ${t.stage==='adult'?`${t.breedCount}/${BREED_LIMIT}`:'-'}</div>
        <div>Cooldown: ${t.cooldownUntil>now()?`${Math.ceil((t.cooldownUntil-now())/1000)} mp`:'kész'}</div>
      </div>`;
    card.querySelector('[data-action="grow"]').addEventListener('click',()=>growTurtle(t.uid));
    card.querySelector('[data-action="select"]').addEventListener('click',()=>toggleSelect(t.uid));
    card.querySelector('[data-action="sell"]').addEventListener('click',e=>sellTurtle(t.uid,e));
    card.querySelector('[data-action="breed"]').addEventListener('click',()=>toggleSelect(t.uid,true));
    els.boardGrid.appendChild(card);
  });
}
function renderCatchLog(){
  els.catchLog.innerHTML='';
  if(!state.catchLog.length){ els.catchLog.innerHTML='<div class="log-item muted">Még nincs sikeres fogás.</div>'; return; }
  state.catchLog.slice(0,10).forEach(entry=>{
    const el=document.createElement('div'); el.className='log-item';
    const biomeLabel = entry.biomeId ? ' · '+biomeById(entry.biomeId).name : '';
    el.innerHTML=`<strong>${entry.speciesName}</strong><div class="muted">${entry.rarityLabel} · ${entry.stageLabel} · ${entry.value} pénz${biomeLabel} ${entry.auto?'· auto':''}</div>`;
    els.catchLog.appendChild(el);
  });
}
function renderTabs(){
  els.tabs.forEach(t=>t.classList.toggle('active',t.dataset.view===state.currentView));
  Object.entries(els.views).forEach(([key,el])=>el.classList.toggle('active',key===state.currentView));
}
function renderMap(){
  els.mapStage.innerHTML='';
  state.unlockedBiomes.forEach(id=>{
    const biome=biomeById(id); const node=document.createElement('div'); node.className='map-node'; node.style.left=`${biome.map.x}%`; node.style.top=`${biome.map.y}%`;
    node.innerHTML=`<button style="--nodeA:${biome.palette[0]};--nodeB:${biome.palette[1]}" aria-label="${biome.name}"></button><span>${biome.name}</span>`;
    node.querySelector('button').addEventListener('click',()=>selectBiome(id));
    els.mapStage.appendChild(node);
  });
}
function renderHuntScene(){
  const biome=activeBiome();
  if(!biome){ els.sceneOverlay.innerHTML='<p>Válassz biomot a vadászat indításához.</p>'; els.sceneOverlay.classList.remove('hidden'); return; }
  els.huntBiomeTitle.textContent=biome.name;
  els.huntBiomeDesc.textContent=biome.desc;
  els.biomeLevelBadge.textContent=`Szint ${biomeData(biome.id).level}`;
  els.huntScene.style.setProperty('--biome-bg', biome.scene);
  if(biome.image){ els.huntScene.style.setProperty('--biome-image', `url('../${biome.image}')`); els.huntScene.classList.add('has-image'); }
  else { els.huntScene.style.removeProperty('--biome-image'); els.huntScene.classList.remove('has-image'); }
  const prog=biomeData(biome.id);
  prog.activeSpawns=prog.activeSpawns.filter(s=>s.expiresAt>now() && !s.caught);
  els.huntScene.querySelectorAll('.catchable').forEach(n=>{
    if(!prog.activeSpawns.find(s=>s.id===n.dataset.spawnId)) n.remove();
  });
  if(!state.selectedBiome){ els.sceneOverlay.classList.remove('hidden'); return; }
  els.sceneOverlay.classList.add('hidden');
  prog.activeSpawns.forEach(spawn=>{
    let btn=els.huntScene.querySelector(`.catchable[data-spawn-id="${spawn.id}"]`);
    if(!btn){
      btn=document.createElement('button');
      btn.className=`catchable ${spawn.bigCatch?'big-catch':''}`;
      btn.dataset.spawnId=spawn.id;
      btn.style.left=`${spawn.x}%`;
      btn.style.top=`${spawn.y}%`;
      btn.style.setProperty('--wander-x', `${(Math.random()*2-1)*34}px`);
      btn.style.setProperty('--wander-y', `${(Math.random()*2-1)*22}px`);
      btn.style.setProperty('--wander-dur', `${3.2+Math.random()*2.6}s`);
      btn.style.setProperty('--wander-delay', `${Math.random()*-4}s`);
      btn.textContent='🐢';
      btn.addEventListener('click',e=>catchSpawn(spawn.id,e));
      els.huntScene.appendChild(btn);
    }
  });
}
function renderBiomeUpgrades(){
  const biome=activeBiome(); els.biomeUpgradeList.innerHTML='';
  if(!biome){ els.biomeUpgradeList.innerHTML='<div class="upgrade-card muted">Előbb válassz biomot.</div>'; return; }
  const prog=biomeData(biome.id);
  biomeUpgradeDefs(biome.id).forEach(def=>{
    const lvl=prog.upgrades[def.id]||0; const maxed=lvl>=def.max; const cost=def.base + def.step*lvl; const enough=def.type==='token'?biomeTokenCount(biome.id)>=cost:state.money>=cost;
    const card=document.createElement('div'); card.className='upgrade-card';
    card.innerHTML=`<strong>${def.title}</strong><div class="muted">${def.desc}</div><div class="price-line"><span>${def.id==='autoHuntUnlock'&&lvl? 'Aktív' : 'Szint '+lvl+(maxed?' · max':'')}</span><button class="btn ${def.type==='token'?'secondary':''}" ${maxed||!enough?'disabled':''}>${maxed?'Max':cost+' '+(def.type==='token'? biome.name+' token':'pénz')}</button></div><div class="muted" style="margin-top:6px;font-size:.82rem">Elérhető: ${fmt(biomeTokenCount(biome.id))} ${biome.name.toLowerCase()} token</div>`;
    card.querySelector('button').addEventListener('click',()=>buyBiomeUpgrade(biome.id,def));
    els.biomeUpgradeList.appendChild(card);
  });
}
function renderStoreSpecies(){
  const list=els.storeSpeciesList; list.innerHTML='';
  SPECIES.forEach((s,index)=>{
    const unlocked=state.storeUnlockedSpecies.includes(s.id);
    const unlockCost= index===0 ? 200 : 200 + index*180;
    const card=document.createElement('div'); card.className='store-card';
    card.innerHTML=`<strong>${s.name}</strong><div class="muted">${unlocked?'Feloldva a store vásárláshoz.':'Ezzel csak a store-os tojásvásárlást oldod fel, vadászatból ettől függetlenül is megszerezhető lehet.'}</div><div class="price-line"><span class="token">Tojás ár: ${fmt(s.eggPrice)}</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn secondary unlock-btn" ${unlocked||state.money<unlockCost?'disabled':''}>${unlocked?'Feloldva':unlockCost+' pénz unlock'}</button><button class="btn buy-btn" ${!unlocked||state.money<s.eggPrice?'disabled':''}>Tojás vásárlás</button></div></div>`;
    card.querySelector('.unlock-btn').addEventListener('click',()=>unlockSpecies(s.id,unlockCost));
    card.querySelector('.buy-btn').addEventListener('click',()=>buyEgg(s.id));
    list.appendChild(card);
  });
}
function renderGlobalStore(){
  const list=els.globalStoreList; list.innerHTML='';
  const revealCard=document.createElement('div'); revealCard.className='store-card';
  revealCard.innerHTML=`<strong>Reveal skip</strong><div class="muted">Globális quality-of-life upgrade: a jövőbeli fogásoknál átugorható a reward felfedés. A skippelhető reward flow-ok csökkentik a hosszú távú frusztrációt. [web:105][web:112]</div><div class="price-line"><span class="token">800 pénz</span><button class="btn" ${state.globalUpgrades.revealSkip||state.money<800?'disabled':''}>${state.globalUpgrades.revealSkip?'Megvett': 'Megvásárlás'}</button></div>`;
  revealCard.querySelector('button').addEventListener('click',buyRevealSkip);
  list.appendChild(revealCard);
}
function renderBiomeUnlocks(){
  const list=els.biomeUnlockList; list.innerHTML='';
  BIOMES.filter(b=>!state.unlockedBiomes.includes(b.id)).slice(0,1).forEach(b=>{
    const card=document.createElement('div'); card.className='store-card';
    card.innerHTML=`<strong>${b.name}</strong><div class="muted">${b.desc}</div><div class="price-line"><span class="token">${fmt(b.unlockCost)} pénz</span><button class="btn" ${state.money<b.unlockCost?'disabled':''}>Biom feloldása</button></div>`;
    card.querySelector('button').addEventListener('click',()=>unlockBiome(b.id));
    list.appendChild(card);
  });
  if(!list.children.length) list.innerHTML='<div class="store-card muted">Minden jelenlegi biom fel van oldva.</div>';
}
function renderReveal(){
  const pending=state.pendingReveal;
  if(!pending){
    els.revealPanel.classList.remove('open');
    return;
  }
  els.revealPanel.classList.add('open');
  if(pending.spinning){
    els.mysteryState.classList.remove('hidden');
    els.mysteryState.classList.add('spinning');
    els.revealResult.className='reveal-result';
    els.revealResult.innerHTML='';
    els.revealBtn.classList.add('hidden');
    els.revealCloseBtn.classList.add('hidden');
    return;
  }
  if(!pending.revealed){
    els.mysteryState.classList.remove('hidden');
    els.mysteryState.classList.remove('spinning');
    els.mysteryState.innerHTML='<div class="mystery">?</div><p class="muted">Rejtett jutalom</p>';
    els.revealResult.className='reveal-result';
    els.revealResult.innerHTML='';
    els.revealBtn.classList.remove('hidden');
    els.revealCloseBtn.classList.add('hidden');
    return;
  }
  const s=speciesById(pending.speciesId);
  const visual=turtleVisual(pending.speciesId,pending.rarity,pending.stage);
  els.mysteryState.classList.add('hidden');
  els.mysteryState.classList.remove('spinning');
  els.revealResult.className='reveal-result show';
  els.revealResult.innerHTML=`<div class="reveal-turtle" style="--art-bg:linear-gradient(180deg, ${visual.bgA}, ${visual.bgB})"><span class="turtle-emoji" style="font-size:4rem;filter:hue-rotate(${speciesHue(pending.speciesId)}deg) saturate(1.45) brightness(1.02);">${visual.emoji}</span></div><h3>${s.name}</h3><div class="rarity-row"><span class="badge rarity-${pending.rarity}">${RARITIES[pending.rarity].label}</span><span class="badge stage">${STAGE_LABEL[pending.stage]}</span></div><p class="muted">Eladási érték: <strong>${fmt(turtleValue(pending))} pénz</strong></p>`;
  els.revealBtn.classList.add('hidden');
  els.revealCloseBtn.classList.remove('hidden');
}
function renderRevealSpinFrame(elapsedMs){
  if(!els.mysteryState.classList.contains('spinning')) return;
  const frame=revealSpinFrame;
  if(!frame) return;
  const visual=turtleVisual(frame.speciesId,frame.rarity,'young');
  const remainingSec=Math.max(0,Math.ceil((REVEAL_SPIN_MS-elapsedMs)/1000));
  els.mysteryState.innerHTML=`
    <div class="spin-stage">
      <div class="spin-stars">${'<span class="spin-star"></span>'.repeat(10)}</div>
      <div class="spin-turtle" style="--art-bg:linear-gradient(180deg, ${visual.bgA}, ${visual.bgB})">
        <span class="turtle-emoji" style="font-size:3.4rem;filter:hue-rotate(${speciesHue(frame.speciesId)}deg) saturate(1.45) brightness(1.02);">${visual.emoji}</span>
      </div>
      <span class="badge rarity-${frame.rarity} spin-rarity-badge">${RARITIES[frame.rarity].label}</span>
    </div>
    <p class="muted spin-countdown">Sorsolás… ${remainingSec}s</p>
  `;
}
function rerender(){ renderHud(); renderTabs(); renderBoard(); renderCatchLog(); renderMap(); renderHuntScene(); renderBiomeUpgrades(); renderStoreSpecies(); renderGlobalStore(); renderBiomeUnlocks(); renderReveal(); els.contextHint.textContent=CONTEXT_HINTS[state.currentHint]||state.currentHint; save(); }
