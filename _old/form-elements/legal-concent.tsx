import React, { useState } from 'react';

export const LegalConsentElement = () => {
  const [fullName, setFullName] = useState('');
  const [isFullNameValid, setIsFullNameValid] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const validateFullName = (name) => {
    return name.trim().split(' ').length > 1;
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFullName(name);
    setIsFullNameValid(validateFullName(name));
  };

  const handleSubmit = (accept) => {
    if (!validateFullName(fullName)) {
      setIsFullNameValid(false);
      return;
    }

    setFormSubmitted(true);
    setConsentGiven(accept);
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setFullName('');
    setIsFullNameValid(true);
  };

  return (
    <div className=" w-full border shadow-sm rounded">
      {!formSubmitted ? (
        <>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-xs font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={handleNameChange}
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full  p-1 shadow-sm sm:text-sm border-gray-300 rounded ${!isFullNameValid && 'border-red-500'}`}
              placeholder="Enter your full name"
            />
            {!isFullNameValid && <p className="text-red-500 text-xs mt-1">Please enter your full name.</p>}
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => handleSubmit(true)}
              className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              I Accept
            </button>
            <button
              onClick={() => handleSubmit(false)}
              className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              I Do Not Accept
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-center">
            You have {consentGiven ? "accepted" : "not accepted"} the terms.
          </p>
          <button
            onClick={resetForm}
            className="mt-4 inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Modify Consent
          </button>
        </div>
      )}
    </div>
  );
};

