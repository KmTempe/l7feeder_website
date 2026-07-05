export function getSection(portfolioData, sectionId) {
  return portfolioData?.sections?.find((section) => section.id === sectionId) || {};
}

export function hasContentForSection(portfolioData, sectionId) {
  if (sectionId === 'home' || sectionId === 'contact') return true;
  if (sectionId === 'skills') return Boolean(portfolioData?.skills?.length);
  return Boolean(portfolioData?.[sectionId]?.length);
}
