import { NextRequest, NextResponse } from 'next/server';

const locales = ['pt', 'es'];
const defaultLocale = 'pt';

// Routes that exist outside [locale]/ — must NOT be rewritten
const nonLocalizedRoutes = [
  '/relatorios_infinity',
  '/admin',
  '/instagram-carousel',
  '/teste-whatsapp',
  '/Briefing',
  '/aluno',
  '/forms',
  '/f',
  '/carreiras',
  '/vagas',
  '/privacy',
  '/site-institucional',
  '/sites',
];

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  if (locales.includes(potentialLocale)) {
    return potentialLocale;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // ── SUBDOMÍNIO EXCLUSIVO DE FORMULÁRIOS INTERATIVOS ──
  // forms.infinityondemand.com.br serve o funil de captura interativo (/f)
  if (host.includes('forms.infinityondemand.com.br')) {
    // Arquivos estáticos e Next.js internals
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // APIs
    if (pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Página de Preços do Forms
    if (pathname === '/precos' || pathname.startsWith('/forms/precos')) {
      return NextResponse.rewrite(new URL('/forms/precos', request.url));
    }

    // Raiz ou qualquer slug (ex: /trafego, /e-commerce-moda, /mercado, etc.)
    // Redireciona/reescreve internamente para o runtime do funil (/f)
    const slug = pathname.replace(/^\//, '').replace(/^f\//, '');
    const funnelUrl = new URL('/f', request.url);
    funnelUrl.searchParams.set('slug', slug || 'diagnostico');
    return NextResponse.rewrite(funnelUrl);
  }

  // Skip API routes, static files, Next.js internals, and public assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // static files like .png, .css, .js, .xml, etc.
  ) {
    return NextResponse.next();
  }

  // Skip non-localized routes (landing de forms na home, admin panels, dashboards, /f, carreiras, vagas, privacy, site-institucional)
  if (nonLocalizedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if path already has a locale
  const pathLocale = getLocaleFromPath(pathname);

  if (pathLocale) {
    // If it's the default locale (pt), redirect to clean URL (without /pt/)
    if (pathLocale === defaultLocale) {
      const cleanPath = pathname.replace(`/${defaultLocale}`, '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    // Non-default locale: let it through
    return NextResponse.next();
  }

  // No locale in path — this is the default locale (pt), let it through
  // We internally rewrite to /pt/ so the [locale] route catches it
  const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
  return NextResponse.rewrite(newUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon|.*\\..*).*)'],
};
