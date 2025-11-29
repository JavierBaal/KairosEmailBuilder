import { EmailTemplate } from '../types';

// Helper function to generate unique IDs
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Template 1: Transactional Email
export const transactionalTemplate: EmailTemplate = {
    version: '1.0',
    root: {
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        children: [
            {
                id: generateId('header'),
                type: 'header',
                props: {
                    logoUrl: 'https://via.placeholder.com/200x60?text=Logo',
                    logoAlt: 'Company Logo',
                    logoWidth: '200px',
                    logoHeight: 'auto',
                    showMenu: false,
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    align: 'center'
                }
            },
            {
                id: generateId('text'),
                type: 'text',
                props: {
                    text: '<h1 style="font-size: 24px; margin-bottom: 16px;">Hello,</h1><p style="font-size: 16px; line-height: 1.6; color: #333333;">Thank you for your purchase. Your order has been processed successfully.</p>',
                    align: 'left',
                    color: '#333333',
                    fontSize: '16px',
                    padding: '20px'
                }
            },
            {
                id: generateId('button'),
                type: 'button',
                props: {
                    text: 'View Order Details',
                    url: '#',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '12px 24px',
                    align: 'center',
                    width: 'auto'
                }
            },
            {
                id: generateId('spacer'),
                type: 'spacer',
                props: {
                    height: '30px'
                }
            },
            {
                id: generateId('divider'),
                type: 'divider',
                props: {
                    color: '#e0e0e0',
                    height: '1px',
                    padding: '20px'
                }
            },
            {
                id: generateId('footer'),
                type: 'footer',
                props: {
                    companyName: 'Your Company',
                    companyAddress: '123 Main St, City, State 12345',
                    copyrightText: '© 2025 Your Company. All rights reserved.',
                    unsubscribeUrl: '#',
                    privacyPolicyUrl: '#',
                    termsUrl: '#',
                    backgroundColor: '#f5f5f5',
                    textColor: '#666666',
                    fontSize: '12px',
                    padding: '20px',
                    showUnsubscribe: true,
                    showPrivacyPolicy: true,
                    showTerms: true
                }
            }
        ]
    }
};

