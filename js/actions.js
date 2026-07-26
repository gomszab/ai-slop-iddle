// actions.js — játéklogika: navigáció, vásárlás, vadászat, tenyésztés, reveal, automatizálás, offline progress

function switchView(view){ state.currentView=view; rerender(); }
function selectBiome(id){ state.selectedBiome=id; state.currentHint = state.stats.firstCatch ? state.currentHint : 'start'; rerender(); }
function buyEgg(speciesId){ const s=speciesById(speciesId); if(state.money<s.eggPrice){toast('Nincs elég pénz.', 'bad'); return;} state.money-=s.eggPrice; state.turtles.push(createTurtle(speciesId,'store','egg',rarityFromBonus(0,false))); toast(`${s.name} tojás a boardon.`); rerender(); }
function unlockSpecies(speciesId,cost){ if(state.storeUnlockedSpecies.includes(speciesId)) return; if(state.money<cost){toast('Nincs elég pénz az unlockhoz.','bad'); return;} state.money-=cost; state.storeUnlockedSpecies.push(speciesId); toast(`Store unlock: ${speciesById(speciesId).name}`); rerender(); }
function buyRevealSkip(){ if(state.globalUpgrades.revealSkip||state.money<800){toast('Ehhez még több pénz kell.','bad'); return;} state.money-=800; state.globalUpgrades.revealSkip=true; toast('Reveal skip feloldva.'); rerender(); }
function unlockBiome(id){ const b=biomeById(id); if(state.money<b.unlockCost){toast('Nincs elég pénz az új biomhoz.','bad'); return;} state.money-=b.unlockCost; state.unlockedBiomes.push(id); toast(`Új biom: ${b.name}`); selectBiome(id); switchView('hunt'); }
function buyBiomeUpgrade(biomeId,def){ const prog=biomeData(biomeId); const lvl=prog.upgrades[def.id]||0; if(lvl>=def.max) return; const cost=def.base+def.step*lvl; if(def.type==='token'){ if(!spendBiomeTokens(biomeId,cost)){toast('Nincs elég ebből a biom tokenből.','bad'); return;} } else { if(state.money<cost){toast('Nincs elég pénz.','bad'); return;} state.money-=cost; }
  prog.upgrades[def.id]+=1; if(def.id!=='autoHuntUnlock') prog.level = Math.max(prog.level, 1 + Math.floor(totalBiomeUpgradeLevels(biomeId)/3));
  toast(`${def.title} fejlesztve.`); rerender();
}
function totalBiomeUpgradeLevels(id){ const up=biomeData(id).upgrades; return Object.values(up).reduce((a,b)=>a+b,0); }
function addCatchLog(turtle,auto=false,biomeId=null){ state.catchLog.unshift({speciesName:speciesById(turtle.speciesId).name, rarityLabel:RARITIES[turtle.rarity].label, stageLabel:STAGE_LABEL[turtle.stage], value:fmt(turtleValue(turtle)), auto, biomeId}); state.catchLog=state.catchLog.slice(0,30); }
function queueReveal(turtle){ if(state.globalUpgrades.revealSkip){ state.turtles.push(turtle); addCatchLog(turtle,false); toast(`${speciesById(turtle.speciesId).name} a boardra került.`); if(!state.stats.firstBoard){state.stats.firstBoard=true; setHint('firstBoard');} rerender(); return; }
  state.pendingReveal=turtle; renderReveal(); }
