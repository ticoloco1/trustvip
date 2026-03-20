#!/usr/bin/env node
// ═══════════════════════════════════════════════════════
// JobinLink — Automated Test Suite
// Run: node test-suite.js
// ═══════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname);
const PASS = '✅';
const FAIL = '❌';
const WARN = '⚠️ ';

let passed = 0, failed = 0, warned = 0;
const results = [];

function check(label, condition, fatal = false) {
  if (condition) {
    results.push(`  ${PASS} ${label}`);
    passed++;
  } else {
    results.push(`  ${fatal ? FAIL : WARN} ${label}`);
    fatal ? failed++ : warned++;
  }
}

function fileExists(p) { return fs.existsSync(path.join(ROOT, p)); }
function readFile(p) {
  try { return fs.readFileSync(path.join(ROOT, p), 'utf-8'); } catch { return ''; }
}
function fileContains(p, str) { return readFile(p).includes(str); }
function fileNotContains(p, str) { return !readFile(p).includes(str); }

// ── 1. CRITICAL FILES ─────────────────────────────────
console.log('\n📁 CRITICAL FILES');
const criticalFiles = [
  'app/layout.tsx', 'app/globals.css', 'app/page.tsx',
  'app/login/page.tsx', 'app/auth/callback/route.ts',
  'app/dashboard/page.tsx', 'app/directory/page.tsx',
  'app/slugs/page.tsx', 'app/slugs/SlugClient.tsx',
  'app/admin/page.tsx', 'app/admin/AdminClient.tsx',
  'app/classificados/page.tsx', 'app/classificados/[id]/page.tsx',
  'app/classificados/novo/page.tsx', 'app/ads/page.tsx',
  'components/slugs/SlugMarketplace.tsx', 'components/Navbar.tsx',
  'hooks/useAuth.tsx', 'hooks/useLang.tsx', 'hooks/useCountdown.ts',
  'lib/supabase.ts', 'lib/slug.ts', 'lib/i18n/translations.ts',
];
criticalFiles.forEach(f => check(f, fileExists(f), true));

// ── 2. THEME — NO DARK BACKGROUNDS ────────────────────
console.log('\n🎨 THEME (must be WHITE)');
const darkColors = ['#050508', 'rgba(5,5,8', '#0a0a0f', '#1a1a2e', '#0d0d14'];
const pageFiles = [
  'app/page.tsx', 'app/login/page.tsx', 'app/dashboard/page.tsx',
  'app/directory/DirectoryClient.tsx', 'app/slugs/page.tsx',
  'app/classificados/ClassificadosClient.tsx', 'app/ads/page.tsx',
  'app/admin/AdminClient.tsx',
];
pageFiles.forEach(f => {
  const content = readFile(f);
  const hasDark = darkColors.some(c => content.includes(c));
  check(`No dark bg in ${f}`, !hasDark);
});

check('globals.css has white background', fileContains('app/globals.css', '#f9fafb'));
check('globals.css has dark text color', fileContains('app/globals.css', '#111827'));
check('Font size is 15px+', fileContains('app/globals.css', 'font-size:15px') || fileContains('app/globals.css', 'font-size: 15px'));

// ── 3. AUTH ────────────────────────────────────────────
console.log('\n🔐 AUTH SYSTEM');
check('Auth callback route exists', fileExists('app/auth/callback/route.ts'), true);
check('Auth callback exchanges code', fileContains('app/auth/callback/route.ts', 'exchangeCodeForSession'), true);
check('Auth callback redirects to dashboard', fileContains('app/auth/callback/route.ts', 'dashboard'));
check('Login redirects to /auth/callback', fileContains('app/login/page.tsx', '/auth/callback'));
check('Google OAuth uses callback URL', fileContains('app/login/page.tsx', 'auth/callback'));
check('Magic link uses callback URL', fileContains('app/login/page.tsx', 'auth/callback'));
check('MetaMask login exists', fileContains('app/login/page.tsx', 'ethereum'));
check('AuthProvider wraps layout', fileContains('app/layout.tsx', 'AuthProvider'));
check('useAuth hook has onAuthStateChange', fileContains('hooks/useAuth.tsx', 'onAuthStateChange'));

// ── 4. i18n ────────────────────────────────────────────
console.log('\n🌐 i18n (14 LANGUAGES)');
const langs = ['en','pt','es','fr','it','ko','zh','ja','hi','th','vi','id','ms'];
langs.forEach(l => check(`Language '${l}' in translations`, fileContains('lib/i18n/translations.ts', `  ${l}:`)));
check('useLang hook exists', fileExists('hooks/useLang.tsx'));
check('LangProvider in layout', fileContains('app/layout.tsx', 'LangProvider'));
check('Navbar has language switcher', fileContains('components/Navbar.tsx', 'LANGUAGES'));
check('Language saved to localStorage', fileContains('hooks/useLang.tsx', 'localStorage'));
check('Browser language detection', fileContains('lib/i18n/translations.ts', 'detectLang'));

