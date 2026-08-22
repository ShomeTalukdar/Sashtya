import React, { useState } from 'react';
import { 
  Users, 
  Lock, 
  Check, 
  X, 
  History, 
  UserPlus, 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  Activity,
  HeartPulse
} from 'lucide-react';
import { FamilyMember, FamilyPermission, FamilyRelationship, FamilyMedicalHistoryItem } from '../../types';
import { FamilyService } from '../../services/familyService';

export const FamilyPage: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(FamilyService.getFamilyMembers());
  const [familyHistory, setFamilyHistory] = useState<FamilyMedicalHistoryItem[]>(FamilyService.getFamilyHistory());
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddDiseaseOpen, setIsAddDiseaseOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Add Family Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState<FamilyRelationship>('Child');
  const [newMemberAge, setNewMemberAge] = useState<number>(25);
  const [newMemberPhone, setNewMemberPhone] = useState('+91 ');
  const [newMemberPerms, setNewMemberPerms] = useState<FamilyPermission>({
    canViewAppointments: true,
    canManageMedications: true,
    canViewEmergencyCard: true,
    canViewMedicalDocuments: false,
    canViewInsurance: false
  });

  // Add Disease Form State
  const [newConditionName, setNewConditionName] = useState('');
  const [selectedAffectedMembers, setSelectedAffectedMembers] = useState<string[]>([]);
  const [newDiseaseNotes, setNewDiseaseNotes] = useState('');

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleTogglePermission = (memberId: string, permKey: keyof FamilyPermission) => {
    const member = familyMembers.find(m => m.id === memberId);
    if (member) {
      const updatedPerms = {
        ...member.permissions,
        [permKey]: !member.permissions[permKey]
      };
      const updatedList = FamilyService.updatePermissions(memberId, updatedPerms);
      setFamilyMembers(updatedList);
      if (selectedMember?.id === memberId) {
        setSelectedMember({ ...member, permissions: updatedPerms });
      }
    }
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const updatedList = FamilyService.addFamilyMember({
      fullName: newMemberName.trim(),
      relationship: newMemberRel,
      age: newMemberAge,
      phone: newMemberPhone,
      permissions: newMemberPerms
    });

    setFamilyMembers(updatedList);
    setIsAddMemberOpen(false);
    setNewMemberName('');
    setNewMemberAge(25);
    setNewMemberPhone('+91 ');
    triggerNotification(`Successfully added ${newMemberName} to your family profiles!`);
  };

  const handleDeleteMember = (memberId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your family list?`)) {
      const updated = FamilyService.deleteFamilyMember(memberId);
      setFamilyMembers(updated);
      if (selectedMember?.id === memberId) setSelectedMember(null);
      triggerNotification(`Removed ${name} from family profiles.`);
    }
  };

  const handleAddDiseaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConditionName.trim()) return;

    const affected = selectedAffectedMembers.length > 0 ? selectedAffectedMembers : ['Self / General Family'];
    const updatedHistory = FamilyService.addFamilyHistory({
      conditionName: newConditionName.trim(),
      affectedMembers: affected,
      notes: newDiseaseNotes.trim()
    });

    setFamilyHistory(updatedHistory);
    setIsAddDiseaseOpen(false);
    setNewConditionName('');
    setSelectedAffectedMembers([]);
    setNewDiseaseNotes('');
    triggerNotification(`Added "${newConditionName}" to Family Medical History!`);
  };

  const handleDeleteDisease = (historyId: string, conditionName: string) => {
    const updated = FamilyService.deleteFamilyHistory(historyId);
    setFamilyHistory(updated);
    triggerNotification(`Removed "${conditionName}" from family history.`);
  };

  const toggleAffectedMemberSelection = (memberNameOrRel: string) => {
    if (selectedAffectedMembers.includes(memberNameOrRel)) {
      setSelectedAffectedMembers(selectedAffectedMembers.filter(m => m !== memberNameOrRel));
    } else {
      setSelectedAffectedMembers([...selectedAffectedMembers, memberNameOrRel]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-purple-700" />
            <span>My Family & Caregiver Hub</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Add family profiles, assign caregiver consent permissions, & track hereditary medical history.
          </p>
        </div>

        {/* Action Buttons: Add Family Member & Add Diseases */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Add Family Member Button */}
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Family Member</span>
          </button>

          {/* Add Disease / Medical Condition Button */}
          <button
            onClick={() => setIsAddDiseaseOpen(true)}
            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 shrink-0"
          >
            <HeartPulse className="w-4 h-4" />
            <span>+ Add Disease / Condition</span>
          </button>

        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Privacy & Consent Banner */}
      <div className="bg-purple-50 border border-purple-200 p-4 rounded-3xl text-xs font-semibold text-purple-900 flex items-start gap-3">
        <Lock className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <strong>Strict Consent Rule (Section 38):</strong> SWASTYA never automatically exposes complete medical records to family members without explicit user authorization. You control exactly what each family member can view or manage.
        </div>
      </div>

      {/* Family Member Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            FAMILY MEMBERS & CAREGIVERS ({familyMembers.length})
          </h3>
          <span className="text-xs text-purple-700 font-bold">Click + Add Family Member to add more</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyMembers.map((member) => (
            <div 
              key={member.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-4 hover:shadow-cardHover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                        {member.relationship}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-0.5">{member.fullName} ({member.age} yrs)</h3>
                      <p className="text-xs text-slate-500 font-medium">{member.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-extrabold text-xs transition-colors"
                    >
                      Consent
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id, member.fullName)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove Family Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Permissions Matrix Pills */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs mt-3">
                  <span className="font-bold text-slate-400 text-[10px] uppercase">Active Consent Permissions</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] ${
                      member.permissions.canViewAppointments ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {member.permissions.canViewAppointments ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>Appointments</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] ${
                      member.permissions.canManageMedications ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {member.permissions.canManageMedications ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>Medications</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] ${
                      member.permissions.canViewEmergencyCard ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {member.permissions.canViewEmergencyCard ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>Emergency Card</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] ${
                      member.permissions.canViewMedicalDocuments ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {member.permissions.canViewMedicalDocuments ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>Documents</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family Medical History & Diseases Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-red-600" />
            <span>Family Health History & Diseases ({familyHistory.length})</span>
          </h3>
          <button
            onClick={() => setIsAddDiseaseOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Disease</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {familyHistory.map((item) => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:bg-red-50/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="font-extrabold text-slate-900 text-sm sm:text-base">{item.conditionName}</strong>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold text-[10px] uppercase">
                    Hereditary / Recorded Condition
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span className="font-bold text-slate-500">Affected Family Members:</span>
                  {item.affectedMembers.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-bold text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-500 font-medium italic mt-1">
                    Note: "{item.notes}"
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDeleteDisease(item.id, item.conditionName)}
                className="p-2 rounded-xl bg-white hover:bg-red-100 text-slate-400 hover:text-red-700 transition-colors border border-slate-200 shrink-0"
                title="Delete Disease History Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: ADD FAMILY MEMBER */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddMemberSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-700" />
                <span>Add New Family Member</span>
              </h3>
              <button type="button" onClick={() => setIsAddMemberOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Ramesh Patnaik, Sunita Sharma..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-900 focus:border-purple-700 focus:bg-white transition-all text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                  <select
                    value={newMemberRel}
                    onChange={(e) => setNewMemberRel(e.target.value as FamilyRelationship)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-900 focus:border-purple-700 focus:bg-white"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Caregiver">Caregiver</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={newMemberAge}
                    onChange={(e) => setNewMemberAge(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-900 focus:border-purple-700"
                    required
                    min={1}
                    max={120}
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-900 focus:border-purple-700"
                  required
                />
              </div>

              {/* Initial Consent Permissions Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-800 block">Initial Consent Permissions:</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMemberPerms.canViewAppointments}
                      onChange={(e) => setNewMemberPerms({ ...newMemberPerms, canViewAppointments: e.target.checked })}
                      className="w-4 h-4 text-purple-700 rounded"
                    />
                    <span>Appointments</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMemberPerms.canManageMedications}
                      onChange={(e) => setNewMemberPerms({ ...newMemberPerms, canManageMedications: e.target.checked })}
                      className="w-4 h-4 text-purple-700 rounded"
                    />
                    <span>Medications</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMemberPerms.canViewEmergencyCard}
                      onChange={(e) => setNewMemberPerms({ ...newMemberPerms, canViewEmergencyCard: e.target.checked })}
                      className="w-4 h-4 text-purple-700 rounded"
                    />
                    <span>Emergency Card</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newMemberPerms.canViewMedicalDocuments}
                      onChange={(e) => setNewMemberPerms({ ...newMemberPerms, canViewMedicalDocuments: e.target.checked })}
                      className="w-4 h-4 text-purple-700 rounded"
                    />
                    <span>Documents</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md"
              >
                Save Family Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: ADD FAMILY DISEASE / CONDITION */}
      {isAddDiseaseOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddDiseaseSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                <span>Add Family Disease / Condition</span>
              </h3>
              <button type="button" onClick={() => setIsAddDiseaseOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Disease / Condition Name</label>
                <input
                  type="text"
                  value={newConditionName}
                  onChange={(e) => setNewConditionName(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma, Thyroid Disorder..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none font-semibold text-slate-900 focus:border-red-600 focus:bg-white transition-all text-sm"
                  required
                />
              </div>

              {/* Select Affected Family Members */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Affected Family Member(s)</label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 max-h-36 overflow-y-auto">
                  {familyMembers.map((m) => {
                    const isSelected = selectedAffectedMembers.includes(m.fullName) || selectedAffectedMembers.includes(m.relationship);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => toggleAffectedMemberSelection(m.fullName)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                          isSelected
                            ? 'bg-red-600 text-white border-red-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{m.fullName} ({m.relationship})
                      </button>
                    );
                  })}
                  {['Father', 'Mother', 'Grandmother', 'Grandfather', 'Self'].map((rel) => {
                    if (!familyMembers.some(m => m.relationship === rel || m.fullName === rel)) {
                      const isSelected = selectedAffectedMembers.includes(rel);
                      return (
                        <button
                          type="button"
                          key={rel}
                          onClick={() => toggleAffectedMemberSelection(rel)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                            isSelected
                              ? 'bg-red-600 text-white border-red-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{rel}
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Medical Notes & Treatment History (Optional)</label>
                <textarea
                  value={newDiseaseNotes}
                  onChange={(e) => setNewDiseaseNotes(e.target.value)}
                  placeholder="e.g. Diagnosed in 2018, daily insulin therapy, regular eye & kidney screenings..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 outline-none font-semibold text-slate-900 focus:border-red-600 focus:bg-white h-20 resize-none"
                />
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddDiseaseOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md"
              >
                Save Disease Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Permission Consent Matrix Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">
                Consent Matrix: {selectedMember.fullName}
              </h3>
              <button onClick={() => setSelectedMember(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {(Object.keys(selectedMember.permissions) as (keyof FamilyPermission)[]).map((key) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800 capitalize">
                    {key.replace('can', '').replace(/([A-Z])/g, ' $1')}
                  </span>
                  <button
                    onClick={() => handleTogglePermission(selectedMember.id, key)}
                    className={`px-3 py-1 rounded-xl font-extrabold transition-colors ${
                      selectedMember.permissions[key]
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {selectedMember.permissions[key] ? 'Allowed' : 'Denied'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
