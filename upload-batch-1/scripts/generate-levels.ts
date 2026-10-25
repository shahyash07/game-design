/** Offline authoring: produces committed, replayable puzzle data, never runs on page load. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { genPath, genQueens, genTango, genMini, genPatches, oneLetterApart, fullPath } from '../src/lib/puzzles';
import { LADDERS } from '../src/lib/content';

const COUNT = 365;
const difficulty = (i: number): 1 | 2 | 3 => i < 122 ? 1 : i < 244 ? 2 : 3;
const catalog: Record<string, unknown[]> = {};
function boards(name: string, generate: (seed: number, d: number) => unknown, signature: (p: any) => unknown) {
  const seen = new Set<string>(); const levels = []; let seed = 1001;
  while (levels.length < COUNT) {
    const d = difficulty(levels.length); const p = generate(seed, d); const key = JSON.stringify(signature(p));
    if (!seen.has(key)) { seen.add(key); levels.push({ number: levels.length + 1, difficulty: d, seed, puzzle: p }); }
    seed++;
    if (seed > 20000) throw new Error(`Insufficient unique ${name} boards`);
  }
  catalog[name] = levels;
}
boards('path', genPath, p => [p.n, p.clues]);
boards('queens', (s, d) => genQueens(d === 1 ? 5 : d === 2 ? 6 : 7, s), p => p.region);
boards('tango', genTango, p => p.givens);
boards('sudoku', genMini, p => p.givens);
boards('patches', genPatches, p => [p.n, p.clues]);

const groups: [string, string[]][] = [
  ['Planets', ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']],
  ['Insects', ['Ant','Bee','Beetle','Butterfly','Cricket','Dragonfly','Moth','Wasp']],
  ['Card games', ['Bridge','Poker','Hearts','Rummy','Solitaire','Uno','Canasta','Spades']],
  ['Programming languages', ['Java','Python','Ruby','Swift','Rust','Kotlin','Scala','Go']],
  ['Fish', ['Bass','Trout','Salmon','Tuna','Cod','Carp','Haddock','Sardine']],
  ['Units of time', ['Second','Minute','Hour','Day','Week','Month','Year','Decade']],
  ['Polygons', ['Triangle','Square','Pentagon','Hexagon','Heptagon','Octagon','Nonagon','Decagon']],
  ['Metals', ['Copper','Iron','Gold','Silver','Aluminium','Zinc','Tin','Nickel']],
  ['Rivers', ['Amazon','Nile','Thames','Danube','Ganges','Rhine','Seine','Volga']],
  ['Musical instruments', ['Piano','Violin','Flute','Trumpet','Cello','Guitar','Harp','Clarinet']],
  ['Birds', ['Eagle','Robin','Sparrow','Owl','Falcon','Swan','Raven','Heron']],
  ['Trees', ['Oak','Pine','Birch','Maple','Willow','Elm','Cedar','Ash']],
  ['Flowers', ['Rose','Tulip','Daisy','Lily','Orchid','Iris','Daffodil','Peony']],
  ['Sports', ['Tennis','Cricket','Rugby','Football','Hockey','Baseball','Golf','Badminton']],
  ['Fruits', ['Apple','Pear','Mango','Peach','Plum','Cherry','Banana','Orange']],
  ['Gemstones', ['Ruby','Emerald','Sapphire','Diamond','Opal','Topaz','Garnet','Amethyst']],
  ['Languages', ['English','French','Spanish','Arabic','Hindi','Mandarin','Italian','German']],
  ['Countries', ['Canada','Japan','Brazil','India','France','Italy','Egypt','Mexico']],
  ['Oceans and seas', ['Pacific','Atlantic','Indian','Arctic','Mediterranean','Baltic','Caribbean','Red Sea']],
  ['Units of length', ['Metre','Centimetre','Millimetre','Kilometre','Inch','Foot','Yard','Mile']],
  ['Kitchen utensils', ['Whisk','Ladle','Spatula','Peeler','Colander','Tongs','Grater','Sieve']],
  ['Fabrics', ['Cotton','Silk','Wool','Linen','Denim','Velvet','Satin','Nylon']],
  ['Dances', ['Waltz','Tango','Salsa','Ballet','Foxtrot','Polka','Samba','Rumba']],
  ['Cloud types', ['Cirrus','Cumulus','Stratus','Nimbus','Altocumulus','Altostratus','Cirrostratus','Cumulonimbus']],
  ['Things with keys', ['Piano','Lock','Map','Keyboard','Answer sheet','Car ignition','Hotel door','Safe']],
  ['Things with rings', ['Saturn','Tree trunk','Onion','Telephone','Wedding ceremony','Boxing arena','Binder','Bullseye']],
  ['Things with hands', ['Clock','Watch','Person','Robot','Doll','Compass watch','Stopwatch','Mannequin']],
  ['Things with a face', ['Clock','Die','Coin','Person','Mountain','Playing card','Watch','Building']],
  ['Things with a head', ['Nail','Hammer','Person','Cabbage','Match','Screw','Drum','Toothbrush']],
  ['Things with a tongue', ['Shoe','Person','Bell','Belt buckle','Snake','Dog','Cat','Flute player']],
];
function combinations<T>(items: T[], size: number): T[][] {
  if (!size) return [[]];
  return items.flatMap((item, i) => combinations(items.slice(i + 1), size - 1).map(rest => [item, ...rest]));
}
const threadCombos = groups.map(([answer, words]) => combinations(words, 5).map(clues => ({ clues, answer, aliases: [answer, answer.replace(/s$/, '')], explain: `The connection is ${answer.toLowerCase()}: all five clues fit that category.` })));
catalog['category'] = Array.from({ length: COUNT }, (_, i) => ({ number: i + 1, difficulty: difficulty(i), seed: i + 1, puzzle: threadCombos[i % groups.length]?.[Math.floor(i / groups.length)] }));

// Human-authored vocabulary and definitions; enumerate genuinely different five-word chains.
const vocabulary: Record<string, string> = {
  COLD:'Opposite of hot', CORD:'A thick string', CARD:'A greeting or playing ___', WARD:'A hospital division', WARM:'Pleasantly hot',
  WORD:'A unit of language', WORE:'Past tense of wear', WORM:'A wriggling soil animal', WORK:'A job or labour', FORK:'A pronged eating utensil', FORM:'A document to fill in', FARM:'Land used for crops', FARE:'A bus ticket cost', FIRE:'Flames and heat', FIRM:'Not easily bent', FOAM:'A mass of small bubbles',
  HEAD:'Body part above the neck', HEAL:'Recover from injury', HEAT:'Warmth', HEAP:'A pile', HEAR:'Perceive sound', TEAL:'A blue-green colour', TELL:'Say or inform', TALL:'Having great height', TAIL:'An animal appendage', HAIL:'Frozen rain pellets', FAIL:'Not succeed', FALL:'Drop downward', WALL:'A room divider', WALK:'Move on foot', TALK:'Speak', CALL:'Contact by phone', BALL:'A round toy', BELL:'It rings', BELT:'Holds trousers up', MELT:'Turn into liquid', MALT:'Germinated grain used in brewing', SALT:'A common seasoning', SALE:'An event with reduced prices', SAIL:'Travel by wind on water', MAIL:'Letters delivered to you', MAIN:'Principal or most important', PAIN:'Physical suffering', PAIR:'A set of two', HAIR:'Strands growing on the scalp', FAIR:'Just and impartial',
  SAND:'Grains on a beach', HAND:'Body part with fingers', HARD:'Not soft', HERD:'A group of cattle', HERO:'A courageous person', HERE:'In this place', HARE:'A long-eared animal', HATE:'Strongly dislike', LATE:'Not on time', LACE:'Delicate patterned fabric', LACK:'A shortage', LOCK:'Secure a door', LICK:'Touch with the tongue', LIKE:'Find agreeable', BIKE:'A two-wheeled vehicle', HIKE:'A long outdoor walk', HIVE:'A home for bees', LIVE:'Be alive', GIVE:'Hand something to another', DIVE:'Plunge into water', FIVE:'The number after four', FINE:'Of high quality', LINE:'A straight mark', MINE:'A place to extract ore', NINE:'The number before ten', WINE:'A fermented grape drink', PINE:'An evergreen tree', PINK:'A pale reddish colour', SINK:'A basin with a drain', SILK:'A fabric made by silkworms', MILK:'A dairy drink', MILD:'Not severe', WILD:'Untamed', WIND:'Moving air', WINS:'Victories', TINS:'Metal containers', TIES:'Knotted neckwear', TIDE:'The rise and fall of the sea', SIDE:'A lateral surface', RIDE:'Travel on a vehicle', WIDE:'Broad from side to side', WISE:'Having good judgment', RISE:'Move upward', ROSE:'A flower with thorns', ROLE:'A part played by an actor', ROLL:'Turn over and over', POLL:'A survey of opinions', POOL:'A place for swimming', COOL:'Not warm', COOK:'Prepare food with heat', BOOK:'A bound collection of pages', BOOT:'Footwear covering the ankle', ROOT:'The underground part of a plant', ROOF:'The top covering of a building', ROOM:'A space inside a building', BOOM:'A loud deep sound', LOOM:'A machine for weaving', LOOK:'Direct your eyes', TOOK:'Past tense of take', TOOL:'An implement for a job', WOOL:'Fibre from sheep', WOOD:'Material from trees', GOOD:'Of positive quality', FOOD:'What we eat', FOOT:'Body part below the ankle', FORT:'A defensive stronghold', PORT:'A harbour', SORT:'Arrange into groups', SOFT:'Not hard', LOFT:'A room beneath a roof', LEFT:'Opposite of right', LIFT:'Raise upward', LIST:'An ordered set of items', LOST:'Unable to find the way', LAST:'Final in a sequence', FAST:'Moving quickly', CAST:'Actors in a production', COST:'Price to pay', COAT:'An outer garment', BOAT:'A small watercraft', GOAT:'A horned farm animal', GOAL:'An objective', COAL:'A black fuel', LOAD:'A quantity carried', ROAD:'A route for vehicles', TOAD:'A squat amphibian', TOLD:'Past tense of tell', GOLD:'A precious yellow metal', BOLD:'Brave and confident', SOLD:'Past tense of sell', HOLD:'Keep in your grasp', HOLE:'An opening', POLE:'A long thin rod', PALE:'Light in colour', PAGE:'A sheet in a book', CAGE:'An enclosure with bars', CAKE:'A baked sweet treat', TAKE:'Obtain or carry away', LAKE:'An inland body of water', MAKE:'Create', MALE:'Opposite of female', MATE:'A companion', DATE:'A calendar day', GATE:'A movable fence entrance', RATE:'An amount per unit', RARE:'Uncommon', BARE:'Uncovered', CARE:'Look after', CORE:'The central part', MORE:'A greater amount', SORE:'Painful to touch', STORE:'A shop',
};
const words = Object.keys(vocabulary).filter(w => w.length === 4);
const neighbours = new Map(words.map(w => [w, words.filter(v => oneLetterApart(w, v))]));
const chains: string[][] = LADDERS.map(q => q.words);
const chainKeys = new Set(chains.map(q => [...q].sort().join('|')));
function explore(path: string[], limit: number) {
  if (chains.length >= limit) return;
  if (path.length === 5) {
    const key = [...path].sort().join('|');
    if (!chainKeys.has(key)) { chainKeys.add(key); chains.push([...path]); } return;
  }
  for (const w of neighbours.get(path.at(-1) ?? '') ?? []) {
    if (!path.includes(w)) explore([...path, w], limit);
    if (chains.length >= limit) break;
  }
}
// Rotate starting words so the library is not dominated by one starting word.
for (let pass = 0; chains.length < COUNT && pass < 50; pass++) {
  for (const w of words) {
    const before = chains.length;
    const list = neighbours.get(w) ?? [];
    const next = list[pass % Math.max(1, list.length)];
    if (next) explore([w, next], Math.min(COUNT, before + 3));
    if (chains.length >= COUNT) break;
    if (before === chains.length && pass === 49) throw new Error('Insufficient ladders');
  }
}
catalog['ladder'] = chains.slice(0, COUNT).map((chain, i) => ({ number: i + 1, difficulty: difficulty(i), seed: i + 1, puzzle: { words: chain, clues: chain.map(w => vocabulary[w] ?? LADDERS.flatMap(q => q.words.map((v, j) => [v, q.clues[j]])).find(pair => pair[0] === w)?.[1] ?? w), endClue: 'Use the end clues to complete the top and bottom rungs.' } }));

const trailThemes: [string, string[]][] = [
  ['In the garden',['ROSE','LEAF','SEED','TREE','ROOT','SOIL','VINE','FERN']],
  ['Weather watch',['RAIN','SNOW','WIND','HAIL','MIST','HEAT','GALE','COLD']],
  ['On the menu',['RICE','SOUP','CORN','CAKE','PEAR','PLUM','TUNA','BEAN']],
  ['Animal life',['BEAR','LION','WOLF','DEER','HARE','MOLE','TOAD','GOAT']],
  ['At home',['DOOR','LAMP','DESK','SOFA','ROOF','WALL','GATE','ROOM']],
  ['Making music',['SONG','BEAT','TUNE','NOTE','BASS','HARP','DRUM','OBOE']],
  ['On the move',['WALK','RIDE','SAIL','HIKE','SWIM','JUMP','DASH','ROLL']],
  ['Colours',['BLUE','PINK','GOLD','CYAN','TEAL','LIME','JADE','RUBY']],
];
const trailCombos = trailThemes.map(([theme, pool]) => combinations(pool, 4).map(words => ({ theme, words })));
catalog['wordtrail'] = Array.from({ length: COUNT }, (_, i) => {
  const q = trailCombos[i % trailThemes.length]?.[Math.floor(i / trailThemes.length)];
  if (!q) throw new Error('Missing word trail');
  const path = fullPath(4, i + 4001); const grid = Array<string>(16).fill('');
  [...q.words.join('')].forEach((letter, j) => { const cell = path[j]; if (cell === undefined) throw new Error('Missing cell'); grid[cell] = letter; });
  return { number: i + 1, difficulty: difficulty(i), seed: i + 4001, puzzle: { ...q, path, grid } };
});

function question(game: string, i: number, k: number) {
  const x = i * 4 + k + 1; const a = 12 + x; const b = 4 + x % 13;
  const base = { id: `${game}-${i + 1}-${k + 1}`, tip: 'Check the assumptions and work through the evidence before choosing.' };
  if (game === 'deduce') {
    const names = ['Ari','Bea','Cal','Dee','Eli']; const count = 4 + x % 12;
    const templates = [
      { prompt: `${names[x % 5]} is ${b} places ahead of ${names[(x + 1) % 5]} in a queue of ${a} people. The latter is in position ${b + 3}. What position is the former?`, options:['3',String(b + 3),String(2 * b + 3),'Cannot tell'], answer:0, explain:`Being ${b} places ahead means subtracting ${b}: ${b + 3} − ${b} = 3.` },
      { prompt:`There are ${a} tokens. Each box holds exactly ${b} tokens. What is the minimum number of boxes needed?`, options:[String(Math.ceil(a / b)),String(Math.ceil(a / b) + 1),String(Math.max(0, Math.ceil(a / b) - 1)),String(a * b)], answer:0, explain:`Divide ${a} by ${b}, then round up because any remaining tokens need another box.` },
      { prompt:`${count} people each shake hands with every other person once. How many handshakes happen?`, options:[String(count * (count - 1) / 2),String(count * (count - 1)),String(count * count),String(count - 1)], answer:0, explain:`There are ${count} × ${count - 1} pairings if counted from each person, but each handshake is counted twice. Divide by two.` },
      { prompt:`A code uses two digits from 0 to 9. Its digits sum to ${5 + x % 5}. The first digit is ${1 + x % 3}. What is its second digit?`, options:[String(4 + x % 5 - x % 3),String(6 + x % 5 + x % 3),'0','9'], answer:0, explain:`Subtract the first digit from the sum: ${5 + x % 5} − ${1 + x % 3} = ${4 + x % 5 - x % 3}.` },
      { prompt:`All ${a} members of group A have a badge. Sam has no badge. Which follows?`, options:['Sam is not in group A','Sam is in group A','Sam belongs to group B',`Sam has ${b} badges`], answer:0, explain:'Membership implies a badge. No badge rules out membership, but tells us nothing about another group.' },
      { prompt:`A plant doubles its covered area each day and fills a pond on day ${a}. On what day was the pond half full?`, options:[String(a - 1),String(a / 2),String(a - 2),String(a + 1)], answer:0, explain:`One doubling before full coverage is half coverage, so day ${a - 1}.` },
    ]; return { ...base, ...templates[x % templates.length] };
  }
  if (game === 'data') {
    const n = 100 + x * 10; const v = 2 + x % 18;
    const templates = [
      { context:`Conversion rose from ${v}% to ${v + 2}%.`, prompt:'What is the absolute change?', options:['2 percentage points',`${v + 2} percentage points`,'2% relative increase','It doubled'], answer:0, explain:`${v + 2} − ${v} = 2 percentage points. A relative increase uses the starting rate as denominator.` },
      { context:`A survey of ${n} newsletter subscribers says ${70 + x % 25}% love the product.`, prompt:'What most limits generalising this result to all customers?', options:['Subscribers are a self-selected sample','The percentage is too high','Surveys never work','Newsletter readers are random customers'], answer:0, explain:'People who subscribe may differ from customers who do not, including those who left.' },
      { context:`Sales rose from ${n} to ${n + 20} units after a redesign. No control group was used.`, prompt:'What conclusion is supported?', options:['Sales rose, but the redesign is not established as the cause','The redesign definitely caused all the growth','The redesign had no effect','Seasonality definitely caused the growth'], answer:0, explain:'The before/after numbers establish a change, not which factor caused it.' },
      { context:`${v}% of cases are positive. A classifier predicts negative for every case.`, prompt:'What accuracy would that baseline achieve?', options:[`${100 - v}%`,`${v}%`,'100%','0%'], answer:0, explain:`It gets all ${100 - v}% negative cases right and misses all positive cases. Accuracy alone can hide poor positive detection.` },
      { context:`A revenue bar chart compares ${n} and ${n + 10}. Its vertical axis begins at ${n - 2}.`, prompt:'What should you watch for?', options:['The shortened baseline exaggerates the visual change','A higher second value proves fraud','Revenue cannot be plotted','The values are identical'], answer:0, explain:'The bars visually represent 2 and 12 units above the baseline, even though the actual values differ by only 10.' },
      { context:`Among ${n} salaries, one executive earns ${n} times the typical salary.`, prompt:'Which statistic better describes the typical employee?', options:['Median','Maximum','Sum','Mean'], answer:0, explain:'An extreme outlier pulls the mean upward much more than it affects the median.' },
    ]; return { ...base, ...templates[x % templates.length] };
  }
  const days = 15 + x; const revenue = 100 + x;
  const templates = [
    { context:`AI says: "Revenue rose from ${revenue} to ${revenue + 10}; that is a 10% increase."`, prompt:'What calculation should verify the percentage?', options:[`10 ÷ ${revenue} × 100`,`10 ÷ ${revenue + 10} × 100`,`${revenue} ÷ 10 × 100`,'No calculation is needed'], answer:0, explain:'Relative growth divides the change by the original value, not the new value or the difference.' },
    { context:`AI says: "You can cancel immediately." The agreement requires ${days} days of notice.`, prompt:'What went wrong?', options:['A condition was omitted','The notice period was respected','An arithmetic error only','Nothing important'], answer:0, explain:`Omitting ${days} days of notice changes the meaning. Check the original clause before deciding.` },
    { context:`AI cites "The ${2020 + x % 7} Workplace Study", with an exact page number but no link.`, prompt:'What is the best next step?', options:['Locate and read the actual source','Trust the page number','Ask it to sound more confident','Use the citation without checking'], answer:0, explain:'A detailed-looking citation can still be invented. Confirm that the source exists and supports the claim.' },
    { context:`AI says a ${vSafe(x)}% drop in signups was caused by a button colour changed last week.`, prompt:'What evidence is missing?', options:['A test isolating the button change','The name of the colour','A stronger confidence statement','An instruction to redesign everything'], answer:0, explain:'Timing alone does not establish cause. Traffic mix, seasonality, and other changes need to be ruled out.' },
    { context:`AI recommends removing product ${x}, because it has the lowest revenue.`, prompt:'What must you check before acting?', options:['Profit margin and effects on other products','Only its revenue rank','Whether the AI repeats itself','Whether its name is short'], answer:0, explain:'Revenue is not profit. A low-revenue item may have high margins or help other items sell.' },
    { context:`AI says it is ${80 + x % 20}% confident that plan ${x} will succeed.`, prompt:'How should you treat that percentage?', options:['As uncalibrated language unless validated','As measured probability automatically','As proof of success','As proof of failure'], answer:0, explain:'Model-generated confidence wording is not automatically a calibrated forecast. Look for independent evidence.' },
  ]; return { ...base, ...templates[x % templates.length] };
}
function vSafe(x: number) { return 5 + x % 25; }
for (const game of ['deduce','data','aicheck']) catalog[game] = Array.from({ length: COUNT }, (_, i) => ({ number:i + 1, difficulty:difficulty(i), seed:i + 1, questions:Array.from({ length:4 }, (_, k) => {
  const q = question(game, i, k); const shift = (i + k) % 4;
  const unique = [...new Set(q.options)];
  for (let distractor = 10; unique.length < 4; distractor++) if (!unique.includes(String(distractor))) unique.push(String(distractor));
  const options = [...unique.slice(shift), ...unique.slice(0, shift)];
  return { ...q, options, answer:(4 - shift) % 4 };
}) }));
mkdirSync('src/lib/levels', { recursive: true });
for (const [game, levels] of Object.entries(catalog)) writeFileSync(`src/lib/levels/${game}.json`, JSON.stringify(levels));
console.log(Object.fromEntries(Object.entries(catalog).map(([game, levels]) => [game, levels.length])));