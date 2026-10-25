// Title-only examples: no invented ratings, episode counts or API results.
export const suggestedTitles = [
  'Naruto', 'One Piece', 'Bleach', 'Death Note', 'Dragon Ball',
  'Chainsaw Man', 'Tokyo Ghoul', 'Fullmetal Alchemist', 'Vinland Saga',
];

export function sampleTitles(query) {
  const term = query.trim().toLocaleLowerCase();
  return suggestedTitles
    .filter(title => title.toLocaleLowerCase().includes(term))
    .map(title => ({ mal_id: `sample-${title}`, title, isSample: true }));
}
