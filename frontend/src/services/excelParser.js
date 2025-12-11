import * as XLSX from 'xlsx';

export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '',
          blankrows: false
        });
        
        const parsed = parseSheetData(jsonData);
        resolve(parsed);
      } catch (error) {
        console.error('Parse error:', error);
        reject(new Error(`Failed to parse: ${error.message}`));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

function parseSheetData(rows) {
  try {
    // Find rows by looking for specific field names in column A
    const nameRow = rows.findIndex(r => String(r[0]||'').toLowerCase().includes('name'));
    const descRow = rows.findIndex(r => String(r[0]||'').toLowerCase() === 'description');
    const subredditsRow = rows.findIndex(r => String(r[0]||'').toLowerCase().includes('subreddits'));
    const postsRow = rows.findIndex(r => String(r[0]||'').toLowerCase().includes('number of posts'));
    const personasHeaderRow = rows.findIndex(r => String(r[0]||'').toLowerCase() === 'username');
    const keywordsHeaderRow = rows.findIndex(r => String(r[0]||'').toLowerCase() === 'keyword_id');
    
    if (nameRow === -1) throw new Error('Cannot find "Name" field');
    if (subredditsRow === -1) throw new Error('Cannot find "Subreddits" field');
    if (personasHeaderRow === -1) throw new Error('Cannot find "Username" section');
    if (keywordsHeaderRow === -1) throw new Error('Cannot find "keyword_id" section');
    
    // Company
    const company = {
      name: String(rows[nameRow]?.[1] || 'Unknown').trim(),
      description: String(rows[descRow]?.[1] || '').trim(),
      subreddits: parseSubreddits(rows[subredditsRow]?.[1]),
      postsPerWeek: parseInt(rows[postsRow]?.[1]) || 3
    };
    
    // Personas
    const personas = [];
    for (let i = personasHeaderRow + 1; i < rows.length; i++) {
      const username = String(rows[i]?.[0] || '').trim();
      const info = String(rows[i]?.[1] || '').trim();
      
      if (!username || username === 'keyword_id' || username.toLowerCase().includes('name')) break;
      
      personas.push({ username, info });
    }
    
    // Keywords
    const keywords = [];
    for (let i = keywordsHeaderRow + 1; i < rows.length; i++) {
      const keywordId = String(rows[i]?.[0] || '').trim();
      const keyword = String(rows[i]?.[1] || '').trim();
      
      if (!keywordId && !keyword) break;
      if (keyword) keywords.push({ keyword_id: keywordId, keyword });
    }
    
    if (!company.name) throw new Error('Company name missing');
    if (company.subreddits.length === 0) throw new Error('No subreddits found');
    if (personas.length === 0) throw new Error('No personas found');
    if (keywords.length === 0) throw new Error('No keywords found');
    
    console.log('✅ Parsed:', {
      company: company.name,
      subreddits: company.subreddits.length,
      personas: personas.length,
      keywords: keywords.length
    });
    
    return { company, personas, keywords };
  } catch (error) {
    throw error;
  }
}

function parseSubreddits(subredditString) {
  if (!subredditString) return [];
  
  const str = String(subredditString);
  const subreddits = str
    .split(/[\r\n,;]+/)
    .map(s => s.trim())
    .filter(s => s && s !== 'r/')
    .map(s => s.startsWith('r/') ? s : `r/${s}`);
  
  return [...new Set(subreddits)];
}
