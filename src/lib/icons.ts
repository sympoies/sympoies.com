/** Line icons on a 24x24 grid, drawn with currentColor strokes. */
export const iconPaths = {
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  consulting: 'M4 5h16v11H9l-5 4zM8.5 10.5l2.5 2.5 4.5-4.5',
  workflow: 'M7 6h4c3 0 3 6 6 6M7 18h4c3 0 3-6 6-6M3 6a2 2 0 104 0 2 2 0 10-4 0M3 18a2 2 0 104 0 2 2 0 10-4 0M17 12a2 2 0 104 0 2 2 0 10-4 0',
  requirements: 'M9 4h6v3H9zM7 5.5H6v15h12v-15h-1M9 12h6M9 16h4',
  design: 'M4 5h16v14H4zM4 10h16M10 10v9',
  test: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM8.5 12l2.5 2.5 4.5-5',
  review: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
  release: 'M12 16V4M7 9l5-5 5 5M5 20h14',
  discovery: 'M11 4a7 7 0 100 14 7 7 0 000-14zM16 16l5 5',
  proposal: 'M7 3h7l4 4v14H7zM14 3v4h4M9.5 12h5M9.5 16h5',
  delivery: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  handover: 'M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4',
} as const;

export type IconName = keyof typeof iconPaths;

/** Icon order matches the order of the items in the dictionaries. */
export const pillarIcons: IconName[] = ['code', 'consulting', 'workflow'];
export const processIcons: IconName[] = ['requirements', 'design', 'test', 'review', 'release'];
export const stageIcons: IconName[] = ['discovery', 'proposal', 'delivery', 'handover'];

/** GitHub mark (Octicons `mark-github`, 16x16), monochrome; follow GitHub's logo usage guidelines. */
export const githubMark =
  'M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z';
