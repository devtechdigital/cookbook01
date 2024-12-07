import React, { useState } from 'react';
import { Users, UserPlus, Mail, BookOpen } from 'lucide-react';
import { useFamily } from '../hooks/useFamily';
import { usePermissions } from '../hooks/usePermissions';
import { useCookbooks } from '../hooks/useCookbooks';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { FamilyRole } from '../types/family';

export function FamilyManager() {
  const {
    currentFamily,
    createFamily,
    addMember,
    updateMember,
    removeMember,
    createInvite,
  } = useFamily();

  const { cookbooks } = useCookbooks();
  const { canManageFamily } = usePermissions();

  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<FamilyRole>('contributor');
  const [selectedCookbooks, setSelectedCookbooks] = useState<string[]>([]);

  const handleCreateFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName) return;
    createFamily(newFamilyName, 'current@user.email');
    setNewFamilyName('');
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFamily || !inviteEmail) return;
    
    const invite = createInvite(currentFamily.id, inviteEmail, inviteRole);
    if (invite && inviteRole === 'contributor') {
      updateMember(currentFamily.id, invite.id, {
        cookbookAccess: selectedCookbooks,
      });
    }
    
    setInviteEmail('');
    setSelectedCookbooks([]);
  };

  if (!currentFamily) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
          <Users className="w-6 h-6" />
          Create a Family Group
        </h2>
        <form onSubmit={handleCreateFamily} className="space-y-4">
          <Input
            label="Family Name"
            value={newFamilyName}
            onChange={(e) => setNewFamilyName(e.target.value)}
            placeholder="Enter family name"
            required
          />
          <Button type="submit" variant="primary" icon={UserPlus}>
            Create Family
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6" />
          {currentFamily.name}
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Family Members</h3>
          <div className="space-y-4">
            {currentFamily.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                  {member.role === 'contributor' && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Cookbook Access:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {member.cookbookAccess.map(cookbookId => {
                          const cookbook = cookbooks.find(cb => cb.settings.id === cookbookId);
                          return cookbook ? (
                            <span
                              key={cookbookId}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800"
                            >
                              <BookOpen className="w-3 h-3 mr-1" />
                              {cookbook.settings.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
                {canManageFamily() && member.role !== 'head' && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeMember(currentFamily.id, member.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {canManageFamily() && (
          <div>
            <h3 className="text-lg font-medium mb-4">Invite Member</h3>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as FamilyRole)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="contributor">Contributor</option>
                  <option value="head">Family Head</option>
                </select>
              </div>
              {inviteRole === 'contributor' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Cookbook Access</label>
                  <div className="space-y-2">
                    {cookbooks.map(cookbook => (
                      <label key={cookbook.settings.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCookbooks.includes(cookbook.settings.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCookbooks([...selectedCookbooks, cookbook.settings.id]);
                            } else {
                              setSelectedCookbooks(selectedCookbooks.filter(id => id !== cookbook.settings.id));
                            }
                          }}
                          className="mr-2"
                        />
                        {cookbook.settings.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <Button type="submit" variant="primary" icon={Mail}>
                Send Invite
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}