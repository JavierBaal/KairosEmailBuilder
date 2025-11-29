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
                type: 'image',
                props: {
                    src: 'https://via.placeholder.com/600x80?text=Logo',
                    alt: 'Company Logo',
                    width: '200px',
                    align: 'center',
                    padding: '20px'
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
                    thickness: '1px',
                    padding: '20px'
                }
            },
            {
                id: generateId('footer-text'),
                type: 'text',
                props: {
                    text: '<p style="font-size: 12px; color: #666666; text-align: center;">This is a transactional email. If you have any questions, please contact us.</p>',
                    align: 'center',
                    color: '#666666',
                    fontSize: '12px',
                    padding: '20px'
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
                type: 'image',
                props: {
                    src: 'https://via.placeholder.com/600x100?text=Welcome',
                    alt: 'Welcome Header',
                    width: '100%',
                    align: 'center',
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
                id: generateId('social-text'),
                type: 'text',
                props: {
                    text: '<p style="font-size: 14px; color: #666666; text-align: center; margin-bottom: 16px;">Follow us on social media:</p>',
                    align: 'center',
                    color: '#666666',
                    fontSize: '14px',
                    padding: '10px 20px'
                }
            },
            {
                id: generateId('divider'),
                type: 'divider',
                props: {
                    color: '#e0e0e0',
                    thickness: '1px',
                    padding: '20px'
                }
            },
            {
                id: generateId('footer'),
                type: 'text',
                props: {
                    text: '<p style="font-size: 12px; color: #999999; text-align: center;">© 2025 Your Company. All rights reserved.</p><p style="font-size: 12px; color: #999999; text-align: center; margin-top: 8px;"><a href="#" style="color: #999999;">Unsubscribe</a> | <a href="#" style="color: #999999;">Privacy Policy</a></p>',
                    align: 'center',
                    color: '#999999',
                    fontSize: '12px',
                    padding: '20px'
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
                type: 'image',
                props: {
                    src: 'https://via.placeholder.com/600x80?text=Newsletter+Header',
                    alt: 'Newsletter Header',
                    width: '100%',
                    align: 'center',
                    padding: '20px'
                }
            },
            {
                id: generateId('menu-text'),
                type: 'text',
                props: {
                    text: '<div style="text-align: center; padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><a href="#" style="margin: 0 15px; color: #333; text-decoration: none; font-size: 14px;">Home</a><a href="#" style="margin: 0 15px; color: #333; text-decoration: none; font-size: 14px;">Products</a><a href="#" style="margin: 0 15px; color: #333; text-decoration: none; font-size: 14px;">Contact</a></div>',
                    align: 'center',
                    padding: '0'
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
                id: generateId('divider'),
                type: 'divider',
                props: {
                    color: '#e0e0e0',
                    thickness: '1px',
                    padding: '20px'
                }
            },
            {
                id: generateId('footer'),
                type: 'text',
                props: {
                    text: '<p style="font-size: 12px; color: #999999; text-align: center;">© 2025 Your Company. All rights reserved.</p><p style="font-size: 12px; color: #999999; text-align: center; margin-top: 8px;"><a href="#" style="color: #999999;">Unsubscribe</a> | <a href="#" style="color: #999999;">View in browser</a></p>',
                    align: 'center',
                    color: '#999999',
                    fontSize: '12px',
                    padding: '20px'
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
                type: 'image',
                props: {
                    src: 'https://via.placeholder.com/600x60?text=Support',
                    alt: 'Support Header',
                    width: '150px',
                    align: 'center',
                    padding: '20px'
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
                    thickness: '1px',
                    padding: '20px'
                }
            },
            {
                id: generateId('footer'),
                type: 'text',
                props: {
                    text: '<p style="font-size: 12px; color: #999999; text-align: center;">© 2025 Your Company. All rights reserved.</p>',
                    align: 'center',
                    color: '#999999',
                    fontSize: '12px',
                    padding: '20px'
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

