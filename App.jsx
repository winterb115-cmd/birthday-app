
// ─── DATA ───────────────────────────────────────────────
const AGENCIES = [
  { id:'AG001', name:'Star Maker Production', unitIds:['UN001','UN002','UN003','UN004'] },
  { id:'AG002', name:'Cosmic Production', unitIds:['UN005','UN006','UN007','UN008'] },
  { id:'AG003', name:'Rhythm Link', unitIds:['UN009','UN010','UN011','UN012'] },
  { id:'AG004', name:'New Dimention', unitIds:['UN013','UN014','UN015','UN016'] },
  { id:'AG005', name:'Other', unitIds:['UN017','UN018'] },
];

const UNITS = [
  { id:'UN001', name:'fine', agencyId:'AG001', characterIds:['CH001','CH002','CH003','CH004'] },
  { id:'UN002', name:'Trickstar', agencyId:'AG001', characterIds:['CH005','CH006','CH007','CH008'] },
  { id:'UN003', name:'유성대', agencyId:'AG001', characterIds:['CH009','CH010','CH011','CH012','CH013'] },
  { id:'UN004', name:'ALKALOID', agencyId:'AG001', characterIds:['CH014','CH015','CH016','CH017'] },
  { id:'UN005', name:'Eden', agencyId:'AG002', characterIds:['CH018','CH019','CH020','CH021'] },
  { id:'UN006', name:'Valkyrie', agencyId:'AG002', characterIds:['CH022','CH023'] },
  { id:'UN007', name:'2wink', agencyId:'AG002', characterIds:['CH024','CH025'] },
  { id:'UN008', name:'Crazy:B', agencyId:'AG002', characterIds:['CH026','CH027','CH028','CH029'] },
  { id:'UN009', name:'UNDEAD', agencyId:'AG003', characterIds:['CH030','CH031','CH032','CH033'] },
  { id:'UN010', name:'Ra*bits', agencyId:'AG003', characterIds:['CH034','CH035','CH036','CH037'] },
  { id:'UN011', name:'홍월', agencyId:'AG003', characterIds:['CH038','CH039','CH040','CH041'] },
  { id:'UN012', name:'MELLOW DEAR US', agencyId:'AG003', characterIds:['CH042','CH043','CH044','CH045'] },
  { id:'UN013', name:'Knights', agencyId:'AG004', characterIds:['CH046','CH047','CH048','CH049','CH050'] },
  { id:'UN014', name:'Switch', agencyId:'AG004', characterIds:['CH051','CH052','CH053'] },
  { id:'UN015', name:'MaM', agencyId:'AG004', characterIds:['CH054'] },
  { id:'UN016', name:'Special for Princess!', agencyId:'AG004', characterIds:['CH055','CH056','CH057','CH058'] },
  { id:'UN017', name:'teacher', agencyId:'AG005', characterIds:['CH059','CH060'] },
  { id:'UN018', name:'producer', agencyId:'AG005', characterIds:['CH061'] },
];

