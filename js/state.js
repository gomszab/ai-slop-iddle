// state.js — globális állapot, DOM referenciák, mentés/betöltés, apró helper függvények
// A state objektum az egyetlen source of truth futásidőben.

const state={
  money:0,
  biomeTokens:{},
  turtles:[],
  currentView:'board',
  selectedBiome:null,
  unlockedBiomes:['mohareti'],
  storeUnlockedSpecies:[],
  globalUpgrades:{revealSkip:false},
  biomeProgress:{},
  catchLog:[],
  revealQueue:[],
  pendingReveal:null,
  selectedTurtles:[],
  stats:{firstCatch:false,firstBoard:false,first200:false,firstAdult:false},
  currentHint:'start',
  lastSeen:Date.now(),
  uid:1
};
BIOMES.forEach(b=>{state.biomeProgress[b.id]={level:1, upgrades:{spawnRate:0,visibleTime:0,simultaneous:0,autoHuntUnlock:0,autoHuntRate:0,autoHuntSuccess:0,rareChance:0}, activeSpawns:[], lastSpawn:0, lastAuto:0}; state.biomeTokens[b.id]=0;});
const $=sel=>document.querySelector(sel); const $$=sel=>Array.from(document.querySelectorAll(sel));
const els={
  boardHelpPanel:$('#boardHelpPanel'), inlineStorePanel:$('#inlineStorePanel'),
  hudMoney:$('#hudMoney'),hudTokens:$('#hudTokens'),hudEggs:$('#hudEggs'),hudTurtles:$('#hudTurtles'),hudRare:$('#hudRare'),hudBiome:$('#hudBiome'),
  tabs:$$('.tab'),views:{board:$('#view-board'),hunt:$('#view-hunt'),store:$('#view-store')},
  contextHint:$('#contextHint'),boardGrid:$('#boardGrid'),boardStoreSpecies:$('#boardStoreSpecies'),catchLog:$('#catchLog'),
  mapStage:$('#mapStage'),huntScene:$('#huntScene'),sceneOverlay:$('#sceneOverlay'),huntBiomeTitle:$('#huntBiomeTitle'),huntBiomeDesc:$('#huntBiomeDesc'),biomeLevelBadge:$('#biomeLevelBadge'),biomeUpgradeList:$('#biomeUpgradeList'),
  storeSpeciesList:$('#storeSpeciesList'),globalStoreList:$('#globalStoreList'),biomeUnlockList:$('#biomeUnlockList'),
  revealPanel:$('#revealPanel'),revealBackdrop:$('#revealBackdrop'),revealBtn:$('#revealBtn'),revealCloseBtn:$('#revealCloseBtn'),revealResult:$('#revealResult'),mysteryState:$('#mysteryState'),
  toastWrap:$('#toastWrap'),floaters:$('#floaters'),offlineModal:$('#offlineModal'),offlineText:$('#offlineText')
};
const themeBtn=$('#themeBtn');
const fmt=n=>Math.floor(n).toLocaleString('hu-HU');
const speciesById=id=>SPECIES.find(s=>s.id===id);
const biomeById=id=>BIOMES.find(b=>b.id===id);
const now=()=>Date.now();
const nextUid=()=>`t${state.uid++}`;
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify({...state,lastSeen:Date.now()}));}
function load(){
  try{
    const raw=localStorage.getItem(SAVE_KEY); if(!raw) return false;
    const data=JSON.parse(raw);
    Object.assign(state,data);
    if(!state.biomeTokens){ state.biomeTokens={}; }
    state.selectedTurtles=[];
    BIOMES.forEach(b=>{
      if(!state.biomeProgress[b.id]) state.biomeProgress[b.id]={level:1, upgrades:{spawnRate:0,visibleTime:0,simultaneous:0,autoHuntUnlock:0,autoHuntRate:0,autoHuntSuccess:0,rareChance:0}, activeSpawns:[], lastSpawn:0, lastAuto:0};
      else{ state.biomeProgress[b.id].activeSpawns=[]; }
      if(state.biomeTokens[b.id]===undefined) state.biomeTokens[b.id]=0;
    });
    return true;
  }catch(e){ console.error(e); return false; }
}
function toast(msg,type='good'){
  const el=document.createElement('div'); el.className=`toast ${type==='bad'?'bad':''}`; el.textContent=msg; els.toastWrap.appendChild(el); setTimeout(()=>{el.style.opacity='0'; setTimeout(()=>el.remove(),250)},2200);
}
function floater(x,y,text,kind='good'){
  const el=document.createElement('div'); el.className=`floater ${kind}`; el.textContent=text; el.style.left=`${x}px`; el.style.top=`${y}px`; els.floaters.appendChild(el); setTimeout(()=>el.remove(),900);
}
function setHint(key){ state.currentHint=key; els.contextHint.textContent=CONTEXT_HINTS[key]||key; }
function rarityFromBonus(bonus=0,bigCatch=false){
  let weights=RARITY_ORDER.map(k=>RARITIES[k].weight);
  weights[0]=Math.max(4,weights[0]-bonus*2-(bigCatch?10:0));
  weights[1]+=bonus*1.2+(bigCatch?5:0); weights[2]+=bonus*1.1+(bigCatch?3:0); weights[3]+=bonus*.6+(bigCatch?2:0);
  let total=weights.reduce((a,b)=>a+b,0), roll=Math.random()*total;
  for(let i=0;i<RARITY_ORDER.length;i++){ if(roll<weights[i]) return RARITY_ORDER[i]; roll-=weights[i]; }
  return 'common';
}
function randomSpeciesForBiome(biomeId){
  const pool=biomeById(biomeId).species; return pool[Math.floor(Math.random()*pool.length)];
}
function randomStageCaught(){ const r=Math.random(); if(r<.38) return 'young'; if(r<.83) return 'adult'; return 'old'; }
function turtleValue(t){ return Math.round(speciesById(t.speciesId).baseValue * RARITIES[t.rarity].mult * (STAGE_MULT[t.stage]||0)); }
function createTurtle(speciesId, source='hunt', stage=null, rarity=null){
  return {uid:nextUid(), speciesId, source, stage:stage||'egg', rarity:rarity||rarityFromBonus(0,false), progress:0, breedCount:0, cooldownUntil:0, createdAt:now()};
}
function activeBiome(){ return biomeById(state.selectedBiome||state.unlockedBiomes[0]); }
function biomeData(id){ return state.biomeProgress[id]; }
function biomeSpawnInterval(id){ const lvl=biomeData(id).upgrades.spawnRate; return Math.max(900,3000 - lvl*220); }
function biomeVisibleDuration(id){ const lvl=biomeData(id).upgrades.visibleTime; return 4000 + lvl*650; }
function biomeSimultaneousCap(id){ return 2 + biomeData(id).upgrades.simultaneous; }
function autoHuntInterval(id){ const lvl=biomeData(id).upgrades.autoHuntRate; return Math.max(5000,12000 - lvl*900); }
function autoHuntSuccess(id){ return Math.min(.88,.36 + biomeData(id).upgrades.autoHuntSuccess*0.06); }
function canBreed(t){ return t.stage==='adult' && t.breedCount<BREED_LIMIT && t.cooldownUntil<=now(); }
function stageClicksNeeded(stage){ return stage==='egg'?CLICK_EGG:CLICK_STAGE; }
function stageNext(stage){ return stage==='egg'?'young':stage==='young'?'adult':stage==='adult'?'old':'old'; }
function totalBiomeTokens(){ return Object.values(state.biomeTokens||{}).reduce((a,b)=>a+(b||0),0); }
function biomeTokenCount(id){ return (state.biomeTokens&&state.biomeTokens[id])||0; }
function addBiomeTokens(id, amount){ if(!state.biomeTokens) state.biomeTokens={}; state.biomeTokens[id]=(state.biomeTokens[id]||0)+amount; }
function spendBiomeTokens(id, amount){ if(biomeTokenCount(id)<amount) return false; state.biomeTokens[id]-=amount; return true; }
