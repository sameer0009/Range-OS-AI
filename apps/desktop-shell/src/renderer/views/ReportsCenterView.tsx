import { useState } from 'react';
import { Card, Badge, Button } from '@rangeos/ui';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  History, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  MoreVertical,
  Printer,
  FileSignature
} from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: 1,
    title: "Post-Incident Analysis: Subnet B Breach",
    type: "INCIDENT",
    status: "FINALIZED",
    author: "ROOT_ADMIN",
    version: "1.2.0",
    date: "2026-04-18"
  },
  {
    id: 2,
    title: "Quarterly Pentest: Finance Segment",
    type: "PENTEST",
    status: "DRAFT",
    author: "SEC_ENG_01",
    version: "0.8.4",
    date: "2026-04-15"
  },
  {
    id: 3,
    title: "Forensic Analysis: Seized Workstation #42",
    type: "FORENSIC",
    status: "FINALIZED",
    author: "ROOT_ADMIN",
    version: "1.0.0",
    date: "2026-04-12"
  }
];

export default function ReportsCenterView() {
  const [selectedReportId, setSelectedReportId] = useState<number>(1);
  const activeReport = MOCK_REPORTS.find(r => r.id === selectedReportId) || MOCK_REPORTS[0];

  return (
    <div className="flex h-full max-w-[1600px] mx-auto overflow-hidden gap-6 p-2">
      
      {/* Column 1: Report Library (35%) */}
      <div className="w-[450px] flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} /> Mission Library
           </h2>
           <Button size="sm" variant="ghost">
              <Filter size={14} />
           </Button>
        </div>

        <div className="relative group">
           <div className="absolute inset-0 bg-cyber-primary/5 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
           <div className="relative flex items-center gap-2 bg-cyber-surface/50 border border-cyber-surface-elevated rounded-lg p-2 px-3">
              <Search size={14} className="text-gray-500" />
              <input 
                placeholder="Search documents by id, title, or tags..." 
                className="bg-transparent border-none focus:ring-0 text-[10px] font-mono text-white w-full uppercase tracking-tighter"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {MOCK_REPORTS.map(report => (
            <div 
              key={report.id}
              onClick={() => setSelectedReportId(report.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                selectedReportId === report.id 
                  ? 'bg-cyber-primary/10 border-cyber-primary shadow-glow-primary/20' 
                  : 'bg-cyber-surface/30 border-cyber-surface-elevated hover:bg-cyber-surface/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                 <Badge variant={report.type === 'FORENSIC' ? 'forensic' : report.type === 'INCIDENT' ? 'alert' : 'primary'}>
                    {report.type}
                 </Badge>
                 <span className="text-[9px] font-mono text-gray-500 uppercase">{report.date}</span>
              </div>
              <h3 className={`text-sm font-mono font-bold uppercase tracking-tight line-clamp-2 mb-3 ${
                 selectedReportId === report.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
              }`}>
                 {report.title}
              </h3>
              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                 <div className="flex items-center gap-2">
                    {report.status === 'FINALIZED' ? <CheckCircle2 size={12} className="text-cyber-ht" /> : <Clock size={12} className="text-gray-600" />}
                    <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest">{report.status}</span>
                 </div>
                 <span className="text-[10px] font-mono font-bold text-cyber-primary">v{report.version}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Document Master (Center) */}
      <div className="flex-1 flex flex-col bg-cyber-surface/30 border border-cyber-surface-elevated rounded-xl overflow-hidden backdrop-blur-md">
        
        {/* Document HUD */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-surface-elevated bg-cyber-surface/50">
           <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                 {[1, 2].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border border-cyber-background bg-cyber-surface-elevated flex items-center justify-center text-[9px] font-mono text-gray-400">
                       RA
                    </div>
                 ))}
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Collaborators: 2 Active</span>
           </div>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="px-2">
                 <History size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="px-2 text-cyber-primary">
                 <FileSignature size={16} className="mr-2" /> Sign
              </Button>
              <Button variant="primary" size="sm" className="px-4">
                 <Download size={16} className="mr-2" /> Export
              </Button>
           </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 overflow-y-auto bg-cyber-background p-12 custom-scrollbar">
           <div className="max-w-[800px] mx-auto bg-white/5 border border-white/10 rounded-sm shadow-2xl p-16 relative min-h-[1000px]">
              
              {/* RangeOS Watermark */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] select-none">
                 <div className="absolute rotate-[35deg] -top-20 -right-20 text-[180px] font-black font-mono">RangeOS</div>
                 <div className="absolute rotate-[35deg] top-1/2 left-0 text-[180px] font-black font-mono -translate-y-1/2">AI_CORE</div>
              </div>

              {/* Document Header */}
              <div className="flex justify-between items-start border-b-2 border-cyber-primary pb-8 mb-12 relative z-10">
                 <div>
                    <h1 className="text-4xl font-mono font-black text-white uppercase tracking-tighter leading-none mb-2">
                       {activeReport.type} REPORT
                    </h1>
                    <p className="text-cyber-primary font-mono text-xs uppercase tracking-[0.4em] font-bold">Confidential Level Hi-Trust</p>
                 </div>
                 <div className="text-right font-mono">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Document ID</div>
                    <div className="text-sm text-white font-bold">#{activeReport.id.toString().padStart(5, '0')}</div>
                 </div>
              </div>

              {/* Document Metadata Grid */}
              <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
                 <div className="border border-white/5 p-4 rounded bg-white/[0.02]">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Investigation Subject</span>
                    <span className="text-sm font-mono text-white font-bold uppercase">{activeReport.title}</span>
                 </div>
                 <div className="border border-white/5 p-4 rounded bg-white/[0.02]">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">Platform Status</span>
                    <span className="text-sm font-mono text-white font-bold uppercase">{activeReport.status} // V{activeReport.version}</span>
                 </div>
              </div>

              {/* Body Placeholder */}
              <div className="space-y-10 relative z-10">
                 <section className="space-y-4">
                    <h3 className="text-lg font-mono font-bold text-cyber-primary uppercase tracking-widest flex items-center gap-4">
                       1.0 Executive Summary <div className="h-px flex-1 bg-cyber-primary/20" />
                    </h3>
                    <p className="text-sm text-gray-300 font-mono leading-relaxed">
                       On {activeReport.date}, lateral movement was detected in Subnet B following a series of high-severity alerts from the Domain Master. 
                       Investigation suggests that the initial access was gained through a compromised VPN credential, which was subsequently 
                       leveraged for a DCShadow attack simulation. All compromised segments have successfully been isolated and sanitized.
                    </p>
                 </section>

                 <section className="space-y-4">
                    <h3 className="text-lg font-mono font-bold text-cyber-primary uppercase tracking-widest flex items-center gap-4">
                       2.0 Technical Findings <div className="h-px flex-1 bg-cyber-primary/20" />
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { id: 'F01', title: 'Unauthorized LDAP Querying', severity: 'CRITICAL' },
                         { id: 'F02', title: 'LSASS Memory Dumping', severity: 'HIGH' }
                       ].map(finding => (
                         <div key={finding.id} className="p-4 border border-white/5 bg-white/[0.01] rounded flex justify-between items-center group cursor-pointer hover:bg-white/[0.03]">
                            <div className="flex items-center gap-4">
                               <span className="text-[10px] font-mono font-bold text-gray-600">{finding.id}</span>
                               <span className="text-xs font-mono text-white font-bold uppercase">{finding.title}</span>
                            </div>
                            <Badge variant={finding.severity === 'CRITICAL' ? 'alert' : 'primary'}>{finding.severity}</Badge>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>

              {/* Footer */}
              <div className="mt-20 border-t border-white/5 pt-8 text-center text-[9px] font-mono text-gray-600 relative z-10">
                 RANGEOS AI AUTONOMOUS REPORTING CORE // SIGNED BY {activeReport.author} // {new Date().toLocaleDateString()}
              </div>

           </div>
        </div>
      </div>

    </div>
  );
}
