// data.js — statikus konfiguráció: fajok, biomok, ritkaságok, upgrade táblák
// Nincs benne állapot, csak konstansok. Ide kerül minden balansz-adat.

'use strict';
const SAVE_KEY='turtle_breeder_hunt_v1';
const OFFLINE_CAP_MS=8*60*60*1000;
const CLICK_EGG=3, CLICK_STAGE=3, BREED_LIMIT=3, BREED_CD=10000;
const AUTO_TICK_MS=1000;
const RARITY_ORDER=['common','uncommon','rare','legendary'];
const RARITIES={
  common:{label:'Common',color:'#8ca291',weight:62,mult:1},
  uncommon:{label:'Uncommon',color:'#5ba7c7',weight:24,mult:1.8},
  rare:{label:'Rare',color:'#8a63d2',weight:11,mult:3.2},
  legendary:{label:'Legendary',color:'#cf9c29',weight:3,mult:6.4}
};
const STAGES=['egg','young','adult','old'];
const STAGE_LABEL={egg:'Tojás',young:'Fiatal',adult:'Felnőtt',old:'Öreg'};
const STAGE_MULT={egg:0,young:1.45,adult:1,old:0.45};
const SPECIES=[
  {id:'mohateknos',name:'Mohateknős',emoji:'🐢',baseValue:28,eggPrice:80,colors:['#c7dfb2','#8db270']},
  {id:'lagunateknos',name:'Lagúnateknős',emoji:'🐢',baseValue:44,eggPrice:120,colors:['#bfe6ea','#74bac0']},
  {id:'napteknos',name:'Napteknős',emoji:'🐢',baseValue:70,eggPrice:175,colors:['#f0dfa7','#d1a846']},
  {id:'ambrateknos',name:'Ambrateknős',emoji:'🐢',baseValue:110,eggPrice:260,colors:['#f4c3a5','#d98352']},
  {id:'csillagteknos',name:'Csillagteknős',emoji:'🐢',baseValue:170,eggPrice:380,colors:['#d4cef7','#8a73d2']},
  {id:'kristalyteknos',name:'Kristályteknős',emoji:'🐢',baseValue:260,eggPrice:560,colors:['#cceaf0','#70bedc']},
  {id:'vulkanteknos',name:'Vulkánteknős',emoji:'🐢',baseValue:390,eggPrice:860,colors:['#edc2b9','#c56e5d']},
  {id:'holdteknos',name:'Holdteknős',emoji:'🐢',baseValue:560,eggPrice:1200,colors:['#dde4fa','#909bce']}
];
const BIOMES=[
  {id:'mohareti',name:'Moharét',desc:'Puha zöld liget, ahol békés kezdő teknősök bukkannak fel.',palette:['#dbe9c7','#93b07b'],scene:'linear-gradient(180deg,#d7ebc8 0%, #add2a0 45%, #8cb68a 100%)',species:['mohateknos'],unlockCost:0,map:{x:28,y:72}},
  {id:'laguna',name:'Türkiz Lagúna',desc:'Párás vízpart, ahol a korábbi fajok mellé új vízkedvelő példányok érkeznek.',palette:['#c7edf0','#6bb8c2'],scene:'linear-gradient(180deg,#caeff3 0%, #8ed5da 46%, #6cb0a7 100%)',species:['mohateknos','lagunateknos'],unlockCost:20000,map:{x:57,y:52}},
  {id:'naposdomb',name:'Napos Domb',desc:'Arany fényű tisztás ritkább napteknősökkel.',palette:['#f7e2b2','#d7b25b'],scene:'linear-gradient(180deg,#f3e4b8 0%, #d8c06a 48%, #af8b45 100%)',species:['mohateknos','lagunateknos','napteknos'],unlockCost:60000,map:{x:73,y:26}},
  {id:'ambraerdő',name:'Ambraerdő',desc:'Meleg tónusú erdő, ahol nagyobb értékű fajok is megjelennek.',palette:['#f3ceb3','#d38754'],scene:'linear-gradient(180deg,#f4d4b9 0%, #dd9b73 45%, #916344 100%)',species:['mohateknos','lagunateknos','napteknos','ambrateknos','csillagteknos'],unlockCost:135000,map:{x:41,y:24}},
  {id:'kristalyto',name:'Kristálytó',desc:'Kékesen fénylő végjáték biom különleges fajokkal.',palette:['#d7ecf6','#77bfd8'],scene:'linear-gradient(180deg,#d6eff5 0%, #85c5df 44%, #5d8fa0 100%)',species:['mohateknos','lagunateknos','napteknos','csillagteknos','kristalyteknos','vulkanteknos','holdteknos'],unlockCost:300000,map:{x:84,y:68}}
];
const CONTEXT_HINTS={
  start:'Válassz biomot a vadászathoz.',
  firstCatch:'Sikeres fogás! Használd a Felfedés gombot.',
  firstBoard:'Az eladásból szerzel pénzt.',
  first200:'Most már megengedhetsz egy store unlockot.',
  firstAdult:'Ez a teknős már tenyészthető.'
};
function biomeUpgradeDefs(id){
  return [
    {id:'spawnRate',title:'Gyorsabb spawn',type:'token',base:8,step:6,max:8,desc:'Csökkenti a spawnok közti időt.'},
    {id:'visibleTime',title:'Hosszabb láthatóság',type:'token',base:10,step:8,max:7,desc:'Tovább maradnak láthatók a teknősök.'},
    {id:'simultaneous',title:'Több egyidejű teknős',type:'token',base:14,step:10,max:6,desc:'Növeli a párhuzamosan megjelenő teknősök számát.'},
    {id:'autoHuntUnlock',title:'Auto-hunt unlock',type:'money',base:300,step:0,max:1,desc:'Biomonként külön automatikus fogás.'},
    {id:'autoHuntRate',title:'Auto-hunt sebesség',type:'token',base:20,step:14,max:8,desc:'Gyakrabban próbál automatikusan fogni.'},
    {id:'autoHuntSuccess',title:'Auto-hunt sikerarány',type:'token',base:18,step:12,max:8,desc:'Javítja az automatikus fogás sikerességét.'},
    {id:'rareChance',title:'Ritka fogás esély',type:'token',base:25,step:18,max:5,desc:'Kicsit javítja a jobb rarity esélyét.'}
  ];
}
