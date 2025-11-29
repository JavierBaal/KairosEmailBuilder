import React from 'react';
import { EmailBlock } from '../types';

interface SocialLinksBlockProps {
    block: EmailBlock;
}

// Validate that a URL is safe
function isValidUrl(url: string): boolean {
    try {
        const urlObj = new URL(url, window.location.href);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'mailto:';
    } catch {
        return false;
    }
}

// SVG Icons for social platforms
const SocialIcons: Record<string, (size: string, color: string) => React.ReactNode> = {
    facebook: (size, color) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
    ),
    x: (size, color) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
    ),
    instagram: (size, color) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
    ),
    linkedin: (size, color) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
    ),
    youtube: (size, color) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
    )
};

export function SocialLinksBlock({ block }: SocialLinksBlockProps) {
    const {
        links = [],
        iconSize = '24px',
        iconColor = '#333333',
        spacing = '12px',
        align = 'center',
        padding = '20px'
    } = block.props as {
        links?: Array<{
            platform: 'facebook' | 'x' | 'instagram' | 'linkedin' | 'youtube' | 'custom';
            url: string;
            iconUrl?: string;
        }>;
        iconSize?: string;
        iconColor?: string;
        spacing?: string;
        align?: 'left' | 'center' | 'right';
        padding?: string;
    };

    if (!links || links.length === 0) {
        return (
            <div style={{ padding, textAlign: align }}>
                <div style={{ 
                    color: '#9ca3af', 
                    fontStyle: 'italic', 
                    fontSize: '14px',
                    padding: '10px',
                    border: '1px dashed #d1d5db',
                    borderRadius: '4px'
                }}>
                    Add social media links
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding, textAlign: align }}>
            <div style={{ 
                display: 'inline-flex', 
                gap: spacing,
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
            }}>
                {links.map((link, index) => {
                    const safeUrl = isValidUrl(link.url) ? link.url : '#';
                    
                    return (
                        <a
                            key={index}
                            href={safeUrl}
                            onClick={(e) => e.preventDefault()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                color: iconColor,
                                width: iconSize,
                                height: iconSize,
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '0.7';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                            aria-label={`${link.platform} link`}
                        >
                            {link.platform === 'custom' && link.iconUrl ? (
                                <img 
                                    src={link.iconUrl} 
                                    alt={link.platform}
                                    style={{ width: iconSize, height: iconSize }}
                                />
                            ) : SocialIcons[link.platform] ? (
                                SocialIcons[link.platform](iconSize, iconColor)
                            ) : null}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

