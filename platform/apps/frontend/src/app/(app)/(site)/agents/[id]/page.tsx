import { Metadata } from 'next';
import { Agent } from '@loraloop/frontend/components/agents/agent';
import { AgentChat } from '@loraloop/frontend/components/agents/agent.chat';
export const metadata: Metadata = {
  title: 'Loraloop - Agent',
  description: '',
};
export default async function Page() {
  return (
    <AgentChat />
  );
}
