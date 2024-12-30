import React, { useState } from 'react';
import { RxCheck, RxCross2 } from "react-icons/rx";

const APIKeyPrompt: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [apiKey, setApiKey] = useState('');

    const handleIsEditing = () => {
        setIsEditing(true);
    }

    const handleSave = () => {
        localStorage.setItem('apiKey', apiKey);
        setIsEditing(false);
    }

    const handleCancel = () => {
        setIsEditing(false);
    }

    return isEditing ? (
        <div className="text-white py-2 px-4 rounded-md bg-[#3a3a3a] hover:bg-[#4a4a4a] flex items-center justify-between">
            <input 
                type="text" 
                value={apiKey} 
                className='bg-transparent text-white'
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="OpenAI API key" 
            />
            <button onClick={handleSave}>
                <RxCheck />
            </button>
            <button onClick={handleCancel}>
                <RxCross2 />
            </button>
        </div>
    ) : (
        <div 
            className="text-white py-2 px-4 rounded-md bg-[#3a3a3a] hover:bg-[#4a4a4a] flex items-center justify-center"
            onClick={handleIsEditing}
        >
            <button >
                OpenAI API Key
            </button>
        </div>
    );
};

export default APIKeyPrompt;
