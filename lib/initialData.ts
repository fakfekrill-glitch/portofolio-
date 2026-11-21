import { PortfolioData } from './types';

export const initialPortfolioData: PortfolioData = {
  profile: {
    fullName: "Dalu Raziq Hidayatullah",
    firstName: "DALU",
    lastName: "RAZIQ",
    title: "Android Kernel Developer • POCO X3 Pro",
    device: "POCO X3 Pro (vayu / bhima)",
    soc: "Qualcomm Snapdragon 860 (SM8150)",
    kernelVersion: "Linux 4.14.x Modified Downstream",
    bio: "Developer spesialis Android Custom Kernel khusus device POCO X3 Pro (vayu/bhima, Snapdragon 860). Berpengalaman dalam kompilasi downstream kernel, integrasi ReSukiSU + SuSFS (Kernel-level Root Hiding & Mount Namespace Isolation), implementasi subsistem eBPF, tuning CPU governor & memory management (zRAM/LMKD), AnyKernel3 packaging, serta debugging kernel panics via ramoops/pstore.",
    email: "daluraziq1@gmail.com",
    photoPath: "/images/profile.jpg",
    location: "Surabaya, Indonesia",
    discordId: "582206666431266816",
    discordTag: "pushygamertag27",
    github: "fakfekrill-glitch",
    instagram: "rzq.punk",
    facebook: "Pushy",
    facebookUrl: "https://www.facebook.com/share/1JBvzZ7Nq5/",
    steamUrl: "https://steamcommunity.com/profiles/76561199395613672/"
  },
  certificates: [
    {
      id: "cert-1",
      title: "Sertifikasi Kompetensi Sistem & Teknologi",
      issuer: "Lembaga Standarisasi Kompetensi Nasional",
      date: "2024",
      image: "/certificates/certificate.png",
      description: "Pengujian kompetensi komputasi, pemeliharaan sistem perangkat keras, dan rekayasa perangkat lunak."
    },
    {
      id: "cert-2",
      title: "Pelatihan Keamanan Jaringan & Sistem Komputer",
      issuer: "Akademi Teknologi & Riset Siber",
      date: "2023",
      image: "/certificates/certificate1.png",
      description: "Pelatihan keamanan sistem operasi, identifikasi kerentanan firmware, dan teknik isolasi hak akses level root."
    },
    {
      id: "cert-3",
      title: "Sertifikasi Rekayasa Perangkat Lunak & Logika Algoritma",
      issuer: "Komite Pendidikan Teknologi Terapan",
      date: "2023",
      image: "/certificates/certificate2.png",
      description: "Sertifikasi pemahaman algoritma pemrograman, manajemen memori, dan efisiensi eksekusi sistem komputasi."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "RE404 Kernel (POCO X3 Pro - vayu/bhima)",
      category: "Android Kernel",
      version: "Linux 4.14.320+ (SM8150)",
      date: "2026",
      description: "Custom kernel berperforma tinggi untuk POCO X3 Pro. Dilengkapi integrasi ReSukiSU native, implementasi SuSFS (Stealth Namespace File System Isolation) untuk melewati deteksi root level aplikasi perbankan, dan eBPF subsystem aktif.",
      image: "/projects/Screenshot_2026-07-15_15-57-23.png",
      tags: ["POCO X3 Pro", "KernelSU", "SuSFS", "eBPF", "SM8150"],
      proofUrl: "https://github.com/fakfekrill-glitch"
    },
    {
      id: "proj-2",
      title: "Cross-Compilation Pipeline dengan Clang & LLVM",
      category: "Toolchain & LLVM",
      version: "Clang 18.x / LLD / Polly",
      date: "2026",
      description: "Setup pipeline kompilasi mandiri menggunakan AOSP / Proton Clang toolchain dengan optimasi ThinLTO (Link-Time Optimization) untuk mereduksi latensi instruksi CPU dan meningkatkan kestabilan runtime.",
      image: "/projects/Screenshot_2022-11-04_11_41_37.png",
      tags: ["Clang", "LLVM", "ThinLTO", "Cross-Compile"],
      proofUrl: "https://github.com/fakfekrill-glitch"
    },
    {
      id: "proj-3",
      title: "RAMoops & Console Crash Debugging",
      category: "Hardware & Debugging",
      version: "pstore / ramoops-0",
      date: "2026",
      description: "Analisis log kernel panic secara forensik menggunakan console-ramoops dan pstore backend untuk mengidentifikasi memory leak, page allocation failure, dan driver crash pada SoC Qualcomm Snapdragon 860.",
      image: "/projects/Screenshot_2022-11-10_11_00_12.png",
      tags: ["RAMoops", "Kernel Panic", "Pstore", "SM8150"],
      proofUrl: "https://github.com/fakfekrill-glitch"
    },
    {
      id: "proj-4",
      title: "AnyKernel3 Automated Boot Image Packaging",
      category: "Deployment",
      version: "AnyKernel3 v3.0",
      date: "2026",
      description: "Script flashing otomatis untuk memodifikasi boot image secara dinamis di TWRP dan OrangeFox recovery, memastikan zImage-dtb dan dtbo kompatibel tanpa merusak vendor ramdisk bawaan.",
      image: "/projects/Screenshot_2022-11-01_08_57_50.png",
      tags: ["AnyKernel3", "TWRP", "BootImg", "Flashable"],
      proofUrl: "https://github.com/fakfekrill-glitch"
    },
    {
      id: "proj-5",
      title: "Governor Tuning & Thermal Dissipation Profiling",
      category: "Android Kernel",
      version: "Qualcomm EAS / Schedutil",
      date: "2026",
      description: "Penyetelan kurva Energy Aware Scheduling (EAS), schedutil governor rates, dan konfigurasi zRAM swap LZ4 guna mengoptimalkan framerate game berat tanpa memicu thermal throttling ekstrem pada POCO X3 Pro.",
      image: "/projects/48e7412c-cdb2-405e-9a78-b18bab37eb1a.png",
      tags: ["EAS", "Schedutil", "Thermal Tuning", "zRAM"],
      proofUrl: "https://github.com/fakfekrill-glitch"
    }
  ],
  arsenal: [
    {
      category: "Kernel Architecture & C",
      iconName: "Cpu",
      description: "Fondasi bahasa C tingkat rendah dan arsitektur kernel Linux untuk ekosistem Android downstream.",
      skills: ["C (Kernel Space)", "Linux Kernel 4.14.x", "Device Tree (DTS/DTBO)", "Kconfig & Makefile", "eBPF Subsystem"]
    },
    {
      category: "Root System & Stealth Isolation",
      iconName: "ShieldAlert",
      description: "Teknologi hook tingkat kernel dan teknik isolasi namespace untuk bypass verifikasi integritas.",
      skills: ["KernelSU Native", "ReSukiSU Implementation", "SuSFS Stealth Mounts", "Namespace Isolation", "SELinux Policies"]
    },
    {
      category: "Toolchains & Cross-Compilation",
      iconName: "Terminal",
      description: "Pengelolaan kompiler modern dan flag optimasi binary untuk arsitektur ARM64.",
      skills: ["AOSP / Proton-Clang", "LLVM & LLD Linker", "ThinLTO (Link Time Opt)", "Polly Vectorizer", "GCC Toolchains"]
    },
    {
      category: "Packaging & Device Recovery",
      iconName: "Wrench",
      description: "Proses patching boot partition dan distribusi paket flashable untuk end user.",
      skills: ["AnyKernel3 Automation", "TWRP & OrangeFox", "Fastboot & EDL Mode", "Console RAMoops", "Qualcomm SM8150 Spec"]
    }
  ],
  lastUpdated: new Date().toISOString()
};