const CHARACTERS = [
  { id:'CH001', name:'텐쇼인 에이치', birthday:{month:1,day:10}, agencyId:'AG001', unitId:'UN001' },
  { id:'CH002', name:'히비키 와타루', birthday:{month:2,day:21}, agencyId:'AG001', unitId:'UN001' },
  { id:'CH003', name:'히메미야 토리', birthday:{month:1,day:13}, agencyId:'AG001', unitId:'UN001' },
  { id:'CH004', name:'후시미 유즈루', birthday:{month:10,day:18}, agencyId:'AG001', unitId:'UN001' },
  { id:'CH005', name:'히다카 호쿠토', birthday:{month:12,day:17}, agencyId:'AG001', unitId:'UN002' },
  { id:'CH006', name:'아케호시 스바루', birthday:{month:6,day:22}, agencyId:'AG001', unitId:'UN002' },
  { id:'CH007', name:'유우키 마코토', birthday:{month:4,day:30}, agencyId:'AG001', unitId:'UN002' },
  { id:'CH008', name:'이사라 마오', birthday:{month:3,day:16}, agencyId:'AG001', unitId:'UN002' },
  { id:'CH009', name:'냐구모 테토라', birthday:{month:6,day:15}, agencyId:'AG001', unitId:'UN003' },
  { id:'CH010', name:'타카미네 미도리', birthday:{month:8,day:29}, agencyId:'AG001', unitId:'UN003' },
  { id:'CH011', name:'센고쿠 시노부', birthday:{month:6,day:9}, agencyId:'AG001', unitId:'UN003' },
  { id:'CH012', name:'모리사와 치아키', birthday:{month:9,day:18}, agencyId:'AG001', unitId:'UN003' },
  { id:'CH013', name:'신카이 카나타', birthday:{month:8,day:30}, agencyId:'AG001', unitId:'UN003' },
  { id:'CH014', name:'아마기 히이로', birthday:{month:1,day:4}, agencyId:'AG001', unitId:'UN004' },
  { id:'CH015', name:'시라토리 아이라', birthday:{month:11,day:27}, agencyId:'AG001', unitId:'UN004' },
  { id:'CH016', name:'아야세 마요이', birthday:{month:6,day:6}, agencyId:'AG001', unitId:'UN004' },
  { id:'CH017', name:'카제하야 타츠미', birthday:{month:12,day:28}, agencyId:'AG001', unitId:'UN004' },
  { id:'CH018', name:'란 나기사', birthday:{month:10,day:27}, agencyId:'AG002', unitId:'UN005' },
  { id:'CH019', name:'토모에 히요리', birthday:{month:7,day:24}, agencyId:'AG002', unitId:'UN005' },
  { id:'CH020', name:'사에구사 이바라', birthday:{month:11,day:14}, agencyId:'AG002', unitId:'UN005' },
  { id:'CH021', name:'사자나미 쥰', birthday:{month:8,day:16}, agencyId:'AG002', unitId:'UN005' },
  { id:'CH022', name:'이츠키 슈', birthday:{month:10,day:30}, agencyId:'AG002', unitId:'UN006' },
  { id:'CH023', name:'카게히라 미카', birthday:{month:12,day:26}, agencyId:'AG002', unitId:'UN006' },
  { id:'CH024', name:'아오이 히나타', birthday:{month:3,day:5}, agencyId:'AG002', unitId:'UN007' },
  { id:'CH025', name:'아오이 유우타', birthday:{month:3,day:5}, agencyId:'AG002', unitId:'UN007' },
  { id:'CH026', name:'아마기 린네', birthday:{month:5,day:18}, agencyId:'AG002', unitId:'UN008' },
  { id:'CH027', name:'HiMERU', birthday:{month:7,day:7}, agencyId:'AG002', unitId:'UN008' },
  { id:'CH028', name:'오우카와 코하쿠', birthday:{month:2,day:5}, agencyId:'AG002', unitId:'UN008' },
  { id:'CH029', name:'시이나 니키', birthday:{month:10,day:5}, agencyId:'AG002', unitId:'UN008' },
  { id:'CH030', name:'사쿠마 레이', birthday:{month:11,day:2}, agencyId:'AG003', unitId:'UN009' },
  { id:'CH031', name:'하카제 카오루', birthday:{month:11,day:3}, agencyId:'AG003', unitId:'UN009' },
  { id:'CH032', name:'오오가미 코가', birthday:{month:7,day:18}, agencyId:'AG003', unitId:'UN009' },
  { id:'CH033', name:'오토가리 아도니스', birthday:{month:8,day:29}, agencyId:'AG003', unitId:'UN009' },
  { id:'CH034', name:'마시로 토모야', birthday:{month:3,day:29}, agencyId:'AG003', unitId:'UN010' },
  { id:'CH035', name:'니토 나즈나', birthday:{month:4,day:27}, agencyId:'AG003', unitId:'UN010' },
  { id:'CH036', name:'텐마 미츠루', birthday:{month:9,day:7}, agencyId:'AG003', unitId:'UN010' },
  { id:'CH037', name:'시노 하지메', birthday:{month:7,day:15}, agencyId:'AG003', unitId:'UN010' },
  { id:'CH038', name:'하스미 케이토', birthday:{month:9,day:6}, agencyId:'AG003', unitId:'UN011' },
  { id:'CH039', name:'키류 쿠로', birthday:{month:1,day:26}, agencyId:'AG003', unitId:'UN011' },
  { id:'CH040', name:'칸자키 소마', birthday:{month:4,day:20}, agencyId:'AG003', unitId:'UN011' },
  { id:'CH041', name:'타키 이부키', birthday:{month:1,day:21}, agencyId:'AG003', unitId:'UN011' },
  { id:'CH042', name:'코지카 쥬이스', birthday:{month:8,day:5}, agencyId:'AG003', unitId:'UN012' },
  { id:'CH043', name:'마도카 노조미', birthday:{month:6,day:20}, agencyId:'AG003', unitId:'UN012' },
  { id:'CH044', name:'쿠온 마슈', birthday:{month:12,day:14}, agencyId:'AG003', unitId:'UN012' },
  { id:'CH045', name:'츠즈라 치토세', birthday:{month:11,day:19}, agencyId:'AG003', unitId:'UN012' },
  { id:'CH046', name:'스오우 츠카사', birthday:{month:4,day:6}, agencyId:'AG004', unitId:'UN013' },
  { id:'CH047', name:'츠키나가 레오', birthday:{month:5,day:5}, agencyId:'AG004', unitId:'UN013' },
  { id:'CH048', name:'세나 이즈미', birthday:{month:11,day:2}, agencyId:'AG004', unitId:'UN013' },
  { id:'CH049', name:'사쿠마 리츠', birthday:{month:9,day:22}, agencyId:'AG004', unitId:'UN013' },
  { id:'CH050', name:'나루카미 아라시', birthday:{month:3,day:3}, agencyId:'AG004', unitId:'UN013' },
  { id:'CH051', name:'사카사키 나츠메', birthday:{month:2,day:4}, agencyId:'AG004', unitId:'UN014' },
  { id:'CH052', name:'아오바 츠무기', birthday:{month:8,day:7}, agencyId:'AG004', unitId:'UN014' },
  { id:'CH053', name:'하루카와 소라', birthday:{month:7,day:1}, agencyId:'AG004', unitId:'UN014' },
  { id:'CH054', name:'미케지마 마다라', birthday:{month:5,day:16}, agencyId:'AG004', unitId:'UN015' },
  { id:'CH055', name:'에스', birthday:{month:9,day:12}, agencyId:'AG004', unitId:'UN016' },
  { id:'CH056', name:'칸나', birthday:{month:6,day:1}, agencyId:'AG004', unitId:'UN016' },
  { id:'CH057', name:'유메', birthday:{month:12,day:2}, agencyId:'AG004', unitId:'UN016' },
  { id:'CH058', name:'라이카', birthday:{month:5,day:22}, agencyId:'AG004', unitId:'UN016' },
  { id:'CH059', name:'사가미 진', birthday:{month:12,day:11}, agencyId:'AG005', unitId:'UN017' },
  { id:'CH060', name:'쿠누기 아키오미', birthday:{month:2,day:25}, agencyId:'AG005', unitId:'UN017' },
  { id:'CH061', name:'나이스 아르네브 선더', birthday:{month:9,day:3}, agencyId:'AG005', unitId:'UN018' },
];