function spawnForCurrentBiome(force=false){ if(!state.selectedBiome) return; const biomeId=state.selectedBiome; const prog=biomeData(biomeId); const active=prog.activeSpawns.filter(s=>s.expiresAt>now()&&!s.caught); prog.activeSpawns=active; const interval=biomeSpawnInterval(biomeId); if(!force && now()-prog.lastSpawn<interval) return; if(active.length>=biomeSimultaneousCap(biomeId)) return; const spawn={id:crypto.randomUUID(),x:12+Math.random()*76,y:18+Math.random()*56,expiresAt:now()+biomeVisibleDuration(biomeId),caught:false,bigCatch:Math.random()<0.01}; prog.activeSpawns.push(spawn); prog.lastSpawn=now(); renderHuntScene(); }
function catchSpawn(spawnId,e){ const biomeId=state.selectedBiome; if(!biomeId){toast('Előbb válassz biomot.','bad'); return;} const prog=biomeData(biomeId); const spawn=prog.activeSpawns.find(s=>s.id===spawnId); if(!spawn||spawn.caught||spawn.expiresAt<now()){toast('Lekésted a fogást.','bad'); return;} spawn.caught=true; addBiomeTokens(biomeId,2); const speciesId=randomSpeciesForBiome(biomeId); const bonus=prog.upgrades.rareChance + (spawn.bigCatch?2:0); const turtle=createTurtle(speciesId,'hunt',randomStageCaught(),rarityFromBonus(bonus,spawn.bigCatch));
  state.pendingReveal={...turtle,revealed:false}; if(!state.stats.firstCatch){state.stats.firstCatch=true; setHint('firstCatch');}
  if(spawn.bigCatch) toast('Nagy fogás!', 'good'); else toast('Sikeres fogás!');
  floater(e.clientX,e.clientY,'+2 '+biomeById(biomeId).name+' token','good'); renderHuntScene(); renderHud(); renderCatchLog(); renderReveal(); save();
}
const REVEAL_SPIN_MS=10000;
const REVEAL_TICK_MS=80;
let revealSpinTimer=null;
let revealSpinFrame=null;

function stopRevealSpin(){
  if(revealSpinTimer){ clearInterval(revealSpinTimer); revealSpinTimer=null; }
  revealSpinFrame=null;
}

function revealPending(){
  const t=state.pendingReveal;
  if(!t || t.revealed || t.spinning) return;
  state.pendingReveal.spinning=true;
  state.pendingReveal.spinStart=now();
  revealSpinFrame={speciesId:t.speciesId,rarity:t.rarity};
  renderReveal();
  stopRevealSpin();
  revealSpinTimer=setInterval(()=>{
    const p=state.pendingReveal;
    if(!p || !p.spinning){ stopRevealSpin(); return; }
    const elapsed=now()-p.spinStart;
    if(elapsed>=REVEAL_SPIN_MS){
      stopRevealSpin();
      p.spinning=false;
      p.revealed=true;
      renderReveal();
      save();
      return;
    }
    const pool=SPECIES.filter(sp=>true);
    const randomSpecies=pool[Math.floor(Math.random()*pool.length)];
    const randomRarity=RARITY_ORDER[Math.floor(Math.random()*RARITY_ORDER.length)];
    revealSpinFrame={speciesId:randomSpecies.id,rarity:randomRarity};
    renderRevealSpinFrame(elapsed);
  }, REVEAL_TICK_MS);
}
function closeReveal(){
  const t=state.pendingReveal;
  if(!t) return;
  if(!t.revealed) return;
  stopRevealSpin();
  const finalTurtle={...t};
  delete finalTurtle.revealed;
  delete finalTurtle.spinning;
  delete finalTurtle.spinStart;
  state.turtles.push(finalTurtle);
  addCatchLog(finalTurtle,false);
  state.pendingReveal=null;
  if(!state.stats.firstBoard){state.stats.firstBoard=true; setHint('firstBoard');}
  rerender();
}


