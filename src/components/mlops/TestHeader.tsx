"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Bell, User } from 'lucide-react';

const NavPill = ({ text, href, active, yellow = false }: { text: string, href: string, active: boolean, yellow?: boolean }) => (
    <Link href={href}>
        <button className={`nav-pill ${active ? 'active' : ''} ${yellow ? 'yellow' : ''}`}>
            {text}
        </button>
    </Link>
);

export const TestHeader = () => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/test/portfolio-layout' && pathname === '/test/portfolio-layout') return true;
        if (path !== '/test/portfolio-layout' && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="px-4 py-2 border-2 border-gray-300 rounded-full">
                    <span className="font-medium text-lg">Crextio</span>
                </div>
            </div>

            {/* Horizontal Navigation Pills */}
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                <NavPill text="About" href="/test/portfolio-layout" active={isActive('/test/portfolio-layout')} />
                <NavPill text="Resume" href="/test/portfolio-layout/experience" active={isActive('/test/portfolio-layout/experience')} />
                <NavPill text="Portfolio" href="/test/portfolio-layout/projects" active={isActive('/test/portfolio-layout/projects')} />
                <NavPill text="Blog" href="/test/portfolio-layout/blog" active={isActive('/test/portfolio-layout/blog')} />
                <NavPill text="Contact" href="/test/portfolio-layout/contact" active={isActive('/test/portfolio-layout/contact')} />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <Settings size={18} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-white/50 transition-colors relative">
                    <Bell size={18} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                </button>
                <button className="p-2 rounded-full hover:bg-white/50 transition-colors">
                    <User size={18} className="text-gray-600" />
                </button>
            </div>
        </div>
    );
};