// ─── UNIT COLORS ────────────────────────────────────────
const UNIT_COLORS = {
  UN001:'#FFD700', UN002:'#FF6B35', UN003:'#4CAF50', UN004:'#9C27B0',
  UN005:'#2196F3', UN006:'#E91E63', UN007:'#FF9800', UN008:'#F44336',
  UN009:'#673AB7', UN010:'#8BC34A', UN011:'#D32F2F', UN012:'#00BCD4',
  UN013:'#3F51B5', UN014:'#009688', UN015:'#795548', UN016:'#FF4081',
  UN017:'#607D8B', UN018:'#78909C',
};

const STAGES = ['7days','3days','1day','dday'];
const STAGE_LABELS = { '7days':'7', '3days':'3', '1day':'1', 'dday':'D' };
const STORAGE_KEY = 'birthday_notification_settings';

// ─── HELPERS ────────────────────────────────────────────
const pad = n => String(n).padStart(2,'0');
const today = new Date();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();

const getUnitColor = unitId => UNIT_COLORS[unitId] || '#888';
const getUnit = unitId => UNITS.find(u => u.id === unitId);
const getCharsByUnit = unitId => CHARACTERS.filter(c => c.unitId === unitId);

const getInitials = name => {
  const first = name.charAt(0);
  return first;
};

