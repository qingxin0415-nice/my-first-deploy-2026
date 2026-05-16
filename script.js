const quotes = {
  toxic: [
    "你以为有钱人很快乐吗？他们的快乐你根本想象不到。",
    "只要你坚持，没有什么事是搞不砸的。",
    "加油，你是最胖的。",
    "有时候你不努力一下，都不知道什么叫绝望。",
    "别灰心，人生就是这样起起落落落落落落落。",
    "世上无难事，只要肯放弃。",
    "比你有钱的人还比你努力，那你努力还有什么用。",
    "生活不止眼前的苟且，还有明天的苟且和后天的苟且。",
    "失败是成功之母，但成功经常难产。",
    "不要看脸，要看内涵。但你没有内涵，所以还是看脸吧。",
    "每当你觉得自己又丑又穷的时候，不要悲伤，至少你的判断是对的。",
    "努力不一定成功，但不努力一定会很轻松。",
    "上帝为你关上一扇门，还会顺手把窗户也带上。",
    "如果你觉得累，说明你在走上坡路。但你可能只是太胖了。",
    "哪有什么岁月静好，只是你懒得去拼。",
    "生活就像心电图，一帆风顺就说明你挂了。",
    "你以为自己是千里马，其实你只是头驴。",
    "在这个看脸的世界里，你成功地把自己活成了一个笑话。",
    "别人是祖国的花朵，你是树上的一片叶子——迟早要掉。",
    "你的工资条就像大姨妈，一个月来一次，一次疼一周。",
    "明明可以靠脸吃饭，你却要靠才华——可惜你两个都没有。",
    "不要总觉得自己是主角，你通常只是个背景板。",
    "别说什么莫欺少年穷，等你老了也一样穷。",
    "你的人生就像一个茶几，上面摆满了杯具。",
    "失败并不可怕，可怕的是你还相信这句话。",
    "只要熬过了这段最难熬的日子，你会发现更难熬的还在后面。",
    "别低头，皇冠会掉。别流泪，坏人会笑。——但你既没有皇冠，也装什么装。",
    "你长得这么漂亮，一定有很多人追你吧。——可惜追你的只有你的影子。",
    "现在过的每一天，都是余生中最年轻的一天。——但也可能更穷。",
    "生活不止眼前的苟且，还有前任的喜帖。",
  ],
  inspire: [
    "种一棵树最好的时间是十年前，其次是现在。",
    "千里之行，始于足下。",
    "天行健，君子以自强不息。",
    "宝剑锋从磨砺出，梅花香自苦寒来。",
    "长风破浪会有时，直挂云帆济沧海。",
    "会当凌绝顶，一览众山小。",
    "天生我材必有用。",
    "不经一番寒彻骨，怎得梅花扑鼻香。",
    "路漫漫其修远兮，吾将上下而求索。",
    "人生能有几回搏，此时不搏何时搏。",
    "山重水复疑无路，柳暗花明又一村。",
    "沉舟侧畔千帆过，病树前头万木春。",
    "莫愁前路无知己，天下谁人不识君。",
    "海内存知己，天涯若比邻。",
    "志当存高远。",
    "业精于勤，荒于嬉。",
    "书山有路勤为径，学海无涯苦作舟。",
    "吃得苦中苦，方为人上人。",
    "少壮不努力，老大徒伤悲。",
    "只要功夫深，铁杵磨成针。",
    "古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。",
    "天将降大任于斯人也，必先苦其心志，劳其筋骨。",
    "老当益壮，宁移白首之心？穷且益坚，不坠青云之志。",
    "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。",
    "回首向来萧瑟处，归去，也无风雨也无晴。",
    "人生如逆旅，我亦是行人。",
    "博观而约取，厚积而薄发。",
    "不飞则已，一飞冲天；不鸣则已，一鸣惊人。",
    "千淘万漉虽辛苦，吹尽狂沙始到金。",
    "雄关漫道真如铁，而今迈步从头越。",
    "大鹏一日同风起，扶摇直上九万里。",
    "仰天大笑出门去，我辈岂是蓬蒿人。",
  ],
};

const TAB_CONFIG = [
  { id: 'toxic', label: '🧪 毒鸡汤', cls: '' },
  { id: 'inspire', label: '✨ 励志名言', cls: '' },
  { id: 'all', label: '🎲 混合随机', cls: '' },
  { id: 'ai', label: '🤖 AI 生成', cls: 'tab-ai' },
];

const tabContainer = document.getElementById('tabContainer');
const quoteText = document.getElementById('quoteText');
const nextBtn = document.getElementById('nextBtn');
const copyBtn = document.getElementById('copyBtn');
const badge = document.getElementById('badge');
const card = document.getElementById('quoteCard');
const loadingSpinner = document.getElementById('loadingSpinner');
const sourceInfo = document.getElementById('sourceInfo');
const themeArea = document.getElementById('themeArea');
const themeInput = document.getElementById('themeInput');
const themeClear = document.getElementById('themeClear');
const themeTags = document.getElementById('themeTags');

let currentCategory = 'toxic';
let lastQuote = '';
let isAnimating = false;

TAB_CONFIG.forEach(cfg => {
  const btn = document.createElement('button');
  btn.className = 'tab' + (cfg.cls ? ' ' + cfg.cls : '');
  btn.dataset.category = cfg.id;
  btn.textContent = cfg.label;
  tabContainer.appendChild(btn);
});

const tabs = document.querySelectorAll('.tab');

