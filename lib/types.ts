export interface ProfileData {
  fullName: string;
  firstName: string;
  lastName: string;
  title: string;
  device: string;
  soc: string;
  kernelVersion: string;
  bio: string;
  email: string;
  photoPath: string;
  location: string;
  discordId: string;
  discordTag: string;
  github: string;
  instagram: string;
  facebook: string;
  facebookUrl: string;
  steamUrl: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string; // URL path or base64 data URL
  credentialUrl?: string;
  description?: string;
}

export interface ProjectProofItem {
  id: string;
  title: string;
  category: 'Android Kernel' | 'Root & SuSFS' | 'Toolchain & LLVM' | 'Deployment' | 'Hardware & Debugging';
  version: string;
  date: string;
  description: string;
  image: string; // URL path or base64 data URL
  tags: string[];
  proofUrl?: string;
}

export interface ArsenalSkill {
  name: string;
  level: string;
}

export interface ArsenalCategory {
  category: string;
  iconName: string;
  description: string;
  skills: string[];
}

export interface PortfolioData {
  profile: ProfileData;
  certificates: CertificateItem[];
  projects: ProjectProofItem[];
  arsenal: ArsenalCategory[];
  lastUpdated: string;
}