// Template 2: Welcome Email (Autoresponder)
export const welcomeTemplate: EmailTemplate = {
    version: '1.0',
    root: {
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif',
        children: [
            {
                id: generateId('header'),
                type: 'header',
                props: {
                    logoUrl: 'https://via.placeholder.com/300x80?text=Welcome',
                    logoAlt: 'Welcome Header',
                    logoWidth: '300px',
                    logoHeight: 'auto',
                    showMenu: false,
                    backgroundColor: '#ffffff',
                    padding: '30px 20px',
                    align: 'center'
                }
            },
            {
                id: generateId('spacer'),
                type: 'spacer',
                props: {
                    height: '20px'
                }
            },
            {
                id: generateId('welcome-text'),
                type: 'text',
                props: {
                    text: '<h1 style="font-size: 28px; margin-bottom: 16px; text-align: center; color: #2c3e50;">Welcome to our community!</h1><p style="font-size: 16px; line-height: 1.8; color: #333333; text-align: center;">We\'re excited to have you with us. Here you\'ll find everything you need to get started.</p>',
                    align: 'center',
                    color: '#333333',
                    fontSize: '16px',
                    padding: '30px 20px'
                }
            },
            {
                id: generateId('cta-button'),
                type: 'button',
                props: {
                    text: 'Get Started',
                    url: '#',
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '14px 32px',
                    align: 'center',
                    width: 'auto'
                }
            },
            {
                id: generateId('spacer-2'),
                type: 'spacer',
                props: {
                    height: '30px'
                }
            },
            {
                id: generateId('social-links'),
                type: 'social-links',
                props: {
                    links: [
                        { platform: 'facebook', url: 'https://facebook.com/yourcompany' },
                        { platform: 'x', url: 'https://x.com/yourcompany' },
                        { platform: 'instagram', url: 'https://instagram.com/yourcompany' },
                        { platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany' }
                    ],
                    iconSize: '32px',
                    iconColor: '#666666',
                    spacing: '16px',
                    align: 'center',
                    padding: '20px'
                }
            },
            {
                id: generateId('divider'),
                type: 'divider',
                props: {
                    color: '#e0e0e0',
                    height: '1px',
                    padding: '20px'
                }
            },
            {
                id: generateId('footer'),
                type: 'footer',
                props: {
                    companyName: 'Your Company',
                    copyrightText: '© 2025 Your Company. All rights reserved.',
                    unsubscribeUrl: '#',
                    privacyPolicyUrl: '#',
                    termsUrl: '#',
                    backgroundColor: '#ffffff',
                    textColor: '#999999',
                    fontSize: '12px',
                    padding: '20px',
                    showUnsubscribe: true,
                    showPrivacyPolicy: true,
                    showTerms: false
                }
            }
        ]
    }
};

// Template 3: Newsletter
export const newsletterTemplate: EmailTemplate = {
    version: '1.0',
    root: {
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        children: [
            {
                id: generateId('header'),
                type: 'header',
                props: {
                    logoUrl: 'https://via.placeholder.com/200x60?text=Newsletter',
                    logoAlt: 'Newsletter Header',
                    logoWidth: '200px',
                    logoHeight: 'auto',
                    showMenu: true,
                    menuItems: [
                        { label: 'Home', url: 'https://example.com' },
                        { label: 'Products', url: 'https://example.com/products' },
                        { label: 'Contact', url: 'https://example.com/contact' }
                    ],
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    align: 'left'
                }
            },
            {
                id: generateId('hero-image'),
                type: 'image',
                props: {
                    src: 'https://via.placeholder.com/600x300?text=Hero+Image',
                    alt: 'Hero Image',
                    width: '100%',
                    align: 'center',
                    padding: '20px'
                }
            },
            {
                id: generateId('hero-text'),
                type: 'text',
                props: {
                    text: '<h2 style="font-size: 24px; margin-bottom: 12px; text-align: center;">Newsletter Main Title</h2><p style="font-size: 16px; line-height: 1.6; color: #666666; text-align: center;">Brief description of the main content of this edition.</p>',
                    align: 'center',
                    color: '#333333',
                    fontSize: '16px',
                    padding: '20px'
                }
            },
            {
                id: generateId('columns'),
                type: 'columns',
                props: {
                    columnCount: 2,
                    gap: '20px',
                    padding: '20px',
                    backgroundColor: '#ffffff'
                },
                children: [
                    {
                        id: generateId('col1-text'),
                        type: 'text',
                        props: {
                            text: '<h3 style="font-size: 18px; margin-bottom: 8px;">Article 1</h3><p style="font-size: 14px; line-height: 1.6; color: #666666;">Content of the first newsletter article.</p>',
                            align: 'left',
                            color: '#333333',
                            fontSize: '14px',
                            padding: '10px'
                        }
                    },
                    {
                        id: generateId('col2-text'),
                        type: 'text',
                        props: {
                            text: '<h3 style="font-size: 18px; margin-bottom: 8px;">Article 2</h3><p style="font-size: 14px; line-height: 1.6; color: #666666;">Content of the second newsletter article.</p>',
                            align: 'left',
                            color: '#333333',
                            fontSize: '14px',
                            padding: '10px'
                        }
                    }
                ]
            },
            {
                id: generateId('cta-button'),
                type: 'button',
                props: {
                    text: 'Read More',
                    url: '#',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '12px 24px',
                    align: 'center',
                    width: 'auto'
                }
            },
            {
                id: generateId('spacer'),
                type: 'spacer',
                props: {
                    height: '30px'
                }
            },
            {
                id: generateId('social-links'),
                type: 'social-links',
                props: {
                    links: [
                        { platform: 'facebook', url: 'https://facebook.com/yourcompany' },
                        { platform: 'x', url: 'https://x.com/yourcompany' },
                        { platform: 'instagram', url: 'https://instagram.com/yourcompany' },
                        { platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany' },
                        { platform: 'youtube', url: 'https://youtube.com/yourcompany' }
                    ],
                    iconSize: '28px',
                    iconColor: '#666666',
                    spacing: '12px',
                    align: 'center',
                    padding: '20px'
                }
            },
            {
                id: generateId('divider'),
                type: 'divider',
                props: {
                    color: '#e0e0e0',
                    height: '1px',
                    padding: '20px'
                }
            },
            {
                id: generateId('footer'),
                type: 'footer',
                props: {
                    companyName: 'Your Company',
                    companyAddress: '123 Main St, City, State 12345',
                    copyrightText: '© 2025 Your Company. All rights reserved.',
                    unsubscribeUrl: '#',
                    privacyPolicyUrl: '#',
                    termsUrl: '#',
                    backgroundColor: '#f5f5f5',
                    textColor: '#999999',
                    fontSize: '12px',
                    padding: '20px',
                    showUnsubscribe: true,
                    showPrivacyPolicy: true,
                    showTerms: true
                }
            }
        ]
    }
};

// Template 4: Support Email
export const supportTemplate: EmailTemplate = {
    version: '1.0',
    root: {
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        children: [
            {
                id: generateId('header'),
                type: 'header',
                props: {
                    logoUrl: 'https://via.placeholder.com/150x50?text=Support',
                    logoAlt: 'Support Header',
                    logoWidth: '150px',
                    logoHeight: 'auto',
                    showMenu: false,
                    backgroundColor: '#ffffff',
                    padding: '20px',
                    align: 'center'
                }
            },
            {
                id: generateId('main-text'),
                type: 'text',
                props: {
                    text: '<h1 style="font-size: 24px; margin-bottom: 16px; color: #2c3e50;">Hello,</h1><p style="font-size: 16px; line-height: 1.8; color: #333333; margin-bottom: 16px;">We have received your support request. Our team is working on resolving your inquiry.</p><p style="font-size: 16px; line-height: 1.8; color: #333333;">Below you will find useful information:</p>',
                    align: 'left',
                    color: '#333333',
                    fontSize: '16px',
                    padding: '30px 20px'
                }
            },
            {
                id: generateId('spacer'),
                type: 'spacer',
                props: {
                    height: '20px'
                }
            },
            {
                id: generateId('info-box'),
                type: 'text',
                props: {
                    text: '<div style="background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 16px; margin: 20px 0;"><p style="margin: 0; font-size: 14px; color: #333333;"><strong>Ticket Number:</strong> #12345</p><p style="margin: 8px 0 0 0; font-size: 14px; color: #333333;"><strong>Status:</strong> Under Review</p></div>',
                    align: 'left',
                    padding: '0 20px'
                }
            },
            {
                id: generateId('contact-button'),
                type: 'button',
                props: {
                    text: 'Contact Support',
                    url: '#',
                    backgroundColor: '#007bff',
                    color: '#ffffff',
                    borderRadius: '4px',
                    padding: '12px 24px',
                    align: 'center',
                    width: 'auto'
                }
            },
            {
                id: generateId('spacer-2'),
                type: 'spacer',
                props: {
                    height: '30px'
                }
            },
            {
                id: generateId('support-info'),
                type: 'text',
                props: {
                    text: '<p style="font-size: 14px; color: #666666; text-align: center; margin-bottom: 8px;"><strong>Support Hours:</strong> Monday to Friday, 9:00 AM - 6:00 PM</p><p style="font-size: 14px; color: #666666; text-align: center;">Email: support@company.com | Phone: +1 (555) 123-4567</p>',
                    align: 'center',
                    color: '#666666',
                    fontSize: '14px',
                    padding: '20px'
                }
            },
            {
                id: generateId('divider'),
                type: 'divider',
                props: {
                    color: '#e0e0e0',
                    height: '1px',
                    padding: '20px'
                }
            },
            {
                id: generateId('footer'),
                type: 'footer',
                props: {
                    companyName: 'Your Company',
                    companyAddress: '123 Main St, City, State 12345',
                    copyrightText: '© 2025 Your Company. All rights reserved.',
                    unsubscribeUrl: '#',
                    privacyPolicyUrl: '#',
                    termsUrl: '#',
                    backgroundColor: '#f5f5f5',
                    textColor: '#999999',
                    fontSize: '12px',
                    padding: '20px',
                    showUnsubscribe: false,
                    showPrivacyPolicy: true,
                    showTerms: true
                }
            }
        ]
    }
};

// Array with all predefined templates
export const predefinedTemplates = [
    {
        id: 'predefined-transactional',
        name: 'Transactional Email',
        description: 'Perfect for order confirmations, invoices, and important notifications.',
        category: 'predefined' as const,
        template: transactionalTemplate
    },
    {
        id: 'predefined-welcome',
        name: 'Welcome',
        description: 'Ideal for welcoming new users or subscribers.',
        category: 'predefined' as const,
        template: welcomeTemplate
    },
    {
        id: 'predefined-newsletter',
        name: 'Newsletter',
        description: 'Complete design for newsletters with multiple sections and columns.',
        category: 'predefined' as const,
        template: newsletterTemplate
    },
    {
        id: 'predefined-support',
        name: 'Support',
        description: 'Professional template for customer support communications.',
        category: 'predefined' as const,
        template: supportTemplate
    }
];

