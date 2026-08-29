import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Download,
  PenTool,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { Contract } from '@/lib/mock-data';

export interface ContractsViewProps {
  contracts: Contract[];
  onSignContract: (contractId: string) => void;
  openAiAssistant: () => void;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  contracts,
  onSignContract,
  openAiAssistant,
}) => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const handleSign = (contractId: string) => {
    setIsSigning(true);
    setTimeout(() => {
      onSignContract(contractId);
      setIsSigning(false);
      setHasSigned(true);
      if (selectedContract) {
        setSelectedContract({
          ...selectedContract,
          status: 'Active',
          signedByClient: true,
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[var(--m3-primary)]" />
            Contracts & Master Services Agreements
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Legal documents, Statements of Work (SOW), SLA addendums, and digital signature workflows.
          </p>
        </div>

        <M3Button
          variant="filled"
          icon={<Sparkles className="w-4 h-4" />}
          onClick={openAiAssistant}
        >
          Contract AI Review
        </M3Button>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contracts.map((contract) => (
          <M3Card
            key={contract.id}
            variant="filled"
            elevation={1}
            interactive
            onClick={() => setSelectedContract(contract)}
            className="p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <M3Badge variant="outline" size="sm">{contract.type}</M3Badge>
                <M3Badge
                  variant={
                    contract.status === 'Active'
                      ? 'success'
                      : contract.status === 'Pending Signature'
                      ? 'warning'
                      : 'secondary'
                  }
                  size="sm"
                >
                  {contract.status}
                </M3Badge>
              </div>

              <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">
                {contract.title}
              </h3>

              <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-lowest)] space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--m3-on-surface-variant)]">Contract Value:</span>
                  <span className="font-bold">{contract.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--m3-on-surface-variant)]">Effective Dates:</span>
                  <span>{contract.startDate} to {contract.endDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-xs">
              <span className="text-[var(--m3-on-surface-variant)]">{contract.fileSize}</span>
              <M3Button variant="tonal" size="sm">
                View & Sign
              </M3Button>
            </div>
          </M3Card>
        ))}
      </div>

      {/* Contract Preview & Signature Dialog */}
      {selectedContract && (
        <M3Dialog
          isOpen={!!selectedContract}
          onClose={() => setSelectedContract(null)}
          title={selectedContract.title}
          icon={<FileCheck className="w-5 h-5" />}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[var(--m3-on-surface-variant)]">Legal Document Type</p>
                  <p className="font-bold text-sm">{selectedContract.type} Agreement</p>
                </div>
                <M3Badge
                  variant={selectedContract.signedByClient ? 'success' : 'warning'}
                  size="md"
                >
                  {selectedContract.signedByClient ? 'Fully Signed' : 'Pending Client Signature'}
                </M3Badge>
              </div>

              <div className="border-t border-[var(--m3-outline-variant)] pt-3 text-xs space-y-1">
                <p>• Client Signatory: Julian Vance (Apex Digital Systems)</p>
                <p>• Provider Signatory: Elena Rostova (Google Workspace Partner)</p>
                <p>• Governance: California Enterprise Commercial Code</p>
              </div>
            </div>

            {hasSigned && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <p className="font-bold text-xs">Digital Signature Verification Complete!</p>
                  <p className="text-[11px]">
                    Executed PDF archived with cryptographic audit log in File Manager.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <M3Button
                variant="outlined"
                icon={<Download className="w-4 h-4" />}
                onClick={() => alert(`Downloading PDF copy of ${selectedContract.title}`)}
              >
                Download PDF
              </M3Button>

              {!selectedContract.signedByClient && (
                <M3Button
                  variant="filled"
                  disabled={isSigning}
                  icon={<PenTool className="w-4 h-4" />}
                  onClick={() => handleSign(selectedContract.id)}
                >
                  {isSigning ? 'Verifying Digital ID...' : 'Execute Digital Signature'}
                </M3Button>
              )}
            </div>
          </div>
        </M3Dialog>
      )}
    </div>
  );
};
