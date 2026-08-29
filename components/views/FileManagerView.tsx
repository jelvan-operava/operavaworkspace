import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Folder,
  FileText,
  Upload,
  Download,
  Share2,
  Search,
  Grid,
  List as ListIcon,
  FolderPlus,
  Copy,
  Check,
  Clock,
  User,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { M3Dialog } from '../ui/M3Dialog';
import { FileItem } from '@/lib/mock-data';

export interface FileManagerViewProps {
  files: FileItem[];
  onUploadFile: (file: Omit<FileItem, 'id'>) => void;
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({
  files,
  onUploadFile,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const folders = ['All', 'Contracts', 'Deliverables', 'Invoices', 'Brand Assets', 'Reports'];

  const filteredFiles = files.filter((f) => {
    const matchesFolder = selectedFolder === 'All' ? true : f.folder === selectedFolder;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      onUploadFile({
        name: droppedFile.name,
        folder: (selectedFolder === 'All' ? 'Deliverables' : selectedFolder) as any,
        size: `${(droppedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        updatedAt: new Date().toISOString().split('T')[0],
        type: 'pdf',
        version: 'v1.0',
        author: 'Julian Vance',
      });
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`https://workspace.google.app/files/share/${selectedFile?.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <Folder className="w-6 h-6 text-[var(--m3-primary)]" />
            File Manager & Asset Vault
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Cloud storage for legal contracts, Figma design tokens, invoice receipts, and project deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full text-xs cursor-pointer transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                  : 'text-[var(--m3-on-surface-variant)]'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full text-xs cursor-pointer transition-colors ${
                viewMode === 'list'
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                  : 'text-[var(--m3-on-surface-variant)]'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <M3Button
            variant="filled"
            icon={<Upload className="w-4 h-4" />}
            onClick={() => {
              onUploadFile({
                name: `Client_Deliverable_${Date.now().toString().slice(-4)}.pdf`,
                folder: 'Deliverables',
                size: '3.1 MB',
                updatedAt: new Date().toISOString().split('T')[0],
                type: 'pdf',
                version: 'v1.0',
                author: 'Julian Vance',
              });
            }}
          >
            Upload File
          </M3Button>
        </div>
      </div>

      {/* Drag & Drop Zone Banner */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleSimulatedDrop}
        className={`p-6 rounded-3xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer ${
          isDragging
            ? 'border-[var(--m3-primary)] bg-[var(--m3-primary-container)]/30 scale-102'
            : 'border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container-low)] hover:bg-[var(--m3-surface-container-high)]'
        }`}
      >
        <Upload className="w-8 h-8 text-[var(--m3-primary)] animate-bounce" />
        <p className="font-bold text-xs text-[var(--m3-on-surface)]">
          Drag & Drop assets here to upload to target folder
        </p>
        <p className="text-[11px] text-[var(--m3-on-surface-variant)]">
          Supports PDF, CSV, PNG, DOC, ZIP files up to 500MB
        </p>
      </div>

      {/* Folder Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-low)] border border-[var(--m3-outline-variant)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer shrink-0 ${
                selectedFolder === f
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] font-bold'
                  : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] hover:bg-[var(--m3-surface-container-high)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--m3-on-surface-variant)] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files or author..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--m3-surface-container)] text-xs rounded-full focus:outline-hidden text-[var(--m3-on-surface)] placeholder-[var(--m3-on-surface-variant)]"
          />
        </div>
      </div>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <M3Card
              key={file.id}
              variant="filled"
              elevation={1}
              interactive
              onClick={() => setSelectedFile(file)}
              className="p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]">
                  <FileText className="w-6 h-6 text-[var(--m3-primary)]" />
                </div>
                <M3Badge variant="outline" size="sm">{file.version}</M3Badge>
              </div>

              <div>
                <h3 className="font-bold text-xs text-[var(--m3-on-surface)] truncate">
                  {file.name}
                </h3>
                <p className="text-[11px] text-[var(--m3-on-surface-variant)]">
                  Folder: {file.folder} • {file.size}
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-[11px] text-[var(--m3-on-surface-variant)]">
                <span>By {file.author}</span>
                <span>{file.updatedAt}</span>
              </div>
            </M3Card>
          ))}
        </div>
      ) : (
        <M3Card variant="filled" className="p-2 space-y-1">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="p-3.5 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] hover:border-[var(--m3-primary)] transition-all cursor-pointer flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-5 h-5 text-[var(--m3-primary)] shrink-0" />
                <span className="font-bold text-[var(--m3-on-surface)] truncate">{file.name}</span>
              </div>
              <div className="flex items-center gap-6 text-[var(--m3-on-surface-variant)] shrink-0">
                <span>{file.folder}</span>
                <span>{file.size}</span>
                <span>{file.updatedAt}</span>
              </div>
            </div>
          ))}
        </M3Card>
      )}

      {/* File Details Drawer */}
      {selectedFile && (
        <M3Dialog
          isOpen={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          title={`File Details: ${selectedFile.name}`}
          icon={<FileText className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-lowest)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Folder Location:</span>
                <span className="font-bold">{selectedFile.folder}</span>
              </div>
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="font-bold">{selectedFile.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{selectedFile.updatedAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Uploaded By:</span>
                <span>{selectedFile.author}</span>
              </div>
              <div className="flex justify-between">
                <span>Version Tag:</span>
                <span className="font-bold text-[var(--m3-primary)]">{selectedFile.version}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <M3Button
                variant="outlined"
                icon={copiedLink ? <Check className="w-4 h-4 text-[var(--m3-success)]" /> : <Share2 className="w-4 h-4" />}
                onClick={copyShareLink}
              >
                {copiedLink ? 'Link Copied!' : 'Copy Share Link'}
              </M3Button>
              <M3Button
                variant="filled"
                icon={<Download className="w-4 h-4" />}
                onClick={() => alert(`Downloading ${selectedFile.name}`)}
              >
                Download File
              </M3Button>
            </div>
          </div>
        </M3Dialog>
      )}
    </div>
  );
};
