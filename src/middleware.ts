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

  // Interceptar subdomínio forms.infinityondemand.com.br
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

    // Página de Preços / Landing do Forms
    if (pathname === '/precos' || pathname.startsWith('/forms/precos')) {
      return NextResponse.rewrite(new URL('/forms', request.url));
    }

    // Rota direta de forms
    if (pathname === '/forms' || pathname.startsWith('/forms/')) {
      return NextResponse.next();
    }

    // Se o usuário acessar /f/slug ou qualquer slug no subdomínio de forms (ex: /sobre, /ecommerce, /testes, etc.)
    // NUNCA deve cair no site principal da Infinity (home/sobre).
    // O subdomínio forms é 100% isolado e serve o funil de formulário correspondente:
    const slug = pathname.replace(/^\//, '').replace(/^f\//, '');
    const formUrl = new URL('/forms', request.url);
    if (slug) {
      formUrl.searchParams.set('form', slug);
    }
    return NextResponse.rewrite(formUrl);
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

  // Skip non-localized routes (admin panels, dashboards, etc.)
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
