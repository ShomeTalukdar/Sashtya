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
    triggerNotification(`Added ${newMemberName} to family profiles`);
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
    triggerNotification(`Added "${newConditionName}" to family history`);
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
    <div className="space-y-6">
      
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
            Caregivers & Access
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-0.5">
            My Family Hub
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Add family profiles, caregiver consent permissions, and hereditary health conditions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>

          <button
            onClick={() => setIsAddDiseaseOpen(true)}
            className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Add Condition</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Privacy Banner */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
        <Lock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <strong>Consent Protection:</strong> SWASTYA enforces explicit per-category permissions for each family member.
        </div>
      </div>

      {/* Family Member Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
          Family Profiles ({familyMembers.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyMembers.map((member) => (
            <div 
              key={member.id}
              className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-semibold text-xs">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-zinc-400 uppercase">
                        {member.relationship}
                      </span>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{member.fullName} ({member.age}y)</h3>
                      <p className="text-xs text-zinc-400">{member.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors"
                    >
                      Consent
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id, member.fullName)}
                      className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Permissions matrix */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1 text-xs mt-3">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={`p-1.5 rounded border flex items-center gap-1.5 text-[11px] ${
                      member.permissions.canViewAppointments ? 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium' : 'border-transparent text-zinc-400'
                    }`}>
                      {member.permissions.canViewAppointments ? <Check className="w-3 h-3 text-zinc-700 dark:text-zinc-300" /> : <X className="w-3 h-3 text-zinc-300" />}
                      <span>Appointments</span>
                    </div>

                    <div className={`p-1.5 rounded border flex items-center gap-1.5 text-[11px] ${
                      member.permissions.canManageMedications ? 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium' : 'border-transparent text-zinc-400'
                    }`}>
                      {member.permissions.canManageMedications ? <Check className="w-3 h-3 text-zinc-700 dark:text-zinc-300" /> : <X className="w-3 h-3 text-zinc-300" />}
                      <span>Medications</span>
                    </div>

                    <div className={`p-1.5 rounded border flex items-center gap-1.5 text-[11px] ${
                      member.permissions.canViewEmergencyCard ? 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium' : 'border-transparent text-zinc-400'
                    }`}>
                      {member.permissions.canViewEmergencyCard ? <Check className="w-3 h-3 text-zinc-700 dark:text-zinc-300" /> : <X className="w-3 h-3 text-zinc-300" />}
                      <span>Emergency Card</span>
                    </div>

                    <div className={`p-1.5 rounded border flex items-center gap-1.5 text-[11px] ${
                      member.permissions.canViewMedicalDocuments ? 'border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium' : 'border-transparent text-zinc-400'
                    }`}>
                      {member.permissions.canViewMedicalDocuments ? <Check className="w-3 h-3 text-zinc-700 dark:text-zinc-300" /> : <X className="w-3 h-3 text-zinc-300" />}
                      <span>Documents</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Family Medical History Section */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Family Medical History ({familyHistory.length})
          </h3>
          <button
            onClick={() => setIsAddDiseaseOpen(true)}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Condition</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
          {familyHistory.map((item) => (
            <div key={item.id} className="py-3 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{item.conditionName}</div>
                <div className="text-zinc-500 dark:text-zinc-400">
                  Affected: {item.affectedMembers.join(', ')}
                </div>
                {item.notes && (
                  <p className="text-zinc-400 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDeleteDisease(item.id, item.conditionName)}
                className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                title="Delete Entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Add Family Member */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddMemberSubmit} className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Add Family Member</h3>
              <button type="button" onClick={() => setIsAddMemberOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Relationship</label>
                  <select
                    value={newMemberRel}
                    onChange={(e) => setNewMemberRel(e.target.value as FamilyRelationship)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100"
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
                  <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Age</label>
                  <input
                    type="number"
                    value={newMemberAge}
                    onChange={(e) => setNewMemberAge(parseInt(e.target.value) || 1)}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(false)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 2: Add Disease */}
      {isAddDiseaseOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddDiseaseSubmit} className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Add Family Condition</h3>
              <button type="button" onClick={() => setIsAddDiseaseOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Condition Name</label>
                <input
                  type="text"
                  value={newConditionName}
                  onChange={(e) => setNewConditionName(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes, Hypertension..."
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Affected Members</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-zinc-200 dark:border-zinc-800">
                  {familyMembers.map((m) => {
                    const isSelected = selectedAffectedMembers.includes(m.fullName);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => toggleAffectedMemberSelection(m.fullName)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                            : 'border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {m.fullName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Notes</label>
                <textarea
                  value={newDiseaseNotes}
                  onChange={(e) => setNewDiseaseNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-zinc-900 dark:text-zinc-100 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsAddDiseaseOpen(false)}
                className="px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Permission Consent Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                Consent Matrix: {selectedMember.fullName}
              </h3>
              <button onClick={() => setSelectedMember(null)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {(Object.keys(selectedMember.permissions) as (keyof FamilyPermission)[]).map((key) => (
                <div key={key} className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 capitalize">
                    {key.replace('can', '').replace(/([A-Z])/g, ' $1')}
                  </span>
                  <button
                    onClick={() => handleTogglePermission(selectedMember.id, key)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      selectedMember.permissions[key]
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'border border-zinc-200 dark:border-zinc-800 text-zinc-500'
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

export default FamilyPage;