function initDefaults() {
  const s = {};
  CHARACTERS.forEach(c => { s[c.id] = { '7days':false, '3days':false, '1day':false, 'dday':true }; });
  return s;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initDefaults();
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object') return initDefaults();
    return parsed;
  } catch { return initDefaults(); }
}

function saveToStorage(settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
}

function computeUnitState(settings, unitId, stage) {
  const chars = getCharsByUnit(unitId);
  return chars.every(c => settings[c.id]?.[stage] === true);
}

// ─── CSS-IN-JS STYLES ───────────────────────────────────
const globalStyles = `
@keyframes rainbowBorder {
  0% { border-color: #ff0000; box-shadow: 0 0 20px #ff000066; }
  16% { border-color: #ff8800; box-shadow: 0 0 20px #ff880066; }
  33% { border-color: #ffff00; box-shadow: 0 0 20px #ffff0066; }
  50% { border-color: #00ff00; box-shadow: 0 0 20px #00ff0066; }
  66% { border-color: #0088ff; box-shadow: 0 0 20px #0088ff66; }
  83% { border-color: #8800ff; box-shadow: 0 0 20px #8800ff66; }
  100% { border-color: #ff0000; box-shadow: 0 0 20px #ff000066; }
}
@keyframes bounce {
  0% { transform: scale(1); }
  30% { transform: scale(0.85); }
  50% { transform: scale(1.15); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes sparkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
.bounce-click { animation: bounce 0.4s ease; }
.rainbow-border {
  border: 3px solid #ff0000;
  animation: rainbowBorder 3s linear infinite;
}
.fade-in { animation: fadeIn 0.4s ease-out forwards; }
.glass {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.3);
}
.glass-strong {
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.5);
}
.stage-bg {
  background:
    repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px),
    repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px),
    linear-gradient(135deg, #fce4ec 0%, #e8eaf6 25%, #e0f7fa 50%, #fff3e0 75%, #f3e5f5 100%);
  min-height: 100vh;
}
body { margin: 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; }
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
`;

