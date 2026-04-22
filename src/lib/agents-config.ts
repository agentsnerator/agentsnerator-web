export const AGENT_TEMPLATES = [
  { type: 'social',   name: 'Social Media',    webhook: '/webhook/social-agent',           icon: '📱' },
  { type: 'seo',      name: 'SEO Agent',        webhook: '/webhook/seo-agent',              icon: '🔍' },
  { type: 'content',  name: 'Content Writer',   webhook: '/webhook/ceo-agent',              icon: '📝' },
  { type: 'report',   name: 'Monthly Report',   webhook: '/webhook/report-agent',           icon: '📊' },
  { type: 'image',    name: 'Image Generator',  webhook: '/webhook/image-gen-agent',        icon: '🎨' },
  { type: 'market',   name: 'Market Research',  webhook: '/webhook/market-research-agent',  icon: '🏆' },
  { type: 'gamedev',  name: 'Game Dev',         webhook: '/webhook/game-dev-agent',         icon: '🎮' },
] as const;

export type AgentType = typeof AGENT_TEMPLATES[number]['type'];

export function getAgentTemplate(type: AgentType) {
  return AGENT_TEMPLATES.find(a => a.type === type);
}
