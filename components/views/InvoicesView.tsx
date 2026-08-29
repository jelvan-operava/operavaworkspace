import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Receipt,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  Printer,
  Sparkles,
  ShieldCheck,
  Check,
  Plus,
  RefreshCw,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { InvoicesSkeleton } from '../ui/skeletons/InvoicesSkeleton';
import { M3ErrorState } from '../ui/M3ErrorState';
import { Invoice, InvoiceItem } from '@/lib/mock-data';

export interface InvoicesViewProps {
  invoices: Invoice[];
  onPayInvoice: (invoiceId: string) => void;
  onCreateInvoice?: (invoice: Invoice) => void;
  openAiAssistant: () => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onPayInvoice,
  onCreateInvoice,
  openAiAssistant,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Paid'>('All');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Simulated internal fetch states for testing
  const [isSimulatingLoading, setIsSimulatingLoading] = useState(false);
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  // Auto-recurring billing toggle
  const [isAutoRecurringEnabled, setIsAutoRecurringEnabled] = useState(true);

  // New Invoice Modal
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [newInvNumber, setNewInvNumber] = useState('INV-2026-0842');
  const [newInvDueDate, setNewInvDueDate] = useState('2026-08-15');
  const [newInvNotes, setNewInvNotes] = useState('Google Workspace Cloud Invoicing & Maintenance');
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([
    { description: 'Google Workspace Enterprise AI User Licenses', quantity: 10, rate: 35, amount: 350 },
    { description: 'Gemini 3.5 API Usage & Managed Pipeline', quantity: 1, rate: 1200, amount: 1200 },
  ]);

  const showSkeleton = isLoading || isSimulatingLoading;
  const showError = isError || isSimulatingError;

  const handleRefreshData = () => {
    setIsSimulatingError(false);
    setIsSimulatingLoading(true);
    setTimeout(() => {
      setIsSimulatingLoading(false);
    }, 1200);
  };

  const handleTriggerError = () => {
    setIsSimulatingLoading(true);
    setTimeout(() => {
      setIsSimulatingLoading(false);
      setIsSimulatingError(true);
    }, 800);
  };

  const handleRetryFetch = () => {
    if (onRetry) {
      onRetry();
    }
    handleRefreshData();
  };