function growTurtle(uid){ const t=state.turtles.find(x=>x.uid===uid); if(!t) return; if(t.stage==='old'){toast('Ez a teknős már nem fejlődik tovább.','bad'); return;} t.progress += 1; if(t.progress>=stageClicksNeeded(t.stage)){ t.progress=0; t.stage=stageNext(t.stage); toast(`${speciesById(t.speciesId).name} most már ${STAGE_LABEL[t.stage].toLowerCase()}.`); if(t.stage==='adult' && !state.stats.firstAdult){state.stats.firstAdult=true; setHint('firstAdult');} }
  rerender();
}
function sellTurtle(uid,e=null){ const i=state.turtles.findIndex(x=>x.uid===uid); if(i===-1) return; const t=state.turtles[i]; const value=turtleValue(t); if(value<=0){toast('A tojás nem eladható.','bad'); return;} state.money+=value; state.turtles.splice(i,1); state.selectedTurtles=state.selectedTurtles.filter(x=>x!==uid); toast(`Eladva: +${fmt(value)} pénz`); if(e){ floater(e.clientX,e.clientY,`+${fmt(value)}`,'money'); }
  if(state.money>=200 && !state.stats.first200){state.stats.first200=true; setHint('first200');}
  rerender();
}
function toggleSelect(uid,preferBreed=false){ const t=state.turtles.find(x=>x.uid===uid); if(!t) return; if(state.selectedTurtles.includes(uid)) state.selectedTurtles=state.selectedTurtles.filter(x=>x!==uid); else state.selectedTurtles=[...state.selectedTurtles.slice(-1),uid];
  if(preferBreed && state.selectedTurtles.length===2) tryBreedSelected(); else rerender();
}
function tryBreedSelected(){ if(state.selectedTurtles.length<2){toast('Válassz ki két teknőst.','bad'); return;} const [aId,bId]=state.selectedTurtles; if(aId===bId){toast('Két külön teknős kell.','bad'); return;} const a=state.turtles.find(t=>t.uid===aId), b=state.turtles.find(t=>t.uid===bId); if(!a||!b){state.selectedTurtles=[]; rerender(); return;} if(!canBreed(a)||!canBreed(b)){toast('Csak kész, felnőtt teknősök párosíthatók.','bad'); return;}
  const childSpecies = a.speciesId===b.speciesId ? a.speciesId : (Math.random()<0.5?a.speciesId:b.speciesId);
  const better=Math.max(RARITY_ORDER.indexOf(a.rarity),RARITY_ORDER.indexOf(b.rarity)); const bonus=Math.max(0,better-0.5);
  const egg=createTurtle(childSpecies,'bred','egg',rarityFromBonus(bonus,false)); state.turtles.push(egg); a.breedCount++; b.breedCount++; a.cooldownUntil=now()+BREED_CD; b.cooldownUntil=now()+BREED_CD; if(a.breedCount>=BREED_LIMIT) a.stage='old'; if(b.breedCount>=BREED_LIMIT) b.stage='old'; state.selectedTurtles=[]; toast('Sikeres párosítás: új tojás a boardon.'); rerender();
}
function manualSpawn(){ if(!state.selectedBiome){toast('Előbb válassz biomot.','bad'); return;} spawnForCurrentBiome(true); }
function automationTick(){
  if(state.selectedBiome) spawnForCurrentBiome(false);
  BIOMES.forEach(b=>{
    const prog=biomeData(b.id);
    prog.activeSpawns=prog.activeSpawns.filter(s=>s.expiresAt>now()&&!s.caught);
    if(prog.upgrades.autoHuntUnlock>0 && now()-prog.lastAuto>=autoHuntInterval(b.id)){
      prog.lastAuto=now();
      const available=prog.activeSpawns[0];
      if(available && Math.random()<autoHuntSuccess(b.id)){
        available.caught=true;
        addBiomeTokens(b.id,2);
        const speciesId=randomSpeciesForBiome(b.id);
        const t=createTurtle(speciesId,'hunt',randomStageCaught(),rarityFromBonus(prog.upgrades.rareChance,false));
        state.turtles.push(t); addCatchLog(t,true,b.id);
      }
    }
  });
  rerender();
}
function applyOffline(){
  const elapsed=Math.min(OFFLINE_CAP_MS, Math.max(0, Date.now()-(state.lastSeen||Date.now())));
  if(elapsed<30000) return;
  let moneyGained=0, autoCatches=0; const tokensByBiome={};
  BIOMES.forEach(b=>{
    const prog=biomeData(b.id);
    if(prog.upgrades.autoHuntUnlock>0){
      const cycles=Math.floor(elapsed/autoHuntInterval(b.id));
      for(let i=0;i<cycles;i++){
        if(Math.random()<autoHuntSuccess(b.id)*0.8){
          autoCatches++; tokensByBiome[b.id]=(tokensByBiome[b.id]||0)+2; const speciesId=randomSpeciesForBiome(b.id); const t=createTurtle(speciesId,'hunt',randomStageCaught(),rarityFromBonus(prog.upgrades.rareChance,false)); state.turtles.push(t); addCatchLog(t,true,b.id); moneyGained += 0;
        }
      }
    }
  });
  Object.entries(tokensByBiome).forEach(([id,amount])=>addBiomeTokens(id,amount));
  if(autoCatches>0){
    const tokenSummary = Object.entries(tokensByBiome).map(([id,amount])=>`${biomeById(id).name}: ${amount}`).join(', ');
    els.offlineText.textContent=`${Math.floor(elapsed/60000)} perc telt el. Auto-fogások: ${autoCatches}, szerzett biom tokenek: ${tokenSummary || '0'}, közvetlen pénz: ${moneyGained}.`;
    $('#offlineModal').classList.add('open');
  }
}