// ── 5. SLUG MARKETPLACE ────────────────────────────────
console.log('\n🔤 SLUG MARKETPLACE');
check('SlugMarketplace component exists', fileExists('components/slugs/SlugMarketplace.tsx'));
check('Real-time availability check', fileContains('components/slugs/SlugMarketplace.tsx', 'premiumCheck'));
check('Shows domain jobinlink.com/@', fileContains('components/slugs/SlugMarketplace.tsx', 'jobinlink.com/@'));
check('Cart uses REAL price (not hardcoded $12)', fileNotContains('components/slugs/SlugMarketplace.tsx', 'price: 12') && fileNotContains('components/slugs/SlugMarketplace.tsx', 'price:12'));
check('getRealPrice function exists', fileContains('components/slugs/SlugMarketplace.tsx', 'getRealPrice'));
check('Premium price from DB', fileContains('components/slugs/SlugMarketplace.tsx', 'premiumCheck.price'));
check('User listing price from DB', fileContains('components/slugs/SlugMarketplace.tsx', 'listingCheck.price'));
check('Slug tier badges (1L 2L 3L)', fileContains('components/slugs/SlugMarketplace.tsx', 'SlugTier'));
check('Add to cart button', fileContains('components/slugs/SlugMarketplace.tsx', 'addToCart'));
check('Checkout handler', fileContains('components/slugs/SlugMarketplace.tsx', 'handleCheckout'));
check('Hot slug ticker', fileContains('components/slugs/SlugMarketplace.tsx', 'HOT_SLUGS'));
check('Auctions tab', fileContains('components/slugs/SlugMarketplace.tsx', 'auctions'));
check('Sell tab', fileContains('components/slugs/SlugMarketplace.tsx', 'handleSell'));
check('My slugs tab', fileContains('components/slugs/SlugMarketplace.tsx', 'myRegistrations'));

// ── 6. CART ────────────────────────────────────────────
console.log('\n🛒 CART');
check('CartItem type defined', fileContains('components/Navbar.tsx', 'CartItem'));
check('Cart shows real price', fileContains('components/Navbar.tsx', 'item.price'));
check('Cart total calculation', fileContains('components/Navbar.tsx', 'reduce'));
check('Remove from cart', fileContains('components/Navbar.tsx', 'onRemoveFromCart'));
check('Checkout button in cart', fileContains('components/Navbar.tsx', 'onCheckout'));
check('Cart count badge', fileContains('components/Navbar.tsx', 'cart.length'));

// ── 7. NAVBAR ─────────────────────────────────────────
console.log('\n🧭 NAVBAR');
check('Navbar component exists', fileExists('components/Navbar.tsx'));
check('White background', fileContains('components/Navbar.tsx', 'white'));
check('All nav links present', fileContains('components/Navbar.tsx', '/directory') && fileContains('components/Navbar.tsx', '/slugs'));
check('Language switcher', fileContains('components/Navbar.tsx', 'setLang'));
check('Auth-aware (user check)', fileContains('components/Navbar.tsx', 'user'));

// ── 8. SUPABASE ────────────────────────────────────────
console.log('\n🗄️  SUPABASE');
check('Supabase client configured', fileExists('lib/supabase.ts'));
check('Uses env vars (not hardcoded)', fileContains('lib/supabase.ts', 'NEXT_PUBLIC_SUPABASE_URL'));
check('mini_sites table used', fileContains('components/slugs/SlugMarketplace.tsx', 'mini_sites'));
check('premium_slugs table used', fileContains('components/slugs/SlugMarketplace.tsx', 'premium_slugs'));
check('slug_registrations table used', fileContains('components/slugs/SlugMarketplace.tsx', 'slug_registrations'));
check('slug_auctions table used', fileContains('components/slugs/SlugMarketplace.tsx', 'slug_auctions'));

// ── 9. ROUTES ─────────────────────────────────────────
console.log('\n🗺️  ROUTES (13 routes)');
const routes = [
  'app/page.tsx', 'app/login/page.tsx', 'app/dashboard/page.tsx',
  'app/directory/page.tsx', 'app/slugs/page.tsx', 'app/admin/page.tsx',
  'app/ads/page.tsx', 'app/classificados/page.tsx',
  'app/classificados/[id]/page.tsx', 'app/classificados/novo/page.tsx',
  'app/auth/callback/route.ts', 'app/[username]/page.tsx',
];
routes.forEach(r => check(`Route: /${r.replace('app/','').replace('/page.tsx','').replace('/route.ts','')}`, fileExists(r), true));

// ── 10. ADMIN ─────────────────────────────────────────
console.log('\n⚙️  ADMIN PANEL');
check('Admin email configured', fileContains('app/admin/AdminClient.tsx', 'arytcf@gmail.com'), true);
check('Admin has Slug management', fileContains('app/admin/AdminClient.tsx', 'premium_slugs'));
check('Admin has bulk import', fileContains('app/admin/AdminClient.tsx', 'bulkSlugs') || fileContains('app/admin/AdminClient.tsx', 'bulkText'));
check('Admin has auctions', fileContains('app/admin/AdminClient.tsx', 'slug_auctions'));
check('Admin has badges', fileContains('app/admin/AdminClient.tsx', 'badge'));
check('Admin has revenue splits', fileContains('app/admin/AdminClient.tsx', 'revenue') || fileContains('app/admin/AdminClient.tsx', 'splits'));

// ── SUMMARY ───────────────────────────────────────────
console.log('\n' + '═'.repeat(50));
results.forEach(r => console.log(r));
console.log('═'.repeat(50));
console.log(`\n${PASS} Passed: ${passed}   ${FAIL} Failed: ${failed}   ${WARN} Warnings: ${warned}`);
console.log(`Score: ${Math.round(passed/(passed+failed+warned)*100)}%\n`);

if (failed > 0) {
  console.log('🚨 CRITICAL FAILURES — fix before deploying!');
  process.exit(1);
} else if (warned > 0) {
  console.log('⚠️  Warnings present — review before deploying.');
} else {
  console.log('🚀 All checks passed — ready to deploy!');
}