  if (showSkeleton) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[var(--m3-on-surface-variant)] px-2">
          <span className="font-medium animate-pulse flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--m3-primary)]" />
            Loading Billing Statements & Invoice Ledgers...
          </span>
        </div>
        <InvoicesSkeleton />
      </div>
    );
  }

  if (showError) {
    return (
      <M3ErrorState
        title="Failed to Load Financial Invoices"
        description="The billing ledger service returned a 503 Service Unavailable error. Secure payment processing and invoice records are currently unaccessible."
        errorCode="ERR_BILLING_SERVICE_UNAVAILABLE"
        errorDetails="Google Workspace Billing API error 503\nEndpoint: /v1/billing/statements\nTrace ID: 0xfa129402c"
        onRetry={handleRetryFetch}
        onSecondaryAction={() => setIsSimulatingError(false)}
        secondaryActionText="Dismiss & View Cached Invoices"
      />
    );
  }


  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { description: 'Additional Managed Service / Cloud Resource', quantity: 1, rate: 250, amount: 250 },
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setLineItems((prev) => {
      const copy = [...prev];
      const item = { ...copy[index], [field]: value };
      if (field === 'quantity' || field === 'rate') {
        item.amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
      }
      copy[index] = item;
      return copy;
    });
  };

  const subtotalNewInv = lineItems.reduce((acc, item) => acc + item.amount, 0);
  const taxNewInv = Math.round(subtotalNewInv * 0.0825);
  const totalNewInv = subtotalNewInv + taxNewInv;

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCreateInvoice) {
      onCreateInvoice({
        id: `inv-${newInvNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        invoiceNumber: newInvNumber,
        date: new Date().toISOString().split('T')[0],
        dueDate: newInvDueDate,
        amount: subtotalNewInv,
        tax: taxNewInv,
        total: totalNewInv,
        status: 'Pending',
        items: lineItems,
        notes: newInvNotes,
      });
    }
    setIsCreateInvoiceOpen(false);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBalance = invoices
    .filter((i) => i.status === 'Pending')
    .reduce((acc, i) => acc + i.total, 0);

  const handlePayNow = (invoiceId: string) => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      onPayInvoice(invoiceId);
      setIsProcessingPayment(false);
      setShowPaymentSuccess(true);
      if (selectedInvoice) {
        setSelectedInvoice({
          ...selectedInvoice,
          status: 'Paid',
          paymentMethod: 'Corporate Card Instant Settlement',
        });
      }
    }, 1500);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Invoice Number,Date,Due Date,Subtotal,Tax,Total,Status\n';
    const csvRows = invoices
      .map(
        (i) =>
          `${i.invoiceNumber},${i.date},${i.dueDate},$${i.amount},$${i.tax},$${i.total},${i.status}`
      )
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GoogleWorkspace_Client_Invoices.csv';
    a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[var(--m3-primary)]" />
            Invoices & Billing Statements
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Corporate ACH, Corporate Card, and Wire Transfer processing with instant receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <M3Button
            variant="outlined"
            size="sm"
            onClick={handleRefreshData}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </M3Button>

          <M3Button
            variant="outlined"
            size="sm"
            onClick={handleTriggerError}
            icon={<AlertTriangle className="w-3.5 h-3.5 text-[var(--m3-warning)]" />}
          >
            Test Error
          </M3Button>

          <M3Button
            variant="filled"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateInvoiceOpen(true)}
          >
            Create Invoice
          </M3Button>

          <M3Button
            variant="tonal"
            icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export CSV
          </M3Button>
          <M3Button
            variant="tonal"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={openAiAssistant}
          >
            Analyze Billing
          </M3Button>
        </div>
      </div>

      {/* Auto-Recurring Subscription Billing Banner */}
      <div className="p-4 rounded-3xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-[var(--m3-on-surface)] flex items-center gap-2">
              Auto-Recurring Monthly Subscription Invoicing
              <M3Badge variant={isAutoRecurringEnabled ? 'success' : 'outline'}>
                {isAutoRecurringEnabled ? 'ACTIVE' : 'PAUSED'}
              </M3Badge>
            </h3>
            <p className="text-[11px] text-[var(--m3-on-surface-variant)] mt-0.5">
              Next scheduled auto-charge: <span className="font-semibold text-[var(--m3-on-surface)]">August 1, 2026</span> via Corporate ACH Direct Debit.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAutoRecurringEnabled((prev) => !prev)}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border shrink-0 ${
            isAutoRecurringEnabled
              ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] border-transparent'
              : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] border-[var(--m3-outline-variant)]'
          }`}
        >
          {isAutoRecurringEnabled ? 'Auto-Pay Enabled' : 'Enable Auto-Pay'}
        </button>
      </div>

      {/* Outstanding Summary Banner */}
      {totalBalance > 0 && (
        <M3Card
          variant="filled"
          className="p-6 bg-gradient-to-r from-[var(--m3-warning-container)]/80 to-[var(--m3-surface-container-high)] border border-[var(--m3-warning-container)] text-[var(--m3-on-surface)] flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--m3-warning-container)] text-[var(--m3-on-warning-container)]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--m3-on-surface)]">
                Outstanding Balance: ${totalBalance.toLocaleString()} USD
              </h3>
              <p className="text-xs text-[var(--m3-on-surface-variant)]">
                Net-20 Terms active. Select an invoice below to settle balance with 1-click ACH or Corporate Card.
              </p>
            </div>
          </div>
        </M3Card>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--m3-on-surface-variant)] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice number or notes..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--m3-surface-container)] text-xs rounded-full focus:outline-hidden text-[var(--m3-on-surface)] placeholder-[var(--m3-on-surface-variant)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(['All', 'Pending', 'Paid'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                  : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Data Grid Table */}
      <M3Card variant="filled" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--m3-on-surface)]">
            <thead className="bg-[var(--m3-surface-container-high)] border-b border-[var(--m3-outline-variant)] text-[var(--m3-on-surface-variant)] uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Issued Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4">Total Tax</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--m3-outline-variant)]">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-[var(--m3-surface-container-low)] transition-colors"
                >
                  <td className="p-4 font-bold text-xs">{inv.invoiceNumber}</td>
                  <td className="p-4 text-[var(--m3-on-surface-variant)]">{inv.date}</td>
                  <td className="p-4 text-[var(--m3-on-surface-variant)]">{inv.dueDate}</td>
                  <td className="p-4">${inv.amount.toLocaleString()}</td>
                  <td className="p-4">${inv.tax.toLocaleString()}</td>
                  <td className="p-4 font-bold text-sm text-[var(--m3-on-surface)]">
                    ${inv.total.toLocaleString()} USD
                  </td>
                  <td className="p-4">
                    <M3Badge
                      variant={
                        inv.status === 'Paid'
                          ? 'success'
                          : inv.status === 'Pending'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {inv.status}
                    </M3Badge>
                  </td>
                  <td className="p-4 text-right">
                    <M3Button
                      variant="tonal"
                      size="sm"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      View & Pay
                    </M3Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </M3Card>

      {/* Invoice Detail & Payment Modal */}
      {selectedInvoice && (
        <M3Dialog
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Statement: ${selectedInvoice.invoiceNumber}`}
          icon={<Receipt className="w-5 h-5" />}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Payment Banner */}
            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[var(--m3-on-surface-variant)]">Total Due Amount</p>
                <p className="text-2xl font-bold text-[var(--m3-on-surface)]">
                  ${selectedInvoice.total.toLocaleString()} USD
                </p>
              </div>

              {selectedInvoice.status === 'Pending' ? (
                <M3Button
                  variant="filled"
                  size="lg"
                  disabled={isProcessingPayment}
                  icon={<CreditCard className="w-5 h-5" />}
                  onClick={() => handlePayNow(selectedInvoice.id)}
                >
                  {isProcessingPayment ? 'Processing ACH...' : 'Pay Invoice Now'}
                </M3Button>
              ) : (
                <M3Badge variant="success" size="md" icon={<Check className="w-4 h-4" />}>
                  Paid via {selectedInvoice.paymentMethod || 'Corporate ACH'}
                </M3Badge>
              )}
            </div>

            {/* Success Micro Animation Banner */}
            {showPaymentSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-[var(--m3-success-container)] text-[var(--m3-on-success-container)] flex items-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <p className="font-bold text-xs">Payment Cleared Successfully!</p>
                  <p className="text-[11px]">
                    Electronic receipt #RCT-{selectedInvoice.id.slice(-6).toUpperCase()} archived in File Manager.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Line Items Table */}
            <div>
              <h4 className="text-xs font-bold text-[var(--m3-on-surface)] mb-2">
                Deliverable Line Items
              </h4>
              <div className="rounded-2xl border border-[var(--m3-outline-variant)] overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]">
                    <tr>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Rate</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--m3-outline-variant)]">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-medium">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">${item.rate.toLocaleString()}</td>
                        <td className="p-3 text-right font-semibold">
                          ${item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <p className="text-[11px] text-[var(--m3-on-surface-variant)]">
              {selectedInvoice.notes}
            </p>
          </div>
        </M3Dialog>
      )}

      {/* Modal: Create Custom Invoice */}
      <M3Dialog
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        title="Create & Issue Custom Client Invoice"
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Invoice Number *</label>
              <input
                type="text"
                required
                value={newInvNumber}
                onChange={(e) => setNewInvNumber(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] text-[var(--m3-on-surface)] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={newInvDueDate}
                onChange={(e) => setNewInvDueDate(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] text-[var(--m3-on-surface)] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold">Line Items Breakdown</label>
              <button
                type="button"
                onClick={addLineItem}
                className="text-[11px] font-bold text-[var(--m3-primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)]">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                    placeholder="Description"
                    className="flex-1 p-1.5 rounded-lg bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] text-xs border border-[var(--m3-outline-variant)]"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="w-14 p-1.5 rounded-lg bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] text-xs border border-[var(--m3-outline-variant)] text-center"
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateLineItem(idx, 'rate', e.target.value)}
                    placeholder="Rate ($)"
                    className="w-20 p-1.5 rounded-lg bg-[var(--m3-surface-container)] text-[var(--m3-on-surface)] text-xs border border-[var(--m3-outline-variant)] text-right"
                  />
                  <span className="w-20 font-bold text-right text-[var(--m3-on-surface)]">
                    ${item.amount.toLocaleString()}
                  </span>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(idx)}
                      className="p-1 text-[var(--m3-error)] hover:bg-[var(--m3-error-container)]/20 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--m3-surface-container-high)] space-y-1 text-right font-medium">
            <p className="text-[var(--m3-on-surface-variant)]">
              Subtotal: <span className="font-bold text-[var(--m3-on-surface)]">${subtotalNewInv.toLocaleString()} USD</span>
            </p>
            <p className="text-[var(--m3-on-surface-variant)]">
              Tax (8.25%): <span className="font-bold text-[var(--m3-on-surface)]">${taxNewInv.toLocaleString()} USD</span>
            </p>
            <p className="text-sm font-bold text-[var(--m3-primary)] pt-1 border-t border-[var(--m3-outline-variant)]">
              Total Issued Amount: ${totalNewInv.toLocaleString()} USD
            </p>
          </div>

          <div>
            <label className="font-semibold block mb-1">Billing Notes / Terms</label>
            <input
              type="text"
              value={newInvNotes}
              onChange={(e) => setNewInvNotes(e.target.value)}
              className="w-full p-2.5 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] text-[var(--m3-on-surface)] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <M3Button variant="text" onClick={() => setIsCreateInvoiceOpen(false)}>
              Cancel
            </M3Button>
            <M3Button variant="filled" type="submit">
              Issue & Save Invoice
            </M3Button>
          </div>
        </form>
      </M3Dialog>
    </div>
  );
};
