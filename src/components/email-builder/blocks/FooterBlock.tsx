import React from 'react';
import { EmailBlock } from '../types';

interface FooterBlockProps {
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

export function FooterBlock({ block }: FooterBlockProps) {
    const {
        companyName = '',
        companyAddress = '',
        copyrightText = '',
        unsubscribeUrl = '',
        privacyPolicyUrl = '',
        termsUrl = '',
        backgroundColor = '#f5f5f5',
        textColor = '#666666',
        fontSize = '12px',
        padding = '20px',
        showUnsubscribe = true,
        showPrivacyPolicy = true,
        showTerms = true
    } = block.props as {
        companyName?: string;
        companyAddress?: string;
        copyrightText?: string;
        unsubscribeUrl?: string;
        privacyPolicyUrl?: string;
        termsUrl?: string;
        backgroundColor?: string;
        textColor?: string;
        fontSize?: string;
        padding?: string;
        showUnsubscribe?: boolean;
        showPrivacyPolicy?: boolean;
        showTerms?: boolean;
    };

    const safeUnsubscribeUrl = unsubscribeUrl && isValidUrl(unsubscribeUrl) ? unsubscribeUrl : '#';
    const safePrivacyUrl = privacyPolicyUrl && isValidUrl(privacyPolicyUrl) ? privacyPolicyUrl : '#';
    const safeTermsUrl = termsUrl && isValidUrl(termsUrl) ? termsUrl : '#';

    return (
        <div style={{
            backgroundColor,
            padding,
            color: textColor,
            fontSize,
            lineHeight: '1.6'
        }}>
            {/* Company Info */}
            {(companyName || companyAddress) && (
                <div style={{ marginBottom: '15px' }}>
                    {companyName && (
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                            {companyName}
                        </div>
                    )}
                    {companyAddress && (
                        <div style={{ marginTop: '5px' }}>
                            {companyAddress}
                        </div>
                    )}
                </div>
            )}

            {/* Links */}
            {(showUnsubscribe || showPrivacyPolicy || showTerms) && (
                <div style={{ marginBottom: '15px', lineHeight: '2' }}>
                    {showUnsubscribe && (
                        <a
                            href={safeUnsubscribeUrl}
                            onClick={(e) => e.preventDefault()}
                            style={{
                                color: textColor,
                                textDecoration: 'underline',
                                marginRight: '15px'
                            }}
                        >
                            Unsubscribe
                        </a>
                    )}
                    {showPrivacyPolicy && (
                        <a
                            href={safePrivacyUrl}
                            onClick={(e) => e.preventDefault()}
                            style={{
                                color: textColor,
                                textDecoration: 'underline',
                                marginRight: '15px'
                            }}
                        >
                            Privacy Policy
                        </a>
                    )}
                    {showTerms && (
                        <a
                            href={safeTermsUrl}
                            onClick={(e) => e.preventDefault()}
                            style={{
                                color: textColor,
                                textDecoration: 'underline'
                            }}
                        >
                            Terms of Service
                        </a>
                    )}
                </div>
            )}

            {/* Copyright */}
            {copyrightText && (
                <div style={{ marginTop: '15px', fontSize: '11px', opacity: 0.8 }}>
                    {copyrightText}
                </div>
            )}

            {/* Empty state */}
            {!companyName && !companyAddress && !copyrightText && !showUnsubscribe && !showPrivacyPolicy && !showTerms && (
                <div style={{
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    fontSize: '14px',
                    padding: '10px',
                    border: '1px dashed #d1d5db',
                    borderRadius: '4px',
                    textAlign: 'center'
                }}>
                    Configure footer content
                </div>
            )}
        </div>
    );
}

