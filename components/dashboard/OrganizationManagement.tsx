"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Member {
  id: string;
  email: string;
  role: string;
  name: string;
}

const OrganizationManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch organization members from your custom API endpoint.
  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await fetch("/api/organization/members");
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data.members);
    } catch (err: any) {
      setError(err.message || "Error fetching members");
    } finally {
      setLoadingMembers(false);
    }
  };

  // Invite a new user by email.
  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    setError(null);
    try {
      const res = await fetch("/api/organization/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      if (!res.ok) throw new Error("Failed to send invitation");
      // Clear the input and refresh the member list.
      setInviteEmail("");
      await fetchMembers();
    } catch (err: any) {
      setError(err.message || "Error inviting user");
    } finally {
      setInviting(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Organization</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Invite New Member</h3>
        <div className="flex items-center gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleInvite} disabled={inviting || !inviteEmail}>
            {inviting ? "Inviting..." : "Invite"}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        {loadingMembers ? (
          <p>Loading members...</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-2 text-sm">{member.name || "-"}</td>
                  <td className="px-4 py-2 text-sm">{member.email}</td>
                  <td className="px-4 py-2 text-sm">{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrganizationManagement;
