/** Public projects shown on the Work page. Descriptions live in the i18n dictionaries. */
export type ProjectId = 'nilsCli' | 'agentRuntimeKit' | 'salon' | 'symphonyBoard' | 'agentCollab' | 'nilsAlfredWorkflow';

export interface Project {
  id: ProjectId;
  name: string;
  repo: string;
  demo?: string;
  releases?: string;
  /** Show an "early development" badge. */
  early?: boolean;
}

export const projects: Project[] = [
  {
    id: 'symphonyBoard',
    name: 'symphony-board',
    repo: 'https://github.com/sympoies/symphony-board',
    demo: 'https://sympoies.github.io/symphony-board/',
  },
  { id: 'nilsCli', name: 'nils-cli', repo: 'https://github.com/sympoies/nils-cli' },
  {
    id: 'agentRuntimeKit',
    name: 'agent-runtime-kit',
    repo: 'https://github.com/sympoies/agent-runtime-kit',
  },
  {
    id: 'agentCollab',
    name: 'agent-collab',
    repo: 'https://github.com/sympoies/agent-collab',
    demo: 'https://sympoies.github.io/agent-collab/?demo',
  },
  {
    id: 'nilsAlfredWorkflow',
    name: 'nils-alfredworkflow',
    repo: 'https://github.com/sympoies/nils-alfredworkflow',
    releases: 'https://github.com/sympoies/nils-alfredworkflow/releases',
  },
  { id: 'salon', name: 'salon', repo: 'https://github.com/sympoies/salon', early: true },
];
