import React from 'react';
import { Users } from 'lucide-react';

function Logo() {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-indigo-100 p-3 rounded-full">
        <Users className="w-8 h-8 text-indigo-600" />
      </div>
    </div>
  );
}

export default Logo;