const SITE = "الجالس للسيارات";

export function pageHead(title: string, description: string, extra: { noindex?: boolean } = {}) {
  const full = `${title} | ${SITE}`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: full },
      { name: "twitter:description", content: description },
      ...(extra.noindex ? [{ name: "robots", content: "noindex" }] : []),
    ],
  };
}
