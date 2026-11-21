'use client';

import { useState, useEffect, useCallback } from 'react';
import { PortfolioData, ProfileData, CertificateItem, ProjectProofItem } from './types';
import { initialPortfolioData } from './initialData';

const STORAGE_KEY = 'dalu_portfolio_data_v2';
const EVENT_NAME = 'dalu_portfolio_update';

export function getStoredPortfolioData(): PortfolioData {
  if (typeof window === 'undefined') {
    return initialPortfolioData;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPortfolioData));
      return initialPortfolioData;
    }
    const parsed = JSON.parse(raw);
    return {
      ...initialPortfolioData,
      ...parsed,
      profile: {
        ...initialPortfolioData.profile,
        ...(parsed.profile || {})
      },
      certificates: Array.isArray(parsed.certificates) ? parsed.certificates : initialPortfolioData.certificates,
      projects: Array.isArray(parsed.projects) ? parsed.projects : initialPortfolioData.projects,
      arsenal: Array.isArray(parsed.arsenal) ? parsed.arsenal : initialPortfolioData.arsenal,
    };
  } catch (err) {
    console.error('Failed to parse portfolio data from storage:', err);
    return initialPortfolioData;
  }
}

export function savePortfolioData(data: PortfolioData): void {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  } catch (err) {
    console.error('Failed to save portfolio data to storage:', err);
  }
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(getStoredPortfolioData);

  useEffect(() => {
    const handleUpdate = (e: CustomEvent<PortfolioData>) => {
      setData(e.detail);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener(EVENT_NAME as unknown as keyof WindowEventMap, handleUpdate as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(EVENT_NAME as unknown as keyof WindowEventMap, handleUpdate as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateProfile = useCallback((profile: Partial<ProfileData>) => {
    setData(prev => {
      const updated: PortfolioData = {
        ...prev,
        profile: {
          ...prev.profile,
          ...profile
        }
      };
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  const addCertificate = useCallback((cert: Omit<CertificateItem, 'id'>) => {
    setData(prev => {
      const newCert: CertificateItem = {
        ...cert,
        id: `cert-${Date.now()}`
      };
      const updated: PortfolioData = {
        ...prev,
        certificates: [newCert, ...prev.certificates]
      };
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  const updateCertificate = useCallback((id: string, cert: Partial<CertificateItem>) => {
    setData(prev => {
      const updated: PortfolioData = {
        ...prev,
        certificates: prev.certificates.map(c => c.id === id ? { ...c, ...cert } : c)
      };
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  const deleteCertificate = useCallback((id: string) => {
    setData(prev => {
      const updated: PortfolioData = {
        ...prev,
        certificates: prev.certificates.filter(c => c.id !== id)
      };
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  const addProject = useCallback((project: Omit<ProjectProofItem, 'id'>) => {
    setData(prev => {
      const newProject: ProjectProofItem = {
        ...project,
        id: `proj-${Date.now()}`
      };
      const updated: PortfolioData = {
        ...prev,
        projects: [newProject, ...prev.projects]
      };
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  const updateProject = useCallback((id: string, project: Partial<ProjectProofItem>) => {
    setData(prev => {
      const updated: PortfolioData = {
        ...prev,
        projects: prev.projects.map(p => p.id === id ? { ...p, ...project } : p)
      };
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData(prev => {
      const updated: PortfolioData = {
        ...prev,
        projects: prev.projects.filter(p => p.id !== id)
      };
      savePortfolioData(updated);
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setData(initialPortfolioData);
    savePortfolioData(initialPortfolioData);
  }, []);

  const exportData = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `dalu-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [data]);

  const importData = useCallback((imported: PortfolioData) => {
    if (imported && imported.profile) {
      setData(imported);
      savePortfolioData(imported);
      return true;
    }
    return false;
  }, []);

  return {
    data,
    updateProfile,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    exportData,
    importData,
  };
}
