/** Public projects shown on the Work page. Descriptions live in the i18n dictionaries. */
export type ProjectId = 'nilsCli' | 'agentRuntimeKit' | 'salon' | 'symphonyBoard' | 'agentCollab';

export interface Project {
  id: ProjectId;
  name: string;
  repo: string;
  demo?: string;
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
  {
    id: 'agentCollab',
    name: 'agent-collab',
    repo: 'https://github.com/sympoies/agent-collab',
    demo: 'https://sympoies.github.io/agent-collab/?demo',
  },
  { id: 'nilsCli', name: 'nils-cli', repo: 'https://github.com/sympoies/nils-cli' },
  {
    id: 'agentRuntimeKit',
    name: 'agent-runtime-kit',
    repo: 'https://github.com/sympoies/agent-runtime-kit',
  },
  { id: 'salon', name: 'salon', repo: 'https://github.com/sympoies/salon', early: true },
];
