'use client';

import React from 'react';
import { Shield, UserPlus, Lock } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { name: 'Mohan Kumar', email: 'mohan@dpworld.com', role: 'Super Admin', status: 'ACTIVE', lastLogin: '10 mins ago' },
    { name: 'John Mwangi', email: 'john.m@dpworld.com', role: 'Driver', status: 'ACTIVE', lastLogin: 'Just now' },
    { name: 'Sarah K.', email: 'sarah.k@dpworld.com', role: 'Finance Manager', status: 'ACTIVE', lastLogin: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <span>Users & Multi-Tenant RBAC Permissions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Role Definitions • Field Level Security • Tenant Scoping</p>
        </div>
        <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold">
          + Invite User
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] font-semibold">
              <th className="p-3">User Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Assigned Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
            {users.map((u) => (
              <tr key={u.email} className="hover:bg-slate-800/40">
                <td className="p-3 font-sans font-bold text-slate-200">{u.name}</td>
                <td className="p-3 text-slate-400">{u.email}</td>
                <td className="p-3 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    {u.role}
                  </span>
                </td>
                <td className="p-3 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-slate-400">{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
