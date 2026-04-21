"use client";

/**
 * Patch de console.error em nível de módulo — roda quando o bundle é
 * carregado no browser, antes da primeira renderização do React, mas
 * DEPOIS que o Next.js instalou o seu overlay (o que nos permite envolvê-lo).
 *
 * Fluxo correto:
 *   React → console.error → NOSSO filtro → (descarta fetchpriority)
 *                                        → Next.js overlay → native console
 *
 * Com useEffect (abordagem antiga), o overlay já capturava o aviso
 * antes de nosso filtro entrar em ação.
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const _orig = console.error;
  console.error = (...args) => {
    // React chama console.error(formatString, arg1, arg2, ...)
    // O %s NÃO está substituído em args[0] — checamos TODOS os argumentos.
    const full = args
      .map((a) => { try { return String(a); } catch { return ""; } })
      .join(" ");
    if (full.includes("fetchpriority")) return;
    _orig.apply(console, args);
  };
}

export default function DevWarningFilter() {
  return null;
}