// ─── TOGGLE BUTTON ──────────────────────────────────────
function ToggleBtn({ isOn, label, color, onClick }) {
  const [bouncing, setBouncing] = useState(false);
  const handleClick = () => {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
    onClick();
  };
  return (
    <button
      onClick={handleClick}
      className={bouncing ? 'bounce-click' : ''}
      style={{
        width: 38, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
        fontWeight: 700, fontSize: 13, transition: 'all 0.2s ease',
        color: isOn ? '#fff' : '#999',
        background: isOn ? color : '#e0e0e0',
        boxShadow: isOn ? `0 0 15px ${color}88, 0 2px 8px ${color}44` : '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {label}
    </button>
  );
}

// ─── STAGE TOGGLE ROW ───────────────────────────────────
function StageRow({ settings, charId, unitId, onToggle }) {
  const color = getUnitColor(unitId);
  return (
    <div style={{ display:'flex', gap:6 }}>
      {STAGES.map(stage => (
        <ToggleBtn
          key={stage}
          isOn={settings[charId]?.[stage] ?? false}
          label={STAGE_LABELS[stage]}
          color={color}
          onClick={() => onToggle(charId, stage)}
        />
      ))}
    </div>
  );
}

// ─── UNIT MASTER ROW ────────────────────────────────────
function UnitMasterRow({ settings, unitId, onUnitToggle }) {
  const color = getUnitColor(unitId);
  return (
    <div style={{ display:'flex', gap:6 }}>
      {STAGES.map(stage => (
        <ToggleBtn
          key={stage}
          isOn={computeUnitState(settings, unitId, stage)}
          label={STAGE_LABELS[stage]}
          color={color}
          onClick={() => onUnitToggle(unitId, stage)}
        />
      ))}
    </div>
  );
}

// ─── BIRTHDAY CARD (Dashboard) ──────────────────────────
function BirthdayCard({ char, isBirthdayToday }) {
  const unit = getUnit(char.unitId);
  const color = getUnitColor(char.unitId);
  const initial = getInitials(char.name);
  const daysLeft = (() => {
    const bd = new Date(today.getFullYear(), char.birthday.month - 1, char.birthday.day);
    if (bd < today && !(bd.getMonth() === today.getMonth() && bd.getDate() === today.getDate())) {
      bd.setFullYear(bd.getFullYear() + 1);
    }
    const diff = Math.ceil((bd - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
    return diff;
  })();

  return (
    <div
      className={`fade-in ${isBirthdayToday ? 'rainbow-border' : ''}`}
      style={{
        position:'relative', overflow:'hidden', borderRadius: 16, padding: 20,
        background: isBirthdayToday
          ? 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,240,245,0.9))'
          : 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        border: isBirthdayToday ? undefined : `1px solid rgba(255,255,255,0.5)`,
        boxShadow: isBirthdayToday
          ? undefined
          : `0 4px 20px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.3)`,
        marginBottom: 12,
      }}
    >
      {/* Background initial letter */}
      <div style={{
        position:'absolute', top:-10, right:-5, fontSize:120, fontWeight:900,
        color: color, opacity: 0.04, lineHeight:1, pointerEvents:'none', userSelect:'none',
      }}>
        {initial}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            {isBirthdayToday && <PartyPopper size={20} color="#ff4081" />}
            <span style={{ fontSize:18, fontWeight:700, color:'#333' }}>{char.name}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{
              fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20,
              background: `${color}22`, color: color, border:`1px solid ${color}44`,
            }}>
              {unit?.name}
            </span>
          </div>
          <div style={{ fontSize:14, color:'#666', marginTop:4 }}>
            <Cake size={14} style={{ display:'inline', verticalAlign:'middle', marginRight:4 }} />
            {char.birthday.month}월 {char.birthday.day}일
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          {isBirthdayToday ? (
            <div style={{
              fontSize:13, fontWeight:700, color:'#ff4081',
              background:'linear-gradient(135deg,#ff408122,#ff6b3522)',
              padding:'6px 14px', borderRadius:20,
            }}>
              🎂 오늘 생일!
            </div>
          ) : (
            <div style={{ fontSize:13, color:'#999' }}>
              D-{daysLeft}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────
function Dashboard() {
  const monthChars = useMemo(() =>
    CHARACTERS.filter(c => c.birthday.month === currentMonth)
      .sort((a,b) => a.birthday.day - b.birthday.day),
  []);

  const todayChars = monthChars.filter(c => c.birthday.day === currentDay);
  const otherChars = monthChars.filter(c => c.birthday.day !== currentDay);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
        <Sparkles size={28} color="#ff4081" />
        <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:'#333' }}>
          {currentMonth}월의 주인공
        </h1>
        <Sparkles size={28} color="#ff4081" />
      </div>

      {todayChars.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#ff4081', marginBottom:10, letterSpacing:1 }}>
            ✨ TODAY'S BIRTHDAY ✨
          </div>
          {todayChars.map(c => <BirthdayCard key={c.id} char={c} isBirthdayToday={true} />)}
        </div>
      )}

      {otherChars.length > 0 && (
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'#888', marginBottom:10 }}>
            이번 달 생일
          </div>
          {otherChars.map(c => <BirthdayCard key={c.id} char={c} isBirthdayToday={false} />)}
        </div>
      )}

      {monthChars.length === 0 && (
        <div className="glass-strong" style={{
          borderRadius:16, padding:40, textAlign:'center', color:'#999',
        }}>
          <Cake size={48} color="#ccc" style={{ margin:'0 auto 12px' }} />
          <div style={{ fontSize:16 }}>이번 달에는 생일인 캐릭터가 없습니다</div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS SIDEBAR ───────────────────────────────────
function Sidebar({ selectedUnit, onSelectUnit }) {
  const [expandedAgencies, setExpandedAgencies] = useState(() => new Set(AGENCIES.map(a => a.id)));

  const toggleAgency = agencyId => {
    setExpandedAgencies(prev => {
      const next = new Set(prev);
      next.has(agencyId) ? next.delete(agencyId) : next.add(agencyId);
      return next;
    });
  };

  return (
    <div className="glass-strong" style={{
      width: 240, minWidth: 240, borderRadius: 16, padding: 12,
      overflowY: 'auto', maxHeight: 'calc(100vh - 140px)',
    }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#888', marginBottom:12, padding:'0 8px' }}>
        소속사 / 유닛
      </div>
      {AGENCIES.map(agency => {
        const isExpanded = expandedAgencies.has(agency.id);
        const agencyUnits = UNITS.filter(u => u.agencyId === agency.id);
        return (
          <div key={agency.id} style={{ marginBottom:4 }}>
            <button
              onClick={() => toggleAgency(agency.id)}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:6,
                padding:'8px 10px', border:'none', borderRadius:10, cursor:'pointer',
                background: 'transparent', fontSize:13, fontWeight:700, color:'#555',
                transition:'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(0,0,0,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
              {agency.name}
            </button>
            {isExpanded && agencyUnits.map(unit => {
              const isSelected = selectedUnit === unit.id;
              const color = getUnitColor(unit.id);
              return (
                <button
                  key={unit.id}
                  onClick={() => onSelectUnit(unit.id)}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', gap:8,
                    padding:'7px 10px 7px 28px', border:'none', borderRadius:8, cursor:'pointer',
                    fontSize:13, fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? color : '#666',
                    background: isSelected ? `${color}15` : 'transparent',
                    transition:'all 0.15s',
                  }}
                  onMouseEnter={e => { if(!isSelected) e.currentTarget.style.background='rgba(0,0,0,0.03)'; }}
                  onMouseLeave={e => { if(!isSelected) e.currentTarget.style.background='transparent'; }}
                >
                  <div style={{
                    width:8, height:8, borderRadius:'50%', background:color,
                    boxShadow: isSelected ? `0 0 8px ${color}88` : 'none',
                  }}/>
                  {unit.name}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── SETTINGS MAIN PANEL ────────────────────────────────
function SettingsPanel({ settings, selectedUnit, onCharToggle, onUnitToggle }) {
  const unit = getUnit(selectedUnit);
  if (!unit) return (
    <div className="glass-strong" style={{
      flex:1, borderRadius:16, padding:40, display:'flex',
      alignItems:'center', justifyContent:'center', color:'#999',
    }}>
      <div style={{ textAlign:'center' }}>
        <Settings size={48} color="#ccc" style={{ margin:'0 auto 12px' }} />
        <div>좌측에서 유닛을 선택하세요</div>
      </div>
    </div>
  );

  const color = getUnitColor(unit.id);
  const chars = getCharsByUnit(unit.id);

  return (
    <div style={{ flex:1, minWidth:0 }}>
      {/* Unit Master Controller */}
      <div className="glass-strong" style={{
        borderRadius:16, padding:16, marginBottom:12,
        borderLeft:`4px solid ${color}`,
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:'#333' }}>{unit.name}</div>
            <div style={{ fontSize:12, color:'#999', marginTop:2 }}>마스터 컨트롤 · {chars.length}명</div>
          </div>
          <UnitMasterRow settings={settings} unitId={unit.id} onUnitToggle={onUnitToggle} />
        </div>
      </div>

      {/* Character List */}
      <div className="glass-strong" style={{ borderRadius:16, overflow:'hidden' }}>
        {chars.map((char, i) => {
          const initial = getInitials(char.name);
          return (
            <div
              key={char.id}
              className="fade-in"
              style={{
                position:'relative', overflow:'hidden',
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'14px 16px',
                borderBottom: i < chars.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {/* Background initial */}
              <div style={{
                position:'absolute', right:160, top:-8, fontSize:80, fontWeight:900,
                color:color, opacity:0.035, lineHeight:1, pointerEvents:'none', userSelect:'none',
              }}>
                {initial}
              </div>
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ fontSize:15, fontWeight:600, color:'#333' }}>{char.name}</div>
                <div style={{ fontSize:12, color:'#999', marginTop:2 }}>
                  {char.birthday.month}월 {char.birthday.day}일
                </div>
              </div>
              <div style={{ position:'relative', zIndex:1 }}>
                <StageRow settings={settings} charId={char.id} unitId={char.unitId} onToggle={onCharToggle} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ──────────────────────────────────────
function SettingsPage() {
  const [settings, setSettings] = useState(loadFromStorage);
  const [selectedUnit, setSelectedUnit] = useState('UN001');

  const handleCharToggle = useCallback((charId, stage) => {
    setSettings(prev => {
      const next = { ...prev, [charId]: { ...prev[charId], [stage]: !prev[charId]?.[stage] } };
      saveToStorage(next);
      return next;
    });
  }, []);

  const handleUnitToggle = useCallback((unitId, stage) => {
    setSettings(prev => {
      const allOn = computeUnitState(prev, unitId, stage);
      const newVal = !allOn;
      const next = { ...prev };
      getCharsByUnit(unitId).forEach(c => {
        next[c.id] = { ...next[c.id], [stage]: newVal };
      });
      saveToStorage(next);
      return next;
    });
  }, []);

  return (
    <div style={{ padding:20, maxWidth:900, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <Bell size={24} color="#333" />
        <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:'#333' }}>알림 설정</h1>
      </div>
      <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
        <Sidebar selectedUnit={selectedUnit} onSelectUnit={setSelectedUnit} />
        <SettingsPanel
          settings={settings}
          selectedUnit={selectedUnit}
          onCharToggle={handleCharToggle}
          onUnitToggle={handleUnitToggle}
        />
      </div>
    </div>
  );
}

// ─── NAVIGATION BAR ─────────────────────────────────────
function NavBar({ page, onNavigate }) {
  return (
    <nav className="glass" style={{
      position:'sticky', top:0, zIndex:100,
      display:'flex', justifyContent:'center', gap:4, padding:'10px 16px',
      borderBottom:'1px solid rgba(255,255,255,0.2)',
    }}>
      {[
        { id:'dashboard', label:'대시보드', icon: Home },
        { id:'settings', label:'설정', icon: Settings },
      ].map(({ id, label, icon: Icon }) => {
        const active = page === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'8px 20px', border:'none', borderRadius:12, cursor:'pointer',
              fontSize:14, fontWeight: active ? 700 : 500,
              color: active ? '#ff4081' : '#666',
              background: active ? 'rgba(255,64,129,0.1)' : 'transparent',
              transition:'all 0.2s',
            }}
            onMouseEnter={e => { if(!active) e.currentTarget.style.background='rgba(0,0,0,0.04)'; }}
            onMouseLeave={e => { if(!active) e.currentTarget.style.background= active ? 'rgba(255,64,129,0.1)' : 'transparent'; }}
          >
            <Icon size={18} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

// ─── APP ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <>
      <style>{globalStyles}</style>
      <div className="stage-bg">
        <NavBar page={page} onNavigate={setPage} />
        {page === 'dashboard' ? <Dashboard /> : <SettingsPage />}
      </div>
    </>
  );
}
