// English copy. Edit text here; the zh-Hant dictionary must keep the same shape.
export const en = {
  htmlLang: 'en',
  langName: 'English',
  skipToContent: 'Skip to content',
  nav: {
    label: 'Main',
    home: 'Home',
    services: 'Services',
    work: 'Work',
    contact: 'Contact',
  },
  langSwitch: { label: 'Language' },
  footer: {
    location: 'Taipei, Taiwan',
    tagline: 'Software development, consulting and AI workflow adoption.',
    githubLabel: 'GitHub',
    emailLabel: 'Email',
  },
  home: {
    title: 'Dependable software development and engineering consulting',
    description:
      'Sympoies is a professional software development team: contract development, technical consulting, and AI workflow adoption for engineering teams.',
    heroTitle: 'Software engineering you can rely on.',
    heroLead:
      'We are a professional software development team. We build software, advise engineering teams, and help them bring AI into the way they already work.',
    ctaPrimary: 'Start a conversation',
    ctaSecondary: 'See our work',
    pillarsTitle: 'What we do',
    pillars: [
      {
        title: 'Software development',
        body: 'Contract development of web services, tools and internal platforms, from first design to release, with automated tests and code review as standard practice.',
      },
      {
        title: 'Technical consulting',
        body: 'Architecture and codebase reviews, delivery process assessments, and hands-on guidance to help your team make and carry out sound technical decisions.',
      },
      {
        title: 'AI workflow adoption',
        body: 'We help teams introduce AI assistants into requirements, coding, review and release, with clear guardrails so that quality and accountability stay with your people.',
      },
    ],
    learnMore: 'More about our services',
    processTitle: 'How we work',
    processLead: 'The same disciplined path on every project, whatever its size.',
    steps: [
      { title: 'Requirements', body: 'We agree what success looks like before any code is written.' },
      { title: 'Design', body: 'We settle the approach and the main trade-offs, and write them down.' },
      { title: 'Test-first delivery', body: 'Behavior is specified by tests first, then built in small, reviewable steps.' },
      { title: 'Review', body: 'Every change is reviewed before it is merged.' },
      { title: 'Release', body: 'Releases are repeatable and documented, so shipping is routine.' },
    ],
    ctaTitle: 'Have a project or a question?',
    ctaBody: 'Tell us what you are working on. We will reply with an honest view of how we can help.',
  },
  services: {
    title: 'Services',
    description:
      'Software development, technical consulting and AI workflow adoption, delivered through a clear engagement: discovery, proposal, delivery and handover.',
    heading: 'Services',
    lead: 'Three ways we work with engineering teams, and what an engagement looks like.',
    areasTitle: 'Areas of work',
    areas: [
      {
        title: 'Software development',
        body: 'We take responsibility for building software to an agreed scope.',
        items: [
          'Web services, APIs and internal tools',
          'Command-line tools and automation',
          'Extending or modernizing existing codebases',
          'Automated testing and release pipelines',
        ],
      },
      {
        title: 'Technical consulting',
        body: 'We give your team an independent, practical view.',
        items: [
          'Architecture and code reviews',
          'Delivery process and quality assessments',
          'Technology selection and trade-off analysis',
          'Hands-on pairing with your engineers',
        ],
      },
      {
        title: 'AI workflow adoption',
        body: 'We help you use AI tools in engineering work without losing control of quality.',
        items: [
          'Where AI assistance fits in your process, and where it does not',
          'Review, testing and approval practices for AI-assisted changes',
          'Shared conventions, instructions and tooling for your team',
          'Training and handover so your team owns the workflow',
        ],
      },
    ],
    engagementTitle: 'What an engagement looks like',
    engagementLead: 'Every engagement follows four stages, so you always know what happens next.',
    stages: [
      {
        title: 'Discovery',
        body: 'We learn your goals, constraints and existing systems, and ask the questions that shape the scope.',
      },
      {
        title: 'Proposal',
        body: 'We send a written proposal covering scope, approach, deliverables and timeline for you to review.',
      },
      {
        title: 'Delivery',
        body: 'We work in small, reviewable increments with regular updates, and you see progress as it happens.',
      },
      {
        title: 'Handover',
        body: 'We hand over code, documentation and knowledge, so your team can run and extend the result without us.',
      },
    ],
    ctaTitle: 'Want to discuss an engagement?',
    ctaBody: 'Send us a short description of what you need and we will take it from there.',
  },
  work: {
    title: 'Work and open source',
    description:
      'Public projects from Sympoies include a workflow board, command-line tools, agent guardrails, a collaboration viewer, Alfred workflows and a self-hostable chat workspace.',
    heading: 'Work and open source',
    lead: 'We build in the open. These are public projects we maintain; the code and documentation are there to read.',
    repoLink: 'Source on GitHub',
    demoLink: 'Live demo',
    releasesLink: 'Releases',
    earlyLabel: 'Early development',
    projects: {
      symphonyBoard: {
        description:
          'A read-only workflow board for GitHub and GitLab. It gathers issues, pull and merge requests, activity and relationships into one view.',
        alt: 'Symphony Board Activity view with a demo event feed, selected event details, and activity summaries by user and repository.',
      },
      agentCollab: {
        description:
          'A way for people and their AI agents to collaborate through a Git repository, with a read-only viewer that shows the conversation like a chat room.',
        alt: 'Screenshot of the agent-collab viewer with fictional data: a topic list on the left and a chat-style conversation between two fictional agents.',
      },
      nilsCli: {
        description:
          'A Rust workspace of focused command-line tools for API testing, Git operations, provider automation and workflow evidence, with consistent machine-readable output.',
        alt: 'Animated terminal window running git-scope to list changed files and show the latest commit.',
      },
      agentRuntimeKit: {
        description:
          'The shared source for the skills, hooks and policies that configure coding agents such as Codex CLI, Claude Code and Hermes Agent.',
        alt: 'A fictional terminal session where a guardrail blocks a direct push to the default branch and guides the agent to open a pull request instead.',
      },
      nilsAlfredWorkflow: {
        description: 'Alfred workflows for macOS, including Google and YouTube search, dictionary lookup and more.',
        alt: 'Recreated Alfred result list showing sample results for a Google search for Tokyo.',
      },
      salon: {
        description:
          'A self-hostable, container-first chat workspace for working with coding agents from a browser, and reconnecting to the same session later.',
        alt: 'Screenshot of Salon with synthetic data: agent sessions side by side, one showing a plan, a code diff, a test result and a chart.',
      },
    },
  },
  contact: {
    title: 'Contact',
    description: 'Get in touch with Sympoies about software development, consulting or AI workflow adoption.',
    heading: 'Contact',
    lead: 'Tell us briefly what you are working on. We will reply by email.',
    form: {
      name: 'Name',
      email: 'Email',
      company: 'Company',
      optional: 'optional',
      message: 'Message',
      messageHint: 'What are you working on, and how can we help?',
      submit: 'Send message',
      sending: 'Sending…',
      success: 'Thank you. Your message has been sent and we will reply by email.',
      error: 'Sorry, the message could not be sent. Please email us directly instead.',
    },
    emailTitle: 'Prefer email?',
    emailBody: 'You can also write to us directly at',
  },
};

export type Dict = typeof en;
