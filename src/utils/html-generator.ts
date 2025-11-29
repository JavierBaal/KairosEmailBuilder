import { EmailTemplate, EmailBlock } from '../components/email-builder/types';

/**
 * Escapa caracteres HTML para prevenir XSS
 */
function escapeHtml(text: string | undefined | null): string {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Valida y escapa atributos HTML
 */
function escapeAttribute(value: string | undefined | null): string {
    if (value == null) return '';
    return escapeHtml(String(value));
}

/**
 * Valida y formatea width para atributo HTML
 */
function formatWidth(width: string | number | undefined | null): string {
    if (width == null) return '100%';
    const widthStr = String(width);
    // Si es porcentaje, remover el símbolo % para el atributo width
    if (widthStr.includes('%')) {
        return widthStr.replace('%', '');
    }
    return widthStr;
}

export function generateHtml(template: EmailTemplate): string {
    const backgroundColor = template.root.backgroundColor || '#ffffff';
    const fontFamily = template.root.fontFamily || 'sans-serif';
    const children = template.root.children || [];

    const renderBlock = (block: EmailBlock): string => {
        let blockHtml = '';
        
        switch (block.type) {
            case 'text':
                blockHtml = renderTextBlock(block);
                break;
            case 'image':
                blockHtml = renderImageBlock(block);
                break;
            case 'button':
                blockHtml = renderButtonBlock(block);
                break;
            case 'columns':
                blockHtml = renderColumnsBlock(block);
                break;
            case 'divider':
                blockHtml = renderDividerBlock(block);
                break;
            case 'spacer':
                blockHtml = renderSpacerBlock(block);
                break;
            case 'social-links':
                blockHtml = renderSocialLinksBlock(block);
                break;
            case 'footer':
                blockHtml = renderFooterBlock(block);
                break;
            case 'header':
                blockHtml = renderHeaderBlock(block);
                break;
            default:
                blockHtml = '';
        }

        // Renderizar bloques hijos recursivamente si existen (excepto para columns, social-links, footer y header que manejan sus propios hijos)
        if (block.type !== 'columns' && block.type !== 'social-links' && block.type !== 'footer' && block.type !== 'header' && block.children && block.children.length > 0) {
            const childrenHtml = block.children.map(renderBlock).join('');
            blockHtml += childrenHtml;
        }

        return blockHtml;
    };

    const renderTextBlock = (block: EmailBlock): string => {
        const text = block.props?.text || '';
        const align = block.props?.align || 'left';
        const color = block.props?.color || '#000000';
        const fontSize = block.props?.fontSize || '16px';
        const lineHeight = block.props?.lineHeight || '1.5';
        const padding = block.props?.padding || '10px';

        // If text contains HTML tags (from WYSIWYG editor), use it directly but sanitize
        // Otherwise, escape plain text
        const textContent = text.includes('<') && text.includes('>') 
            ? text // HTML from editor - already sanitized by TipTap
            : escapeHtml(text);

        return `
      <tr>
        <td align="${escapeAttribute(align)}" style="padding: ${escapeAttribute(padding)}; font-family: ${escapeAttribute(fontFamily)}; color: ${escapeAttribute(color)}; font-size: ${escapeAttribute(fontSize)}; line-height: ${escapeAttribute(lineHeight)};">
          ${textContent}
        </td>
      </tr>
    `;
    };

    const renderImageBlock = (block: EmailBlock): string => {
        const src = block.props?.src || '';
        const alt = block.props?.alt || 'Image';
        const width = block.props?.width || '100%';
        const align = block.props?.align || 'center';
        const padding = block.props?.padding || '10px';

        return `
      <tr>
        <td align="${escapeAttribute(align)}" style="padding: ${escapeAttribute(padding)};">
          <img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" width="${formatWidth(width)}" style="max-width: 100%; height: auto; display: block;" border="0" />
        </td>
      </tr>
    `;
    };

    const renderButtonBlock = (block: EmailBlock): string => {
        const text = block.props?.text || 'Click Me';
        const url = block.props?.url || '#';
        const backgroundColor = block.props?.backgroundColor || '#007bff';
        const color = block.props?.color || '#ffffff';
        const borderRadius = block.props?.borderRadius || '4px';
        const padding = block.props?.padding || '12px 24px';
        const align = block.props?.align || 'center';
        const width = block.props?.width || 'auto';

        return `
      <tr>
        <td align="${escapeAttribute(align)}" style="padding: 10px;">
          <table border="0" cellspacing="0" cellpadding="0" width="${width === 'full' ? '100%' : 'auto'}">
            <tr>
              <td align="center" bgcolor="${escapeAttribute(backgroundColor)}" style="border-radius: ${escapeAttribute(borderRadius)};">
                <a href="${escapeAttribute(url)}" target="_blank" style="padding: ${escapeAttribute(padding)}; border: 1px solid ${escapeAttribute(backgroundColor)}; border-radius: ${escapeAttribute(borderRadius)}; font-family: ${escapeAttribute(fontFamily)}; font-size: 16px; color: ${escapeAttribute(color)}; text-decoration: none; display: inline-block; font-weight: bold;">
                  ${escapeHtml(text)}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
    };

    const renderDividerBlock = (block: EmailBlock): string => {
        const color = block.props?.color || '#cccccc';
        const height = block.props?.height || '1px';
        const padding = block.props?.padding || '10px 0';

        return `
      <tr>
        <td style="padding: ${escapeAttribute(padding)};">
          <table border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td height="${escapeAttribute(height)}" style="background-color: ${escapeAttribute(color)}; height: ${escapeAttribute(height)}; line-height: ${escapeAttribute(height)}; font-size: 0;">&nbsp;</td>
            </tr>
          </table>
        </td>
      </tr>
    `;
    };

    const renderSpacerBlock = (block: EmailBlock): string => {
        const height = block.props?.height || '20px';

        return `
      <tr>
        <td height="${escapeAttribute(height)}" style="height: ${escapeAttribute(height)}; line-height: ${escapeAttribute(height)}; font-size: 0;">&nbsp;</td>
      </tr>
    `;
    };

    const renderSocialLinksBlock = (block: EmailBlock): string => {
        const links = block.props?.links || [];
        const iconSize = block.props?.iconSize || '24px';
        const iconColor = block.props?.iconColor || '#333333';
        const spacing = block.props?.spacing || '12px';
        const align = block.props?.align || 'center';
        const padding = block.props?.padding || '20px';

        if (!links || links.length === 0) {
            return `
      <tr>
        <td align="${escapeAttribute(align)}" style="padding: ${escapeAttribute(padding)};">
          <span style="color: #9ca3af; font-style: italic; font-size: 14px;">Add social media links</span>
        </td>
      </tr>
    `;
        }

        // Validate URL helper
        const isValidUrl = (url: string): boolean => {
            try {
                const urlObj = new URL(url, 'https://example.com');
                return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'mailto:';
            } catch {
                return false;
            }
        };

        // SVG icons for social platforms (inline SVG for email compatibility)
        const getSocialIconSvg = (platform: string, size: string, color: string): string => {
            const sizeNum = size.replace('px', '');
            const icons: Record<string, string> = {
                facebook: `<svg width="${sizeNum}" height="${sizeNum}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
                x: `<svg width="${sizeNum}" height="${sizeNum}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
                instagram: `<svg width="${sizeNum}" height="${sizeNum}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
                linkedin: `<svg width="${sizeNum}" height="${sizeNum}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
                youtube: `<svg width="${sizeNum}" height="${sizeNum}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
            };
            return icons[platform] || '';
        };

        // Convert spacing to margin between icons
        const spacingValue = spacing.replace('px', '');
        const spacingNum = parseInt(spacingValue, 10) || 12;

        // Build icon links HTML
        const iconLinksHtml = links.map((link: { platform: string; url: string; iconUrl?: string }, index: number) => {
            const safeUrl = isValidUrl(link.url) ? escapeAttribute(link.url) : '#';
            const marginRight = index < links.length - 1 ? `margin-right: ${spacingNum}px;` : '';
            
            let iconHtml = '';
            if (link.platform === 'custom' && link.iconUrl) {
                iconHtml = `<img src="${escapeAttribute(link.iconUrl)}" alt="${escapeAttribute(link.platform)}" width="${iconSize.replace('px', '')}" height="${iconSize.replace('px', '')}" style="display: block;" />`;
            } else {
                iconHtml = getSocialIconSvg(link.platform, iconSize, iconColor);
            }

            return `
            <a href="${safeUrl}" style="display: inline-block; ${marginRight} text-decoration: none; vertical-align: middle;">
              ${iconHtml}
            </a>`;
        }).join('');

        return `
      <tr>
        <td align="${escapeAttribute(align)}" style="padding: ${escapeAttribute(padding)};">
          ${iconLinksHtml}
        </td>
      </tr>
    `;
    };

    const renderFooterBlock = (block: EmailBlock): string => {
        const companyName = block.props?.companyName || '';
        const companyAddress = block.props?.companyAddress || '';
        const copyrightText = block.props?.copyrightText || '';
        const unsubscribeUrl = block.props?.unsubscribeUrl || '';
        const privacyPolicyUrl = block.props?.privacyPolicyUrl || '';
        const termsUrl = block.props?.termsUrl || '';
        const backgroundColor = block.props?.backgroundColor || '#f5f5f5';
        const textColor = block.props?.textColor || '#666666';
        const fontSize = block.props?.fontSize || '12px';
        const padding = block.props?.padding || '20px';
        const showUnsubscribe = block.props?.showUnsubscribe !== false;
        const showPrivacyPolicy = block.props?.showPrivacyPolicy !== false;
        const showTerms = block.props?.showTerms !== false;

        // Validate URL helper
        const isValidUrl = (url: string): boolean => {
            try {
                const urlObj = new URL(url, 'https://example.com');
                return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'mailto:';
            } catch {
                return false;
            }
        };

        const safeUnsubscribeUrl = unsubscribeUrl && isValidUrl(unsubscribeUrl) ? escapeAttribute(unsubscribeUrl) : '#';
        const safePrivacyUrl = privacyPolicyUrl && isValidUrl(privacyPolicyUrl) ? escapeAttribute(privacyPolicyUrl) : '#';
        const safeTermsUrl = termsUrl && isValidUrl(termsUrl) ? escapeAttribute(termsUrl) : '#';

        // Build content sections
        let contentHtml = '';

        // Company Info
        if (companyName || companyAddress) {
            contentHtml += `
            <tr>
              <td style="padding-bottom: 15px;">
                ${companyName ? `<div style="font-weight: bold; margin-bottom: 5px;">${escapeHtml(companyName)}</div>` : ''}
                ${companyAddress ? `<div style="margin-top: 5px;">${escapeHtml(companyAddress)}</div>` : ''}
              </td>
            </tr>`;
        }

        // Links
        if (showUnsubscribe || showPrivacyPolicy || showTerms) {
            const links: string[] = [];
            if (showUnsubscribe) {
                links.push(`<a href="${safeUnsubscribeUrl}" style="color: ${escapeAttribute(textColor)}; text-decoration: underline; margin-right: 15px;">Unsubscribe</a>`);
            }
            if (showPrivacyPolicy) {
                links.push(`<a href="${safePrivacyUrl}" style="color: ${escapeAttribute(textColor)}; text-decoration: underline; margin-right: 15px;">Privacy Policy</a>`);
            }
            if (showTerms) {
                links.push(`<a href="${safeTermsUrl}" style="color: ${escapeAttribute(textColor)}; text-decoration: underline;">Terms of Service</a>`);
            }
            
            if (links.length > 0) {
                contentHtml += `
            <tr>
              <td style="padding-bottom: 15px; line-height: 2;">
                ${links.join('')}
              </td>
            </tr>`;
            }
        }

        // Copyright
        if (copyrightText) {
            contentHtml += `
            <tr>
              <td style="margin-top: 15px; font-size: 11px; opacity: 0.8;">
                ${escapeHtml(copyrightText)}
              </td>
            </tr>`;
        }

        // Empty state
        if (!contentHtml) {
            contentHtml = `
            <tr>
              <td style="color: #9ca3af; font-style: italic; font-size: 14px; padding: 10px; border: 1px dashed #d1d5db; border-radius: 4px; text-align: center;">
                Configure footer content
              </td>
            </tr>`;
        }

        return `
      <tr>
        <td style="background-color: ${escapeAttribute(backgroundColor)}; padding: ${escapeAttribute(padding)}; color: ${escapeAttribute(textColor)}; font-size: ${escapeAttribute(fontSize)}; line-height: 1.6;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            ${contentHtml}
          </table>
        </td>
      </tr>
    `;
    };

    const renderHeaderBlock = (block: EmailBlock): string => {
        const logoUrl = block.props?.logoUrl || '';
        const logoAlt = block.props?.logoAlt || 'Logo';
        const logoWidth = block.props?.logoWidth || '150px';
        const logoHeight = block.props?.logoHeight || 'auto';
        const showMenu = block.props?.showMenu || false;
        const menuItems = block.props?.menuItems || [];
        const backgroundColor = block.props?.backgroundColor || '#ffffff';
        const padding = block.props?.padding || '20px';
        const align = block.props?.align || 'left';

        // Validate URL helper
        const isValidUrl = (url: string): boolean => {
            try {
                const urlObj = new URL(url, 'https://example.com');
                return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'mailto:';
            } catch {
                return false;
            }
        };

        // Build header content
        let contentHtml = '';

        // Logo
        if (logoUrl) {
            const logoHeightStyle = logoHeight === 'auto' ? 'height: auto;' : `height: ${escapeAttribute(logoHeight)};`;
            contentHtml += `
            <td align="${escapeAttribute(align)}" style="vertical-align: middle;">
              <img src="${escapeAttribute(logoUrl)}" alt="${escapeAttribute(logoAlt)}" width="${escapeAttribute(logoWidth.replace('px', ''))}" style="max-width: 100%; ${logoHeightStyle} display: block;" border="0" />
            </td>`;
        }

        // Menu
        if (showMenu && menuItems && menuItems.length > 0) {
            const menuLinks = menuItems.map((item: { label: string; url: string }) => {
                const safeUrl = isValidUrl(item.url) ? escapeAttribute(item.url) : '#';
                return `<a href="${safeUrl}" style="color: #333333; text-decoration: none; font-size: 14px; font-weight: 500; margin-right: 15px;">${escapeHtml(item.label)}</a>`;
            }).join('');

            if (logoUrl) {
                // Logo and menu side by side
                contentHtml += `
            <td align="right" style="vertical-align: middle;">
              ${menuLinks}
            </td>`;
            } else {
                // Menu only
                contentHtml = `
            <td align="${escapeAttribute(align)}" style="vertical-align: middle;">
              ${menuLinks}
            </td>`;
            }
        }

        // Empty state
        if (!contentHtml) {
            contentHtml = `
            <td align="center" style="color: #9ca3af; font-style: italic; font-size: 14px; padding: 10px; border: 1px dashed #d1d5db; border-radius: 4px;">
              Configure header content
            </td>`;
        }

        return `
      <tr>
        <td style="background-color: ${escapeAttribute(backgroundColor)}; padding: ${escapeAttribute(padding)};">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              ${contentHtml}
            </tr>
          </table>
        </td>
      </tr>
    `;
    };

    const renderColumnsBlock = (block: EmailBlock): string => {
        const columnCount = Math.max(2, Math.min(4, block.props?.columnCount || 2)) as 2 | 3 | 4;
        const gap = block.props?.gap || '10px';
        const padding = block.props?.padding || '10px';
        const backgroundColor = block.props?.backgroundColor || '#ffffff';

        // Distribute children evenly across columns (same logic as ColumnsBlock component)
        const children = block.children || [];
        const itemsPerColumn = Math.ceil(children.length / columnCount);
        const columns: EmailBlock[][] = [];

        for (let i = 0; i < columnCount; i++) {
            const start = i * itemsPerColumn;
            const end = start + itemsPerColumn;
            columns.push(children.slice(start, end));
        }

        // Calculate column width percentage
        const columnWidthPercent = 100 / columnCount;

        // Convert gap to padding between columns (email clients don't support CSS gap)
        const gapValue = gap.replace('px', '');
        const gapNum = parseInt(gapValue, 10) || 10;
        const columnPadding = `${gapNum / 2}px`;

        // Render each column
        const columnCells = columns.map((columnBlocks, index) => {
            const isFirst = index === 0;
            const isLast = index === columns.length - 1;
            
            // Padding left/right based on gap
            const paddingLeft = isFirst ? '0' : columnPadding;
            const paddingRight = isLast ? '0' : columnPadding;

            const columnContent = columnBlocks.length > 0
                ? columnBlocks.map(renderBlock).join('')
                : '<tr><td>&nbsp;</td></tr>'; // Empty column placeholder

            return `
        <td width="${columnWidthPercent}%" valign="top" style="width: ${columnWidthPercent}%; padding-left: ${paddingLeft}; padding-right: ${paddingRight};">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            ${columnContent}
          </table>
        </td>`;
        }).join('');

        return `
      <tr>
        <td style="padding: ${escapeAttribute(padding)}; background-color: ${escapeAttribute(backgroundColor)};">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%;">
            <tr>
              ${columnCells}
            </tr>
          </table>
        </td>
      </tr>
    `;
    };

    const blocksHtml = children.map(renderBlock).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${escapeAttribute(backgroundColor)}; font-family: ${escapeAttribute(fontFamily)};">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${escapeAttribute(backgroundColor)};">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; margin: 0 auto;">
          ${blocksHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
