"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchPatients } from "@/lib/actions/patient.actions";
import type { Patient } from "@/types/appwrite.types";

import { PatientQuickCreate } from "./patient-quick-create";

interface PatientSearchSelectProps {
  onSelect: (patient: Patient) => void;
}

export const PatientSearchSelect = ({ onSelect }: PatientSearchSelectProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [, startTransition] = useTransition();

  const handleSearch = async (value: string) => {
    setQuery(value);
    setShowQuickCreate(false);

    if (value.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    startTransition(async () => {
      const patients = await searchPatients(value);
      setResults(patients as unknown as Patient[]);
      setShowResults(true);
      setIsSearching(false);
    });
  };

  const handleSelectPatient = (patient: Patient) => {
    setShowResults(false);
    setShowQuickCreate(false);
    setQuery("");
    onSelect(patient);
  };

  const handleShowQuickCreate = () => {
    setShowResults(false);
    setShowQuickCreate(true);
  };

  const handleQuickCreateSuccess = (patient: Patient) => {
    setShowQuickCreate(false);
    setQuery("");
    onSelect(patient);
  };

  const handleQuickCreateCancel = () => {
    setShowQuickCreate(false);
    if (query.length >= 2) {
      setShowResults(true);
    }
  };

  if (showQuickCreate) {
    return (
      <PatientQuickCreate
        onSuccess={handleQuickCreateSuccess}
        onCancel={handleQuickCreateCancel}
        initialName={query}
      />
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          placeholder="Search patient by name, email or phone..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {showResults && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover shadow-lg">
          {results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No patient found for &quot;{query}&quot;</p>
              <Button
                className="mt-2"
                size="sm"
                onClick={handleShowQuickCreate}
              >
                + Add new patient
              </Button>
            </div>
          ) : (
            <>
              <ul className="max-h-60 overflow-auto py-2">
                {results.map((patient) => (
                  <li key={patient.$id}>
                    <button
                      type="button"
                      onClick={() => handleSelectPatient(patient)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-muted"
                    >
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.email} | {patient.phone}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={handleShowQuickCreate}
                >
                  + Add new patient
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Enter at least 2 characters to search
        </p>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="text-primary"
          onClick={handleShowQuickCreate}
        >
          + New patient
        </Button>
      </div>
    </div>
  );
};
