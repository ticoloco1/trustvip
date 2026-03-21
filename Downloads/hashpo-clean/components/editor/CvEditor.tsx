'use client';
import { useState } from 'react';
import { Briefcase, GraduationCap, Code, MapPin, Plus, Trash2, Mail, Phone, Lock } from 'lucide-react';

interface Experience { title:string; company:string; period:string; description:string; }
interface Education { degree:string; institution:string; year:string; }
interface Props {
  cvContent:string; setCvContent:(v:string)=>void;
  cvHeadline:string; setCvHeadline:(v:string)=>void;
  cvLocation:string; setCvLocation:(v:string)=>void;
  cvSkills:string[]; setCvSkills:(v:string[])=>void;
  cvExperience:Experience[]; setCvExperience:(v:Experience[])=>void;
  cvEducation:Education[]; setCvEducation:(v:Education[])=>void;
  contactEmail:string; setContactEmail:(v:string)=>void;
  contactPhone:string; setContactPhone:(v:string)=>void;
  contactPrice:string; setContactPrice:(v:string)=>void;
}

const inp = "w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-xs outline-none focus:border-purple-400 transition-colors placeholder-gray-500";
const ta = `${inp} resize-vertical`;

export default function CvEditor({ cvContent,setCvContent,cvHeadline,setCvHeadline,cvLocation,setCvLocation,cvSkills,setCvSkills,cvExperience,setCvExperience,cvEducation,setCvEducation,contactEmail,setContactEmail,contactPhone,setContactPhone,contactPrice,setContactPrice }:Props) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !cvSkills.includes(newSkill.trim())) {
      setCvSkills([...cvSkills, newSkill.trim()]); setNewSkill('');
    }
  };
  const addExp = () => setCvExperience([...cvExperience,{title:'',company:'',period:'',description:''}]);
  const updExp = (i:number,f:string,v:string) => { const a=[...cvExperience]; (a[i] as any)[f]=v; setCvExperience(a); };
  const delExp = (i:number) => setCvExperience(cvExperience.filter((_,idx)=>idx!==i));
  const addEdu = () => setCvEducation([...cvEducation,{degree:'',institution:'',year:''}]);
  const updEdu = (i:number,f:string,v:string) => { const a=[...cvEducation]; (a[i] as any)[f]=v; setCvEducation(a); };
  const delEdu = (i:number) => setCvEducation(cvEducation.filter((_,idx)=>idx!==i));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1"><Briefcase className="w-3 h-3"/> Headline</label><input value={cvHeadline} onChange={e=>setCvHeadline(e.target.value)} placeholder="Full Stack Dev | 5 years" className={inp}/></div>
        <div><label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1"><MapPin className="w-3 h-3"/> Location</label><input value={cvLocation} onChange={e=>setCvLocation(e.target.value)} placeholder="São Paulo, BR" className={inp}/></div>
      </div>
      <div><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">About / Bio Professional</label><textarea value={cvContent} onChange={e=>setCvContent(e.target.value)} placeholder="Describe your experience..." rows={4} className={ta}/></div>
      
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-2"><Code className="w-3 h-3"/> Skills</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {cvSkills.map((s,i)=>(
            <span key={i} className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
              {s}<button onClick={()=>setCvSkills(cvSkills.filter((_,idx)=>idx!==i))} className="hover:text-red-400">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newSkill} onChange={e=>setNewSkill(e.target.value)} placeholder="Add skill..." className={`${inp} flex-1`} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addSkill())}/>
          <button onClick={addSkill} className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold"><Plus className="w-3.5 h-3.5"/></button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Briefcase className="w-3 h-3"/> Experience</label>
          <button onClick={addExp} className="flex items-center gap-1 text-[10px] text-purple-400 font-bold hover:underline"><Plus className="w-3 h-3"/> Add</button>
        </div>
        {cvExperience.map((exp,i)=>(
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2 mb-2">
            <div className="flex items-start gap-2">
              <div className="grid grid-cols-3 gap-2 flex-1">
                <input value={exp.title} onChange={e=>updExp(i,'title',e.target.value)} placeholder="Job title" className={inp}/>
                <input value={exp.company} onChange={e=>updExp(i,'company',e.target.value)} placeholder="Company" className={inp}/>
                <input value={exp.period} onChange={e=>updExp(i,'period',e.target.value)} placeholder="2020–Now" className={inp}/>
              </div>
              <button onClick={()=>delExp(i)} className="text-red-400 hover:text-red-300 mt-1 shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
            <textarea value={exp.description} onChange={e=>updExp(i,'description',e.target.value)} placeholder="Description..." rows={2} className={ta}/>
          </div>
        ))}
        {cvExperience.length===0&&<p className="text-[10px] text-gray-500 italic">No experience. Click "Add" to start.</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><GraduationCap className="w-3 h-3"/> Education</label>
          <button onClick={addEdu} className="flex items-center gap-1 text-[10px] text-purple-400 font-bold hover:underline"><Plus className="w-3 h-3"/> Add</button>
        </div>
        {cvEducation.map((edu,i)=>(
          <div key={i} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-3 mb-2">
            <input value={edu.degree} onChange={e=>updEdu(i,'degree',e.target.value)} placeholder="Degree" className={`${inp} flex-1`}/>
            <input value={edu.institution} onChange={e=>updEdu(i,'institution',e.target.value)} placeholder="Institution" className={`${inp} flex-1`}/>
            <input value={edu.year} onChange={e=>updEdu(i,'year',e.target.value)} placeholder="Year" className={`${inp} w-20`}/>
            <button onClick={()=>delEdu(i)} className="text-red-400 hover:text-red-300 shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
          </div>
        ))}
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
        <p className="text-xs font-bold text-white flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-purple-400"/> Contact Info (Locked — Paid Unlock)</p>
        <p className="text-[10px] text-gray-400">Companies pay to unlock. Revenue split 50/50.</p>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1"><Mail className="w-3 h-3"/> Email</label><input value={contactEmail} onChange={e=>setContactEmail(e.target.value)} placeholder="your@email.com" className={inp}/></div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1"><Phone className="w-3 h-3"/> Phone</label><input value={contactPhone} onChange={e=>setContactPhone(e.target.value)} placeholder="+55..." className={inp}/></div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Unlock Price (USDC)</label>
          <div className="flex items-center gap-2">
            <input type="number" value={contactPrice} onChange={e=>setContactPrice(e.target.value)} min="1" className={`${inp} w-28`}/>
            <span className="text-[10px] text-gray-400">You receive: ${(parseFloat(contactPrice||'0')/2).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
