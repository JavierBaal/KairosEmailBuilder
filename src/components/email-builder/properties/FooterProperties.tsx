import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { FooterBlockProps } from '../types';

interface FooterPropertiesProps {
    props: FooterBlockProps;
    onChange: (props: Partial<FooterBlockProps>) => void;
}

export function FooterProperties({ props, onChange }: FooterPropertiesProps) {
    // Validate URL
    const isValidUrl = (url: string): boolean => {
        try {
            const urlObj = new URL(url, window.location.href);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'mailto:';
        } catch {
            return false;
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                    value={props.companyName || ''}
                    onChange={(e) => onChange({ companyName: e.target.value })}
                    placeholder="Your Company Name"
                />
            </div>

            <div className="space-y-2">
                <Label>Company Address</Label>
                <Input
                    value={props.companyAddress || ''}
                    onChange={(e) => onChange({ companyAddress: e.target.value })}
                    placeholder="123 Main St, City, State 12345"
                />
            </div>

            <div className="space-y-2">
                <Label>Copyright Text</Label>
                <Input
                    value={props.copyrightText || ''}
                    onChange={(e) => onChange({ copyrightText: e.target.value })}
                    placeholder="© 2024 Your Company. All rights reserved."
                />
            </div>

            <div className="pt-4 border-t space-y-4">
                <h3 className="text-sm font-semibold">Links</h3>
                
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Show Unsubscribe Link</Label>
                        <Switch
                            checked={props.showUnsubscribe !== false}
                            onCheckedChange={(checked) => onChange({ showUnsubscribe: checked })}
                        />
                    </div>
                    {props.showUnsubscribe !== false && (
                        <Input
                            value={props.unsubscribeUrl || ''}
                            onChange={(e) => onChange({ unsubscribeUrl: e.target.value })}
                            placeholder="https://example.com/unsubscribe"
                        />
                    )}
                    {props.unsubscribeUrl && !isValidUrl(props.unsubscribeUrl) && (
                        <p className="text-xs text-red-500">Invalid URL</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Show Privacy Policy Link</Label>
                        <Switch
                            checked={props.showPrivacyPolicy !== false}
                            onCheckedChange={(checked) => onChange({ showPrivacyPolicy: checked })}
                        />
                    </div>
                    {props.showPrivacyPolicy !== false && (
                        <Input
                            value={props.privacyPolicyUrl || ''}
                            onChange={(e) => onChange({ privacyPolicyUrl: e.target.value })}
                            placeholder="https://example.com/privacy"
                        />
                    )}
                    {props.privacyPolicyUrl && !isValidUrl(props.privacyPolicyUrl) && (
                        <p className="text-xs text-red-500">Invalid URL</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Show Terms of Service Link</Label>
                        <Switch
                            checked={props.showTerms !== false}
                            onCheckedChange={(checked) => onChange({ showTerms: checked })}
                        />
                    </div>
                    {props.showTerms !== false && (
                        <Input
                            value={props.termsUrl || ''}
                            onChange={(e) => onChange({ termsUrl: e.target.value })}
                            placeholder="https://example.com/terms"
                        />
                    )}
                    {props.termsUrl && !isValidUrl(props.termsUrl) && (
                        <p className="text-xs text-red-500">Invalid URL</p>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t space-y-4">
                <h3 className="text-sm font-semibold">Styling</h3>
                
                <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={props.backgroundColor || '#f5f5f5'}
                            onChange={(e) => onChange({ backgroundColor: e.target.value })}
                            className="w-10 p-1 h-9"
                        />
                        <Input
                            value={props.backgroundColor || '#f5f5f5'}
                            onChange={(e) => onChange({ backgroundColor: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={props.textColor || '#666666'}
                            onChange={(e) => onChange({ textColor: e.target.value })}
                            className="w-10 p-1 h-9"
                        />
                        <Input
                            value={props.textColor || '#666666'}
                            onChange={(e) => onChange({ textColor: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Font Size</Label>
                        <Input
                            value={props.fontSize || '12px'}
                            onChange={(e) => onChange({ fontSize: e.target.value })}
                            placeholder="12px"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Padding</Label>
                        <Input
                            value={props.padding || '20px'}
                            onChange={(e) => onChange({ padding: e.target.value })}
                            placeholder="20px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

