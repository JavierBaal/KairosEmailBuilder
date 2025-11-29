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
            case 'divider':
                blockHtml = renderDividerBlock(block);
                break;
            case 'spacer':
                blockHtml = renderSpacerBlock(block);
                break;
            default:
                blockHtml = '';
        }

        // Renderizar bloques hijos recursivamente si existen
        if (block.children && block.children.length > 0) {
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

        return `
      <tr>
        <td align="${escapeAttribute(align)}" style="padding: ${escapeAttribute(padding)}; font-family: ${escapeAttribute(fontFamily)}; color: ${escapeAttribute(color)}; font-size: ${escapeAttribute(fontSize)}; line-height: ${escapeAttribute(lineHeight)};">
          ${escapeHtml(text)}
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
