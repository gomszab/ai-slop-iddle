// main.js — event binding és a játék bootstrap-je. Ez fut le utoljára.

function bind(){
  els.tabs.forEach(t=>t.addEventListener('click',()=>switchView(t.dataset.view)));
  $('#boardToHuntBtn').addEventListener('click',()=>switchView('hunt'));
  $('#openStoreBtn').addEventListener('click',()=>switchView('store'));
  $('#backToBoardFromHunt').addEventListener('click',()=>switchView('board'));
  $('#changeBiomeBtn').addEventListener('click',()=>{ state.selectedBiome=null; rerender(); });
  $('#manualSpawnBtn').addEventListener('click',manualSpawn);
  themeBtn.addEventListener('click',()=>{ const root=document.documentElement; root.setAttribute('data-theme', root.getAttribute('data-theme')==='dark'?'light':'dark'); themeBtn.textContent = root.getAttribute('data-theme')==='dark' ? '☀' : '◐'; });
  els.revealBtn.addEventListener('click',revealPending);
  els.revealCloseBtn.addEventListener('click',closeReveal);
  if(els.revealBackdrop) els.revealBackdrop.addEventListener('click',closeReveal);
  $('#offlineClose').addEventListener('click',()=>$('#offlineModal').classList.remove('open'));
  $('#sellZone').addEventListener('click',()=>{ if(state.selectedTurtles.length!==1){toast('Eladáshoz jelölj ki egy teknőst.','bad'); return;} sellTurtle(state.selectedTurtles[0]); });
  $('#breedZone').addEventListener('click',tryBreedSelected);
  const mobileSellBtn = $('#mobileSellBtn'); if(mobileSellBtn) mobileSellBtn.addEventListener('click',()=>{ if(state.selectedTurtles.length!==1){toast('Telefonon eladáshoz jelölj ki pontosan 1 teknőst.','bad'); return;} sellTurtle(state.selectedTurtles[0]); });
  const mobileBreedBtn = $('#mobileBreedBtn'); if(mobileBreedBtn) mobileBreedBtn.addEventListener('click',()=>{ if(state.selectedTurtles.length!==2){toast('Telefonon párosításhoz jelölj ki 2 felnőtt teknőst.','bad'); return;} tryBreedSelected(); });
  const toggleBoardHelpBtn = $('#toggleBoardHelpBtn'); if(toggleBoardHelpBtn) toggleBoardHelpBtn.addEventListener('click',()=>els.boardHelpPanel.classList.toggle('hidden'));
  const toggleQuickStoreBtn = $('#toggleQuickStoreBtn'); if(toggleQuickStoreBtn) toggleQuickStoreBtn.addEventListener('click',()=>els.inlineStorePanel.classList.toggle('open'));
  document.addEventListener('visibilitychange',()=>{ if(document.hidden) save(); });
  window.addEventListener('beforeunload',save);
}
load();
if(!state.selectedBiome && state.unlockedBiomes.length) state.selectedBiome=state.unlockedBiomes[0];
applyOffline();
bind();
setInterval(automationTick, AUTO_TICK_MS);
setInterval(save, 10000);
rerender();
