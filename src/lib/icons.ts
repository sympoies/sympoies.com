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
