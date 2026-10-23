import React, { useState } from 'react';
import { Play, GitBranch, Layers, ShieldCheck, CheckSquare, X } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const TriggerPipelineModal: React.FC = () => {
  const { isTriggerModalOpen, setIsTriggerModalOpen, triggerNewRun, setActivePage } = useAppState();

  const [pipelineName, setPipelineName] = useState('Golden-pipeline-12');
  const [branch, setBranch] = useState('master');
  const [environment, setEnvironment] = useState('Production');
  const [runSecurityScan, setRunSecurityScan] = useState(true);
  const [pushDockerImage, setPushDockerImage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await triggerNewRun(pipelineName, branch, environment);
    setIsSubmitting(false);
    setIsTriggerModalOpen(false);
    setActivePage('pipelines');
  };

  return (
    <Modal
      isOpen={isTriggerModalOpen}
      onClose={() => setIsTriggerModalOpen(false)}
      title="Dispatch CI/CD Pipeline Run"
      subtitle="Manually trigger workflow execution across container runners"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pipeline Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Pipeline Definition
          </label>
          <select
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            className="w-full bg-[#080d19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="Golden-pipeline-12">Golden-pipeline-12 (Production Path)</option>
            <option value="Multi-Stage-Docker-Build">Multi-Stage-Docker-Build</option>
            <option value="Trivy-Vulnerability-Audit">Trivy-Vulnerability-Audit</option>
          </select>
        </div>

        {/* Branch Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Git Branch / Reference
          </label>
          <div className="relative">
            <GitBranch className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. main, feat/api-gateway"
              required
              className="w-full bg-[#080d19] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Target Environment */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Target Environment Gate
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Development', 'Staging', 'Production'].map((env) => (
              <button
                type="button"
                key={env}
                onClick={() => setEnvironment(env)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                  environment === env
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-950'
                    : 'bg-[#080d19] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="p-3 rounded-lg bg-[#080d19] border border-slate-800 space-y-2">
          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={runSecurityScan}
              onChange={(e) => setRunSecurityScan(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Execute Trivy security & vulnerability gate</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={pushDockerImage}
              onChange={(e) => setPushDockerImage(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Publish tagged multi-arch container to registry</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsTriggerModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="glow"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            Execute Pipeline
          </Button>
        </div>
      </form>
    </Modal>
  );
};
