import React, { useState } from 'react';
import { EmailBlock } from '../types';

interface HeaderBlockProps {
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

// Validate image URL
function isValidImageUrl(url: string): boolean {
    if (!url || url.trim() === '') return false;
    try {
        const urlObj = new URL(url, window.location.href);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'data:';
    } catch {
        return false;
    }
}

export function HeaderBlock({ block }: HeaderBlockProps) {
    const {
        logoUrl = '',
        logoAlt = 'Logo',
        logoWidth = '150px',
        logoHeight = 'auto',
        showMenu = false,
        menuItems = [],
        backgroundColor = '#ffffff',
        padding = '20px',
        align = 'left'
    } = block.props as {
        logoUrl?: string;
        logoAlt?: string;
        logoWidth?: string;
        logoHeight?: string;
        showMenu?: boolean;
        menuItems?: Array<{
            label: string;
            url: string;
        }>;
        backgroundColor?: string;
        padding?: string;
        align?: 'left' | 'center' | 'right';
    };

    const [logoError, setLogoError] = useState(false);
    const hasValidLogo = logoUrl && isValidImageUrl(logoUrl);
    const showLogoPlaceholder = !hasValidLogo || logoError;

    const handleLogoError = () => {
        setLogoError(true);
    };

    return (
        <div style={{
            backgroundColor,
            padding,
            display: 'flex',
            alignItems: 'center',
            justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
            gap: '20px',
            flexWrap: 'wrap'
        }}>
            {/* Logo */}
            {showLogoPlaceholder ? (
                <div
                    style={{
                        width: logoWidth,
                        height: logoHeight === 'auto' ? '60px' : logoHeight,
                        minHeight: '60px',
                        backgroundColor: '#f3f4f6',
                        border: '2px dashed #d1d5db',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '14px',
                        fontWeight: '500',
                        fontFamily: 'Arial, sans-serif'
                    }}
                >
                    Logo
                </div>
            ) : (
                <div>
                    <img
                        src={logoUrl}
                        alt={logoAlt}
                        onError={handleLogoError}
                        style={{
                            width: logoWidth,
                            height: logoHeight === 'auto' ? 'auto' : logoHeight,
                            maxWidth: '100%',
                            display: 'block'
                        }}
                    />
                </div>
            )}

            {/* Menu */}
            {showMenu && menuItems && menuItems.length > 0 && (
                <nav style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {menuItems.map((item, index) => {
                        const safeUrl = isValidUrl(item.url) ? item.url : '#';
                        return (
                            <a
                                key={index}
                                href={safeUrl}
                                onClick={(e) => e.preventDefault()}
                                style={{
                                    color: '#333333',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    padding: '5px 0',
                                    borderBottom: '2px solid transparent',
                                    transition: 'border-color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderBottomColor = '#333333';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderBottomColor = 'transparent';
                                }}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>
            )}

            {/* Empty state */}
            {!logoUrl && (!showMenu || !menuItems || menuItems.length === 0) && (
                <div style={{
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    fontSize: '14px',
                    padding: '10px',
                    border: '1px dashed #d1d5db',
                    borderRadius: '4px',
                    textAlign: 'center',
                    width: '100%'
                }}>
                    Configure header content
                </div>
            )}
        </div>
    );
}

