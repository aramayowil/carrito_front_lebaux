import { describe, expect, it } from "vitest";

import { sanitizarHtml } from "@/lib/sanitize-html";

describe("sanitizarHtml", () => {
  it("conserva las etiquetas y atributos del vocabulario de Tiptap", async () => {
    const html =
      '<h2>Título</h2><p>Texto con <strong>negrita</strong> y <a href="/obras" target="_blank">un link</a>.</p>' +
      '<ul><li>Item</li></ul><img src="https://res.cloudinary.com/foo.jpg" alt="Foto" style="text-align: center" />';

    const limpio = await sanitizarHtml(html);

    expect(limpio).toContain("<h2>Título</h2>");
    expect(limpio).toContain("<strong>negrita</strong>");
    expect(limpio).toContain('href="/obras"');
    expect(limpio).toContain("<li>Item</li>");
    expect(limpio).toContain('src="https://res.cloudinary.com/foo.jpg"');
  });

  it("elimina <script> y handlers inline (onerror, onclick)", async () => {
    const html =
      '<p>Hola</p><script>alert(1)</script><img src="x" onerror="alert(1)" />';

    const limpio = await sanitizarHtml(html);

    expect(limpio).not.toContain("<script");
    expect(limpio).not.toContain("alert(1)");
    expect(limpio).not.toContain("onerror");
  });

  it("bloquea URLs javascript: en href", async () => {
    const html = '<a href="javascript:alert(1)">click</a>';

    const limpio = await sanitizarHtml(html);

    expect(limpio).not.toContain("javascript:");
  });

  it("fuerza rel=noopener noreferrer en links target=_blank", async () => {
    const html = '<a href="https://externo.com" target="_blank">externo</a>';

    const limpio = await sanitizarHtml(html);

    expect(limpio).toContain('rel="noopener noreferrer"');
  });

  it("descarta atributos no permitidos, como class o data-*", async () => {
    const html = '<p class="selectedCell" data-foo="bar">Texto</p>';

    const limpio = await sanitizarHtml(html);

    expect(limpio).not.toContain("class=");
    expect(limpio).not.toContain("data-foo");
    expect(limpio).toContain("Texto");
  });

  it("elimina etiquetas fuera del vocabulario permitido (iframe, style, svg)", async () => {
    const html =
      '<p>Texto</p><iframe src="https://evil.com"></iframe><style>body{}</style>';

    const limpio = await sanitizarHtml(html);

    expect(limpio).not.toContain("<iframe");
    expect(limpio).not.toContain("<style");
    expect(limpio).toContain("Texto");
  });
});
