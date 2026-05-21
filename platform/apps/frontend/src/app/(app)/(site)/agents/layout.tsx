import { Metadata } from 'next';
import { Agent } from '@loraloop/frontend/components/agents/agent';
export const metadata: Metadata = {
  title: 'Loraloop - Agent',
  description: 'agents',
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Agent>{children}</Agent>;
}