function getRandomQuote(category) {
  let pool;
  if (category === 'all') {
    pool = [...quotes.toxic, ...quotes.inspire];
  } else {
    pool = quotes[category] || quotes.toxic;
  }
  let quote;
  do {
    quote = pool[Math.floor(Math.random() * pool.length)];
  } while (quote === lastQuote && pool.length > 1);
  lastQuote = quote;
  return quote;
}

function getCategoryForQuote(text) {
  if (quotes.toxic.includes(text)) return 'toxic';
  if (quotes.inspire.includes(text)) return 'inspire';
  return 'all';
}

function updateBadge(category, quoteTheme) {
  if (category === 'ai') {
    if (quoteTheme) {
      badge.textContent = `🤖 ${quoteTheme}`;
    } else {
      badge.textContent = '🤖 AI 生成';
    }
    card.className = 'card badge-ai';
    return;
  }
  const cat = category === 'all' ? getCategoryForQuote(quote) : category;
  if (cat === 'toxic') {
    badge.textContent = '🧪 毒鸡汤';
    card.className = 'card badge-toxic';
  } else {
    badge.textContent = '✨ 励志名言';
    card.className = 'card badge-inspire';
  }
}

function updateSource(source, theme) {
  if (source === 'ai') {
    sourceInfo.textContent = theme ? `🤖 AI · 主题：${theme}` : '🤖 由 AI 实时生成';
    sourceInfo.className = 'source-info ai';
  } else {
    sourceInfo.textContent = '📖 本地词库';
    sourceInfo.className = 'source-info';
  }
}

function setLoading(loading) {
  if (loading) {
    loadingSpinner.classList.add('show');
    quoteText.style.opacity = '0';
    nextBtn.classList.add('loading');
    nextBtn.innerHTML = '<span class="btn-icon">⏳</span> 生成中';
  } else {
    loadingSpinner.classList.remove('show');
    quoteText.style.opacity = '1';
    nextBtn.classList.remove('loading');
    nextBtn.innerHTML = '<span class="btn-icon">🎲</span> 换一条';
  }
}

function toggleThemeArea(show) {
  if (show) {
    themeArea.classList.add('show');
  } else {
    themeArea.classList.remove('show');
  }
}

function getTheme() {
  const val = themeInput.value.trim();
  if (val) return val;
  const activeTag = document.querySelector('.theme-tag.active');
  return activeTag ? activeTag.dataset.theme : '';
}

function displayLocalQuote(category) {
  if (isAnimating) return;
  isAnimating = true;

  const text = getRandomQuote(category);

  quoteText.classList.remove('fade-in');
  quoteText.classList.add('fade-out');

  setTimeout(() => {
    quoteText.textContent = text;
    updateBadge(category);
    updateSource('local');
    quoteText.classList.remove('fade-out');
    quoteText.classList.add('fade-in');
    isAnimating = false;
  }, 250);
}

async function displayAiQuote() {
  if (isAnimating) return;
  isAnimating = true;

  const theme = getTheme() || '人生';

  setLoading(true);
  badge.textContent = `🤖 ${theme}`;
  card.className = 'card badge-ai';
  sourceInfo.className = 'source-info ai';
  sourceInfo.textContent = '⏳ AI 思考中...';

  try {
    const resp = await fetch(`/api/generate?category=toxic&theme=${encodeURIComponent(theme)}`, { method: 'GET' });
    const data = await resp.json();

    setLoading(false);
    quoteText.classList.remove('fade-in');
    quoteText.classList.add('fade-out');

    setTimeout(() => {
      quoteText.textContent = data.text;
      badge.textContent = `🤖 ${theme}`;
      card.className = 'card badge-ai';
      updateSource(data.source === 'ai' ? 'ai' : 'local', theme);
      quoteText.classList.remove('fade-out');
      quoteText.classList.add('fade-in');
      isAnimating = false;
    }, 250);
  } catch {
    setLoading(false);
    const text = getRandomQuote('toxic');
    setTimeout(() => {
      quoteText.textContent = text;
      badge.textContent = '🧪 毒鸡汤';
      card.className = 'card badge-toxic';
      updateSource('local');
      quoteText.classList.remove('fade-out');
      quoteText.classList.add('fade-in');
      isAnimating = false;
    }, 250);
  }
}

function displayQuote(category) {
  if (category === 'ai') {
    displayAiQuote();
  } else {
    displayLocalQuote(category);
  }
}

function setActiveTab(category) {
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });
  toggleThemeArea(category === 'ai');
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const cat = tab.dataset.category;
    if (cat === currentCategory) return;
    if (isAnimating) return;
    currentCategory = cat;
    setActiveTab(cat);
    displayQuote(cat);
  });
});

nextBtn.addEventListener('click', () => {
  displayQuote(currentCategory);
});

copyBtn.addEventListener('click', async () => {
  const text = quoteText.textContent;
  try {
    await navigator.clipboard.writeText(text);
    showToast('✅ 已复制到剪贴板');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✅ 已复制到剪贴板');
  }
});

themeInput.addEventListener('input', () => {
  themeClear.classList.toggle('show', themeInput.value.length > 0);
  document.querySelectorAll('.theme-tag').forEach(t => t.classList.remove('active'));
});

themeClear.addEventListener('click', () => {
  themeInput.value = '';
  themeClear.classList.remove('show');
  themeInput.focus();
});

themeTags.addEventListener('click', e => {
  const tag = e.target.closest('.theme-tag');
  if (!tag) return;
  document.querySelectorAll('.theme-tag').forEach(t => t.classList.remove('active'));
  tag.classList.add('active');
  themeInput.value = '';
  themeClear.classList.remove('show');
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2000);
}

setActiveTab('toxic');
displayQuote('toxic');
